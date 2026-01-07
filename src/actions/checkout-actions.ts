"use server";

import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AddressFormData } from "@/lib/checkoutSchema";

async function getCurrentUserId() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session-token")?.value;
    if (!sessionCookie) {
      throw new Error("No session cookie found");
    }
    return "user-placeholder-id";
  } catch (error) {
    console.error("Error getting user ID:", error);
    throw new Error("Authentication required");
  }
}

export async function createOrder(addressData: AddressFormData) {
  try {
    console.log("Starting order creation...");

    // Get cart from cookies

    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("movie-shop-cart")?.value;

    console.log("Cart cookie found:", !!cartCookie);

    if (!cartCookie) {
      console.error("No cart cookie found");
      return {
        success: false,
        error: "Your cart is empty. Please add items before checking out.",
      };
    }

    const cartItems = JSON.parse(cartCookie);
    console.log("Cart items:", cartItems.length);

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("Cart is empty or invalid");
      return {
        success: false,
        error: "Your cart is empty. Please add items before checking out.",
      };
    }

    const userId = await getCurrentUserId();
    console.log("User ID:", userId);

    // Calculate total price
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    console.log("Total price:", totalPrice);

    // Verify all items are in stock
    const stockCheckPromises = cartItems.map(async (item) => {
      const movie = await prisma.movie.findUnique({
        where: { id: item.id },
        select: { stock: true, title: true },
      });

      if (!movie) {
        throw new Error(`Movie "${item.title}" not found`);
      }

      if (movie.stock < item.quantity) {
        throw new Error(
          `Not enough stock for "${item.title}". Available: ${movie.stock}, Requested: ${item.quantity}`
        );
      }

      return { ...item, currentStock: movie.stock };
    });

    const verifiedItems = await Promise.all(stockCheckPromises);
    console.log("Stock verification passed");

    // Create address
    const address = await prisma.address.create({
      data: {
        street: addressData.street,
        postalCode: addressData.postalCode,
        city: addressData.city,
        country: addressData.country,
      },
    });
    console.log("Address created:", address.id);

    // Create order with transaction

    const order = await prisma.$transaction(
      async (tx: {
        order: {
          create: (arg0: {
            data: { status: string; userId: string; shippingAddressId: string };
            include: { shippingAddress: boolean; createdAt: boolean };
          }) => Promise<{
            id: string;
            status: string;
            createdAt: Date;
            shippingAddress: {
              id: string;
              street: string;
              postalCode: string;
              city: string;
              country: string;
            };
          }>;
        };
        orderItem: {
          create: (arg0: {
            data: {
              orderId: string;
              movieId: string;
              quantity: number;
              priceAtPurchase: number;
            };
            include: { movie: boolean };
          }) => Promise<{
            id: string;
            movieId: string;
            quantity: number;
            priceAtPurchase: number;
          }>;
        };
        movie: {
          update: (arg0: {
            where: { id: string };
            data: { stock: { decrement: number } };
          }) => Promise<{ id: string; stock: number }>;
        };
      }) => {
        // 1. Create the order

        const newOrder = await tx.order.create({
          data: {
            status: "processing",
            userId: userId,
            shippingAddressId: address.id,
          },
          include: {
            shippingAddress: true,
            createdAt: true,
          },
        });
        console.log("Order created:", newOrder.id);

        // 2. Create order items
        const orderItems = await Promise.all(
          verifiedItems.map((item) =>
            tx.orderItem.create({
              data: {
                orderId: newOrder.id,
                movieId: item.id,
                quantity: item.quantity,
                priceAtPurchase: item.price,
              },
              include: {
                movie: true,
              },
            })
          )
        );
        console.log("Order items created:", orderItems.length);

        // 3. Update movie stock
        await Promise.all(
          verifiedItems.map((item) =>
            tx.movie.update({
              where: { id: item.id },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
          )
        );
        console.log("Stock updated");

        return {
          ...newOrder,
          items: orderItems,
        };
      }
    );

    // 4. Clear cart cookie
    cookieStore.set("movie-shop-cart", "", {
      expires: new Date(0), // Expire immediately
      path: "/",
    });
    console.log("Cart cleared");

    // Revalidate relevant paths
    revalidatePath("/");
    revalidatePath("/cart");
    revalidatePath("/orders");

    console.log("Order creation completed successfully");

    return {
      success: true,
      orderId: order.id,
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        items: await Promise.all(
          order.items.map(async (item) => {
            const movie = await prisma.movie.findUnique({
              where: { id: item.movieId },
              select: { title: true },
            });

            return {
              id: item.id,
              movie: {
                title: movie?.title || "Unknown",
                price: Number(item.priceAtPurchase),
              },
              quantity: item.quantity,
              priceAtPurchase: Number(item.priceAtPurchase),
            };
          })
        ),
        shippingAddress: order.shippingAddress,
        total: totalPrice,
      },
    };
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create order. Please try again.",
    };
  }
}

export async function getOrderDetails(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            movie: {
              select: {
                title: true,
                price: true,
              },
            },
          },
        },
        shippingAddress: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    // Calculate totals

    const subtotal = order.items.reduce(
      (sum: number, item: { priceAtPurchase: number; quantity: number }) =>
        sum + Number(item.priceAtPurchase) * item.quantity,
      0
    );
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.25;
    const total = subtotal + shipping + tax;

    return {
      ...order,
      totals: {
        subtotal,
        shipping,
        tax,
        total,
      },
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
