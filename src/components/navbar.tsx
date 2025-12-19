'use client';

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Navbar() {
  const session = authClient.useSession();
  const router = useRouter();
  const { getTotalItems } = useCart();

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link href="/" className="font-bold text-lg">
        Movie Store
      </Link>
      <div className="flex gap-1">
        <Link href="/cart" className="relative">
            🛒
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
              </>) : 
              (<>
              <Button onClick={async () =>{
                  await authClient.signOut();
                  router.refresh();
              }}>
                  Sign Out
              </Button>
            </>)}
      </div>
    </nav>
  );
}
