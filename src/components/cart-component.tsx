"use client";
import type { Cart } from "@/lib/cart/cart.types";
import Link from "next/link";

import { removeFromCart, updateCartQuantity } from "@/lib/cart/cart.actions";
export default function CartComponent(props: { cart: Cart }) {
  const { cart } = props;
  if (!cart.items.length) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl mb-4">Your cart is empty</h1>
        <Link href="/" className="text-blue-600 underline">
          Continue shopping
        </Link>
      </div>
    );
  }
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="mb-4 flex justify-between">
        <span className="font-semibold">Total Items: {cart.totalItems}</span>
        <span className="font-semibold">
          Total Price: ${cart.totalPrice.toFixed(2)}
        </span>
      </div>
      {cart.items.map((item) => (
        <div
          key={item.movieId}
          className="flex justify-between gap-4 border-b py-4"
        >
          <div className="flex gap-4">
            {/* You may want to fetch and display image/title if available */}
            <div>
              <h2 className="font-semibold">Movie ID: {item.movieId}</h2>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>

              {/* REMOVE */}
              <form action={removeFromCart}>
                <input type="hidden" name="movieId" value={item.movieId} />
                <button className="text-red-500 text-sm mt-2">Remove</button>
              </form>
            </div>
          </div>

          {/* QUANTITY UPDATE */}
          <form action={updateCartQuantity} className="flex items-center gap-3">
            <input type="hidden" name="movieId" value={item.movieId} />
            <input
              type="number"
              name="quantity"
              min={1}
              max={10}
              defaultValue={item.quantity}
              className="w-16 text-center border rounded"
              title="Quantity"
            />
            <button className="px-3 py-1 border rounded">Update</button>
          </form>

          <div className="font-semibold">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
