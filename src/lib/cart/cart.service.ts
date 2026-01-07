// src/lib/cart/cart.service.ts

import { PrismaClient } from "@prisma/client";
import { Cart, ResolvedCart, ResolvedCartItem } from "./cart.types";
import prisma from "@/lib/prisma";

export async function resolveCart(cart: Cart): Promise<ResolvedCart> {
  if (cart.items.length === 0) {
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
  }

  const movieIds = cart.items.map((item) => item.movieId);

  const movies = await prisma.movie.findMany({
    where: {
      id: { in: movieIds },
      deleted: false,
    },
  });

  const movieMap = new Map(movies.map((m) => [m.id, m]));

  const resolvedItems: ResolvedCartItem[] = [];

  for (const item of cart.items) {
    const movie = movieMap.get(item.movieId);

    if (!movie) {
      continue;
    }

    const availableStock = Math.max(0, movie.stock);
    if (availableStock === 0) {
      continue;
    }

    const quantity = Math.min(item.quantity, availableStock);
    if (quantity <= 0) {
      continue;
    }

    const subtotal = movie.price * quantity;

    resolvedItems.push({
      movieId: movie.id,
      title: movie.title,
      price: movie.price,
      quantity,
      subtotal,
      imageUrl: movie.imageUrl ?? "",
    });
  }

  const totalItems = resolvedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = resolvedItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  return {
    items: resolvedItems,
    totalItems,
    totalPrice,
  };
}
