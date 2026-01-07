'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_COOKIE_KEY = 'cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  // CRITICAL: track if the cookie has been read yet
  const [isInitialized, setIsInitialized] = useState(false);

  /* 1. Load cart from cookies on mount */
  useEffect(() => {
    const storedCart = Cookies.get(CART_COOKIE_KEY);
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      } catch (error) {
        console.error("Failed to parse cart cookie:", error);
        Cookies.remove(CART_COOKIE_KEY);
      }
    }
    setIsInitialized(true); // Mark as ready
  }, []);

  /* 2. Save cart to cookies ONLY after initialization */
  useEffect(() => {
    if (isInitialized) {
      Cookies.set(CART_COOKIE_KEY, JSON.stringify(cart), {
        expires: 7,
        sameSite: 'lax',
      });
    }
  }, [cart, isInitialized]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, item];
    });
  };

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
  };

  const getTotalItems = () => cart.reduce((acc, item) => acc + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // CRITICAL: Prevent the Checkout page from seeing an empty cart during hydration.
  // This ensures handlePaymentSubmit has access to the actual cart data.
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

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
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
