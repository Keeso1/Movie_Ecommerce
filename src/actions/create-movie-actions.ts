import prisma from "@/lib/prisma";

export const getMoviePersons = await prisma.moviePerson.findMany();
