import prisma from "@/lib/prisma";

export const getActors = await prisma.moviePerson.findMany({
  where: {
    role: {
      contains: "actor",
    },
  },
});

export const getDirectors = await prisma.moviePerson.findMany({
  where: {
    role: {
      contains: "director",
    },
  },
});
