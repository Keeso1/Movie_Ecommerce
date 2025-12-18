import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedGenres() {
  const genres = [
    // Core narrative

    "Drama",
    "Comedy",
    "Thriller",
    "Crime",
    "Romance",
    "Adventure",
    "Fantasy",
    "Science Fiction",
    "Horror",
    "Mystery",

    // Historical & social

    "Biography",
    "Historical",
    "War",
    "Political",
    "Western",

    // Documentary & realism

    "Documentary",

    //      Performing arts

    "Musical",
    "Rock Opera",

    //      Analytical / academic

    "Art House",
    "Satire",
    "Coming-of-Age",
    "Psychological",
    "Financial Thriller",
  ];

  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}

/**
             * Optional default export for seed runners

            //  export default seedGenres;

            **/
