"use client";

import { Button } from "./ui/button";

import { Link } from "lucide-react";

export function CartBadge() {
  return (
    <Button asChild>
      <Link href="/cart">Cart</Link>
    </Button>
  );
}
