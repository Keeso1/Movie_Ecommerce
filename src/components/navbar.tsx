"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { ModeToggle } from "./ThemeToggle";

export default function Navbar() {
  const session = authClient.useSession();
  const router = useRouter();
  const { cart } = useCart();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate total items once to avoid hydration mismatch

  const totalItems = cart.length;

  return (
    <nav className="bg-white dark:bg-black shadow p-4 flex justify-between sticky top-0 z-50">
      <Link href="/" className="font-bold text-lg">
        Movie Store
      </Link>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline">
          <Link href="/cart" className="relative">
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-2 -left-3 bg-red-600 text-white text-xs rounded-full px-2 whitespace-nowrap">
                {cart.length}
              </span>
            )}
          </Link>
        </Button>
        <ModeToggle />
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
          <Button
            onClick={async () => {
              await authClient.signOut();
              router.refresh();
            }}
          >
            Sign Out
          </Button>
        )}
      </div>
    </nav>
  );
}
