"use server"

import prisma from "@/lib/prisma"

export const getMovies = async () => {
    return await prisma.movie.findMany();
}

export const getMovieById = async (id: string) => {
    return await prisma.movie.findUnique({
        where: {
            id
        }
    });
}

export type Movies = Awaited<ReturnType<typeof getMovies>>;