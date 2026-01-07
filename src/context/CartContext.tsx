"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

<<<<<<< Updated upstream
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
=======
// Use the same types as server
import type { Cart, CartItem } from "@/lib/cart/cart.types";
>>>>>>> Stashed changes

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_COOKIE_KEY = "cart";

<<<<<<< Updated upstream
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return []; // SSR safety

    const storedCart = Cookies.get(CART_COOKIE_KEY);

    console.log("Loaded cart from cookies:", storedCart);

    if (!storedCart) return [];

    try {
      return JSON.parse(storedCart);
    } catch {
      Cookies.remove(CART_COOKIE_KEY);
      return [];
    }
=======
function calculateTotals(items: CartItem[]) {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
}

export function CartProvider({ children }: React.PropsWithChildren<object>) {
  const [cart, setCart] = useState<Cart>(() => {
    const storedCart = Cookies.get(CART_COOKIE_KEY);
    if (storedCart && storedCart !== "undefined" && storedCart !== "") {
      try {
        const parsed = JSON.parse(storedCart);
        if (parsed && Array.isArray(parsed.items)) {
          const { totalItems, totalPrice } = calculateTotals(parsed.items);
          return { items: parsed.items, totalItems, totalPrice };
        }
      } catch {
        // ignore
      }
    }
    return { items: [], totalItems: 0, totalPrice: 0 };
>>>>>>> Stashed changes
  });

  useEffect(() => {
    Cookies.set(CART_COOKIE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
<<<<<<< Updated upstream
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
=======
      const existing = prev.items.find((i) => i.movieId === item.movieId);
      let newItems;
      if (existing) {
        newItems = prev.items.map((i) =>
          i.movieId === item.movieId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
>>>>>>> Stashed changes
        );
      } else {
        newItems = [...prev.items, { ...item }];
      }
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });

    console.log("Cart updated:", item.title);
  };

<<<<<<< Updated upstream
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    Cookies.remove(CART_COOKIE_KEY);
=======
  const removeFromCart = (movieId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => item.movieId !== movieId);
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });
  };

  const increaseQuantity = (movieId: string) => {
    setCart((prev) => {
      const newItems = prev.items.map((item) =>
        item.movieId === movieId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });
  };

  const decreaseQuantity = (movieId: string) => {
    setCart((prev) => {
      const newItems = prev.items.map((item) =>
        item.movieId === movieId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });
  };

  const updateQuantity = (movieId: string, quantity: number) => {
    setCart((prev) => {
      const newItems = prev.items.map((item) =>
        item.movieId === movieId ? { ...item, quantity } : item
      );
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
>>>>>>> Stashed changes
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
