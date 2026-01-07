"use server";

import prisma from "@/lib/prisma";
import {
  MovieOrderByWithRelationInput,
  MovieWhereInput,
} from "../../generated/prisma/models";
type sortingOptions = "recent" | "oldest" | "price" | "popularity";

export const getMovies = async (
  sort: sortingOptions,
  genre?: string,
  search?: string
) => {
  const whereClause: MovieWhereInput = {
    AND: [
      genre
        ? {
            genres: {
              some: {
                name: genre,
              },
            },
          }
        : {},
      search
        ? {
            OR: [
              {
                moviePersons: {
                  some: {
                    name: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                },
              },
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {},
    ],
  };

  let orderByClause: MovieOrderByWithRelationInput;
  switch (sort) {
    case "recent":
      orderByClause = { releaseDate: "asc" };
      break;
    case "oldest":
      orderByClause = { releaseDate: "desc" };
      break;
    case "price":
      orderByClause = { price: "asc" };
      break;
    default:
      orderByClause = { releaseDate: "asc" };
  }

  const movies = await prisma.movie.findMany({
    where: whereClause,
    include: {
      genres: true,
      moviePersons: true,
    },
    orderBy: orderByClause,
  });
  return movies.map((movie) => ({ ...movie, price: movie.price }));
};

export type { sortingOptions };

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
