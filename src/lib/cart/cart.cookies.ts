import { cookies } from "next/headers";
import type { Cart } from "./cart.types";
import { parseCartCookie } from "./cart.parser";

const CART_COOKIE_NAME = "cart";

export async function getCartFromCookies(): Promise<Cart> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE_NAME)?.value;

  return parseCartCookie(raw);
}
