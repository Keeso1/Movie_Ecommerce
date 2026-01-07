"use server";

import { cookies } from "next/headers";
import type { Cart } from "./cart.types";
import { getCartFromCookies } from "./cart.cookies";

const CART_COOKIE_NAME = "cart";

const MAX_ITEMS = 20;
const MAX_QUANTITY_PER_ITEM = 10;
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

//   Adds one unit of a movie to the cart.

export async function addToCart(formData: FormData): Promise<void> {
  const movieId = formData.get("movieId");
  if (typeof movieId !== "string") return;

  const cart = await getCartFromCookies();

  const existing = cart.items.find((item) => item.movieId === movieId);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + 1, MAX_QUANTITY_PER_ITEM);
  } else {
    if (cart.items.length >= MAX_ITEMS) return;

    cart.items.push({
      movieId,
      quantity: 1,
    });
  }

  await writeCartCookie(cart);
}

//   Removes a movie completely from the cart.

export async function removeFromCart(formData: FormData): Promise<void> {
  const movieId = formData.get("movieId");
  if (typeof movieId !== "string") return;

  const cart = await getCartFromCookies();

  cart.items = cart.items.filter((item) => item.movieId !== movieId);

  await writeCartCookie(cart);
}

//   Updates quantity for a specific movie.

export async function updateCartQuantity(formData: FormData): Promise<void> {
  const movieId = formData.get("movieId");
  const quantity = Number(formData.get("quantity"));

  if (typeof movieId !== "string" || Number.isNaN(quantity)) return;

  const cart = await getCartFromCookies();

  const item = cart.items.find((item) => item.movieId === movieId);

  if (!item) return;

  if (quantity < 1) {
    cart.items = cart.items.filter((i) => i.movieId !== movieId);
  } else {
    item.quantity = Math.min(quantity, MAX_QUANTITY_PER_ITEM);
  }

  await writeCartCookie(cart);
}

//   Writes the cart cookie.

async function writeCartCookie(cart: Cart): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart.items), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}
