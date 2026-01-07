<<<<<<< Updated upstream
"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
  } = useCart();

  if (cart.length === 0) {
    return <h2>Your cart is empty 🛒</h2>;
  }
=======
import { getCartFromCookies } from "@/lib/cart/cart.cookies";
import CartComponent from "@/components/cart-component";
import { Button } from "@/components/ui/button";

export default async function CartPage() {
  const cart = await getCartFromCookies();

  console.log("Cart from Cookies:", cart);
>>>>>>> Stashed changes

  const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  console.log("Total price of cart:", totalPrice);
  console.log("Total items in cart:", totalItems);
  return (
<<<<<<< Updated upstream
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 border-b border-border py-4"
        >
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={64}
            height={96}
            className="w-16 h-24 object-cover rounded"
            style={{ width: "4rem", height: "6rem" }}
            unoptimized
          />

          <div className="flex-1">
            <h3 className="font-semibold">{item.title}</h3>
            <p>SEK {item.price}</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => increaseQuantity(item.id)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="text-right mt-6 text-lg font-bold">
        Total: SEK {getTotalPrice().toFixed(0)}
      </div>
=======
    <div className="flex flex-col justify-center items-center">
      <CartComponent cart={cart} />
      <Button
        disabled={totalItems === 0}
        className="mt-4 wrap-self-end bg-amber-500"
      >
        {`Proceed to Checkout SEK ${totalPrice.toFixed(2)}`}
      </Button>
>>>>>>> Stashed changes
    </div>
  );
}
