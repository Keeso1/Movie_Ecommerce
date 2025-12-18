                                /*  CRUD Server Actions for Movie Management  */

"use server";

import { movieSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";

export async function listMovies() {
  return await prisma.movie.findMany({
    orderBy: { releaseDate: "desc" },
  });
}

export async function createMovie(formData: FormData) {
  const validated = movieSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    releaseYear: Number(formData.get("releaseYear")),
    imageUrl: formData.get("imageUrl"),
    price: formData.get("price"),
                                    // releaseDate: formData.get("releaseDate"),
  });

  if (!validated.success) {
    throw new Error(JSON.stringify(validated.error.flatten()));
  }

  return await prisma.movie.create({
    data: {
      ...validated.data,
      price: validated.data.price ? Number(validated.data.price) : 0,
      releaseDate: validated.data.releaseDate
        ? new Date(validated.data.releaseDate)
        : new Date(),
    },
  });
}
