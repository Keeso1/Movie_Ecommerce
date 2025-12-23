"use server"
import prisma from "@/lib/prisma";

export async function getActors() {
  return await prisma.moviePerson.findMany({
    where: {
      role: "actor",
    },
  });
}

export async function getDirectors() {
  return await prisma.moviePerson.findMany({
    where: {
      role: "director",
    },
  });
}
