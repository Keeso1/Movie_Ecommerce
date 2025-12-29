"use client";

import { createOrder } from "@/actions/checkout-actions";
import { useState } from "react";

export default function Page() {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const submitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createOrder({
      street,
      city,
      postalCode,
      country,
    });
  };
  return (
    <div>
      <form onSubmit={submitOrder}>
        <label>
          Street:
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </label>

        <label>
          City:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>

        <label>
          Postal Code:
          <input
            type="number"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </label>

        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
