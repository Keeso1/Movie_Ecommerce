"use server";

import { parseCartCookie } from "@/lib/cart";
import { max } from "date-fns";
import path from "path";
import { any } from "zod";
import { string } from "zod/v3";
import { cookies } from 'next/headers';

const CART_COOKIE = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30,      // 30 days
    path: "/",
}

async function setCartCookie() {}

export async function addToCart(formData: FormData, ){
    const productId = formData.get("productId") as string;

    const cookieStore= await cookies();

    const cart = parseCartCookie(cookieStore.get("cart")?.value);

    await setCartCookie();
}