"use server"

import prisma from "@/lib/prisma"

export const getMovies = async () => {
    return await prisma.movie.findMany({
        include: {
            genres: true,
            moviePersons: true
        }
    });
}

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
            moviePersons: true
        }
    });
}

export const getGenres = async () => {
    return await prisma.genre.findMany();
}

export type getGenresType = Awaited<ReturnType<typeof getGenres>>;
export type getMoviesType = Awaited<ReturnType<typeof getMovies>>;
export type getMovieType = getMoviesType[0]