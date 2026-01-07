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

  // New format: full cart object
  if (
    typeof parsed === "object" &&
    parsed !== null &&
    Array.isArray((parsed as any).items)
  ) {
    const items = (parsed as any).items as CartItem[];
    const totalItems =
      typeof (parsed as any).totalItems === "number"
        ? (parsed as any).totalItems
        : items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice =
      typeof (parsed as any).totalPrice === "number"
        ? (parsed as any).totalPrice
        : items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return { items, totalItems, totalPrice };
  }

  // Old format: array of items only
  if (!Array.isArray(parsed)) {
    return { items: [] };
  }

  let items: CartItem[] = [];
  let totalItems = 0;
  let totalPrice = 0;

  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }

    const item = entry as UnknownCartItem & { price?: unknown };

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

    const price = typeof item.price === "number" ? item.price : 10; // fallback

    items.push({
      movieId: item.movieId,
      quantity,
      price,
    });

    if (items.length >= MAX_ITEMS) {
      break;
    }
  }
  totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return { items, totalItems, totalPrice };
}
