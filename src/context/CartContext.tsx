"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export interface CartItem {
  movieId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (movieId: string) => void;
  increaseQuantity: (movieId: string) => void;
  decreaseQuantity: (movieId: string) => void;
  updateQuantity: (movieId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_COOKIE_KEY = "cart";

export function CartProvider({ children }: React.PropsWithChildren<object>) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = Cookies.get(CART_COOKIE_KEY);
    if (storedCart && storedCart !== "undefined" && storedCart !== "") {
      try {
        return JSON.parse(storedCart);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    Cookies.set("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.movieId === item.movieId);
      if (existing) {
        return prev.map((i) =>
          i.movieId === item.movieId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item }];
    });
  };

  const removeFromCart = (movieId: string) => {
    setCart((prev) => prev.filter((item) => item.movieId !== movieId));
  };

  const increaseQuantity = (movieId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.movieId === movieId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (movieId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.movieId === movieId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const updateQuantity = (movieId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.movieId === movieId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () =>
    cart.reduce((acc, item) => acc + item.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
        getTotalItems,
        getTotalPrice,
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
