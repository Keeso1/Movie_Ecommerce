type UnknownCartItem = {
  movieId?: unknown;
  quantity?: unknown;
};

import { Cart, CartItem } from "./cart.types";

const MAX_ITEMS = 20;
const MAX_QUANTITY_PER_ITEM = 10;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseCartCookie(rawCookie?: string): Cart {
  if (!rawCookie) {
    return { items: [] };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawCookie);
  } catch {
    return { items: [] };
  }

  if (!Array.isArray(parsed)) {
    return { items: [] };
  }

  const items: CartItem[] = [];

  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }

    const item = entry as UnknownCartItem;

    if (typeof item.movieId !== "string") {
      continue;
    }

    if (typeof item.quantity !== "number") {
      continue;
    }

    const quantity = Math.floor(item.quantity);

    if (!UUID_REGEX.test(item.movieId)) {
      continue;
    }

    if (quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      continue;
    }

    items.push({
      movieId: item.movieId,
      quantity,
    });

    if (items.length >= MAX_ITEMS) {
      break;
    }
  }
  return { items };
}
