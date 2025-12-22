'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();

  if (cart.length === 0) {
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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row justify-between gap-4 border-b py-4"
        >
          <div className="flex gap-4">
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={80}
              height={120}
              className="object-cover rounded"
            />
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm mt-2"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Quantity controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => decreaseQuantity(item.id)}
              className="px-3 py-1 border rounded"
            >
              −
            </button>

            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.id, Number(e.target.value))
              }
              className="w-16 text-center border rounded"
            />

            <button
              onClick={() => increaseQuantity(item.id)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>

          <div className="font-semibold">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      ))}

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={clearCart}
          className="text-red-600 underline"
        >
          Clear cart
        </button>

        <div className="text-right">
          <p className="text-xl font-bold">
            Total: ${getTotalPrice().toFixed(2)}
          </p>
          <Link href="/checkout">
          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded">
            Checkout
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
