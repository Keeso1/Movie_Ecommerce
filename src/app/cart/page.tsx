import Image from "next/image";
import Link from "next/link";
import { getCartFromCookies } from "@/lib/cart/cart.cookies";
import { resolveCart } from "@/lib/cart/cart.service";
import { removeFromCart, updateCartQuantity } from "@/lib/cart/cart.actions";

export default async function CartPage() {
  const cart = await getCartFromCookies();
  const resolvedCart = await resolveCart(cart);

  if (resolvedCart.items.length === 0) {
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

      {resolvedCart.items.map((item) => (
        <div
          key={item.movieId}
          className="flex justify-between gap-4 border-b py-4"
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
