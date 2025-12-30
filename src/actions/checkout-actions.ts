"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

type AddressFormData = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

type CartItem = {
  movieId: string;
  quantity: number;
  price: number;
};

export async function createOrder(
  addressData: AddressFormData,
  cartItems: CartItem[]
) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const session = await auth.api.getSession({
    headers: {
      cookie: cookieHeader,
    },
  });

  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, message: "User not authenticated" };
  }

  const address = await prisma.address.create({
    data: {
      street: addressData.street,
      city: addressData.city,
      postalCode: addressData.postalCode,
      country: addressData.country,
    },
  });

  const order = await prisma.order.create({
    data: {
      userId,
      shippingAddressId: address.id,
      status: "pending",
    },
  });

  await Promise.all(
    cartItems.map((item) =>
      prisma.orderItem.create({
        data: {
          orderId: order.id,
          movieId: item.movieId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        },
      })
    )
  );

  return { success: true, orderId: order.id };
}
