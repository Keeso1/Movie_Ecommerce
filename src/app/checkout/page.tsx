"use client";

import { createOrder } from "@/actions/checkout-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define CartItem type or import it from your models/types

type CartItem = {
  movieId: string;
  quantity: number;
  price: number;
};

export default function Page() {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const router = useRouter();

  // You need to get cartItems from somewhere, e.g., props, context, or state
  // For demonstration, we'll use an empty array. Replace with actual cart items.

  const submitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submit clicked — starting createOrder()...");

    const res = await createOrder(
      { street, city, postalCode, country },
      cartItems
    );

    console.log("Server action result:", res);

    if (res.success) {
      router.push(`/checkout/payment?order=${res.orderId}`);
    }
  };

  const cartItems: CartItem[] = [];

  // TODO: [ Replace with actual cart items ]

  return (
    <div>
      <form onSubmit={submitOrder}>
        <input
          type="text"
          placeholder="Street"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <button type="submit">Place order</button>
      </form>
    </div>
  );
}
