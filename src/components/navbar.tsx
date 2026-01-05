"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import ThemeToggle from "@/components/ThemeToggle";

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

					{/* AUTH */}
					{session.data === null ? (
						<>
							<Button asChild variant="outline">
								<Link href="/signup">Sign Up</Link>
							</Button>
							<Button asChild>
								<Link href="/signin">Sign In</Link>
							</Button>
						</>
					) : (
						<>
							<span className="text-sm text-muted-foreground">
								{session.data.user?.name}
							</span>
							<Button
								variant="destructive"
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
			</div>
		</nav>
	);
}
