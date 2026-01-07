"use server";

import prisma  from "@/lib/prisma";
import { OrderStatus }  from "@/lib/types";

export async function getOrdersByUserId(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            movie: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function getOrderById(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            movie: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
        // Don't include user information for public access
        userId: false,
        user: false,
      },
    });
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export async function getOrderByIdForUser(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId, // Only return if user owns the order
      },
      include: {
        items: {
          include: {
            movie: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return order;
  } catch (error) {
    console.error("Error fetching order for user:", error);
    return null;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    return null;
  }
}

// Add this function to your existing order-actions.ts
export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            movie: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        shippingAddress: {
          select: {
            street: true,
            city: true,
            postalCode: true,
            country: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Convert Decimal to number for serialization
    return orders.map((order) => ({
      ...order,
      totalAmount: order.totalAmount?.toNumber() || 0,
      items: order.items.map((item) => ({
        ...item,
        priceAtPurchase: item.priceAtPurchase?.toNumber() || 0,
        movie: {
          ...item.movie,
          price: item.movie.price?.toNumber() || 0,
        },
      })),
    }));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
}
