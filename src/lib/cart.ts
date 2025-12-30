import { CartItem } from "@/context/CartContext";

export function parseCartCookie(CartCookie: string | undefined) {
  {
    if (!CartCookie) return [];
    try {
      return JSON.parse(CartCookie);
    } catch {
      return [];
    }
  }
}

export function addToCart(
    items: CartItem[], productId: string, quantity: number = 1,
)