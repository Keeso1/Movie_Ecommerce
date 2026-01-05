"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import ThemeToggle from "@/components/ThemeToggle";

import { ShoppingCartIcon } from "lucide-react";
export default function Navbar() {
	const session = authClient.useSession();
	const router = useRouter();
	const { getTotalItems } = useCart();
	const totalItems = getTotalItems();

	return (
		<nav className="border-b bg-white dark:bg-black">
			<div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
				{/* LEFT: Logo / Home */}

				{/* RIGHT: Actions */}
				<div className="flex items-center gap-4">
					{/* 🌗 THEME TOGGLE — ALWAYS VISIBLE */}
					<ThemeToggle />

					{/* CART */}
					<Link href="/cart" className="relative">
						Cart
						{totalItems > 0 && (
							<span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
								{totalItems}
							</span>
						)}
					</Link>

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link href="/" className="font-bold text-lg">
        Movie Store
      </Link>

      <div className="flex gap-1">
        <Link href="/cart" className="relative">
          <ShoppingCartIcon></ShoppingCartIcon>
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2">
              {getTotalItems()}
            </span>
          )}
        </Link>
        <p>{session.data?.user.name}</p>
        {session.data === null ? (
          <>
            <Button asChild>
              <Link href={"/signup"}>SignUp</Link>
            </Button>
            <Button asChild>
              <Link href={"/signin"}>SignIn</Link>
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={async () => {
                await authClient.signOut();
                router.refresh();
              }}
            >
              Sign Out
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
