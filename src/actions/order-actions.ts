"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Simple payment simulator: waits ms and fails ~10% of the time

async function simulatePayment(amount: number, ms = 1500) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  if (Math.random() < 0.1) {
    throw new Error("Payment processing failed");
  }
  return true;
}

export type CheckoutInput = {
  items: {
    id: string;
    price: number;
    quantity: number;
  }[];
  address: {
    fullName: string;
    street: string;
    city: string;
    country: string;
    zip: string;
  };
  total: number;
};

/**
 * Creates an order and returns its ID
 */

export async function createOrder(data: CheckoutInput) {
  //  Only use cookies, no headers needed for manual headers object
  const session = await auth.api.getSession({
    headers: await headers(), // automatically includes cookies
  });

  // Optional: allow guest checkout
  /* if (!session?.user?.id) {
  throw new Error('Not authenticated')
} */

  //  simulate payment (may throw)
  await simulatePayment(data.total);

  const userConnect = session?.user?.id
    ? { connect: { id: session.user.id } }
    : undefined;

  const order = await prisma.order.create({
    data: {
      ...(userConnect ? { user: userConnect } : {}),
      status: "ORDER_CONFIRMED",
      items: {
        create: data.items.map((item) => ({
          movie: { connect: { id: item.id } },
          priceAtPurchase: item.price,
          quantity: item.quantity,
        })),
      },
      shippingAddress: {
        create: {
          street: data.address.street,
          city: data.address.city,
          country: data.address.country,
          postalCode: data.address.zip, // zip → postalCode mapping
        },
      },
    },
  });

  return order.id;
}

export type UpdateMovieInput = {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  // Add other fields as needed
};

export async function updateMovie(data: UpdateMovieInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.role || session.user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  const updated = await prisma.movie.update({
    where: { id: data.id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      // Add other fields as needed
    },
  });

  return updated;
}
