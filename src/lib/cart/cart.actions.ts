"use server";

import { cookies } from "next/headers";
import type { Cart, CartItem } from "./cart.types";
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

  // Fetch price for the movie (simulate or fetch from DB as needed)
  // For now, let's assume a function getMoviePrice(movieId: string): number exists
  const price = await getMoviePrice(movieId);

  const existing = cart.items.find((item) => item.movieId === movieId);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + 1, MAX_QUANTITY_PER_ITEM);
  } else {
    if (cart.items.length >= MAX_ITEMS) return;

    cart.items.push({
      movieId,
      quantity: 1,
      price,
    });
  }

  updateCartTotals(cart);
  await writeCartCookie(cart);
}

//   Removes a movie completely from the cart.

export async function removeFromCart(formData: FormData): Promise<void> {
  const movieId = formData.get("movieId");
  if (typeof movieId !== "string") return;

  const cart = await getCartFromCookies();

  cart.items = cart.items.filter((item) => item.movieId !== movieId);
  updateCartTotals(cart);
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
  updateCartTotals(cart);
  await writeCartCookie(cart);
}

//   Writes the cart cookie.

function updateCartTotals(cart: Cart) {
  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
}

async function writeCartCookie(cart: Cart): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

// Dummy function for price fetching (replace with real DB call)
async function getMoviePrice(movieId: string): Promise<number> {
  // TODO: Replace with actual DB call
  return 10; // Example static price
}
