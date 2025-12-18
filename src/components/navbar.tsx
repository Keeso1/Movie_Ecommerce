'use client';

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { getTotalItems } = useCart();

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link href="/" className="font-bold text-lg">
        Movie Store
      </Link>

      <Link href="/cart" className="relative">
        🛒
        {getTotalItems() > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2">
            {getTotalItems()}
          </span>
        )}
      </Link>
    </nav>
  );
}
