import type { Movie as PrismaMovie, Genre } from "../../generated/prisma/client";

// Type for Movie with genres included (from Prisma query with include)
export type MovieWithGenres = PrismaMovie & {
  genres: Genre[];
};

// Client-safe type for Movie (serialized for client components)
export interface Movie {
  id: string;
  title: string;
  description: string;
  price: number; // Converted from Decimal
  releaseDate: string; // Converted from DateTime
  imageUrl: string;
  runtime: number | null;
  deleted?: boolean | null;
  genres: Genre[]; // Direct Genre array from Prisma
}
