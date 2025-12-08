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
    return await prisma.movie.findUnique({
        where: {
            id
        },
        include: {
            genres: true,
            moviePersons: true
        }
    });
}

export type getMoviesType = Awaited<ReturnType<typeof getMovies>>;
export type getMovieType = getMoviesType[0]