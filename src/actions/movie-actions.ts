"use server";

import prisma from "@/lib/prisma";

export const getMovies = async (genre?: string) => {
  const movies = await prisma.movie.findMany({
    where: genre
      ? {
          genres: {
            some: {
              name: genre,
            },
          },
        }
      : {},
    include: {
      genres: true,
      moviePersons: true,
    },
  });
  return movies.map((movie) => ({ ...movie, price: movie.price.toNumber() }));
};

export const getMovieById = async (id: string) => {
  if (!id) {
    return null;
  }
  return await prisma.movie.findUnique({
    where: {
      id: id,
    },
    include: {
      genres: true,
      moviePersons: true,
    },
  });
};

export const getGenres = async () => {
  return await prisma.genre.findMany();
};

export type getGenresType = Awaited<ReturnType<typeof getGenres>>;
export type getMoviesType = Awaited<ReturnType<typeof getMovies>>;
export type getMovieType = getMoviesType[0];
