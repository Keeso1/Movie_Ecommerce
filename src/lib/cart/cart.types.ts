import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface CartItem {
  movieId: string; // UUID from Movie.id
  quantity: number; // Integer >= 1
}

export interface Cart {
  items: CartItem[];
}

export interface ResolvedCartItem {
  imageUrl: string | StaticImport;
  movieId: string;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ResolvedCart {
  items: ResolvedCartItem[];
  totalItems: number;
  totalPrice: number;
}
