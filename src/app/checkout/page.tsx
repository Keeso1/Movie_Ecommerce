"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createOrder } from "@/actions/order-actions";

type CartItem = {
  id: string;
  price: number;
  quantity: number;
};

export default function Page() {
  const router = useRouter();

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // TODO: Replace with real cart state
  const cartItems: CartItem[] = [];

  const submitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      console.warn("Cart is empty – order not submitted");
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      const { orderId } = await createOrder({
        items: cartItems,
        total,
        address: {
          fullName: "Guest",
          street,
          city,
          country,
          zip: postalCode,
        },
      });

      router.push(`/checkout/payment?order=${orderId}`);
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <form
        onSubmit={submitOrder}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm space-y-4"
      >
        <input
          type="text"
          placeholder="Street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2"
        />

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2"
        />

        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2"
        />

        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2"
        />

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-white font-medium"
        >
          Submit order
        </button>
      </form>
    </div>
  );
}
