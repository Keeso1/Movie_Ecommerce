"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateMovie(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) {
    throw new Error("Missing movie ID");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const runtimeRaw = formData.get("runtime") as string;
  const priceRaw = formData.get("price") as string;
  const stockRaw = formData.get("stock") as string;
  const releaseDateRaw = formData.get("releaseDate") as string;

  const runtime =
    runtimeRaw && !isNaN(Number(runtimeRaw)) ? Number(runtimeRaw) : null;

  const price = Number(priceRaw);
  const stock = Number(stockRaw);
  const releaseDate = new Date(releaseDateRaw);

  // ---------- UPDATE MOVIE ----------
  await prisma.movie.update({
    where: { id },
    data: {
      title,
      description,
      imageUrl,
      runtime,
      price,
      stock,
      releaseDate,
    },
  });

  redirect("/admin/movies");
}
