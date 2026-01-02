//admin/movies/people/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// List all movie persons
export async function getMoviePersons() {
  return await prisma.moviePerson.findMany({
    orderBy: { name: "asc" },
    include: {
      movies: {
        select: {
          id: true,
          title: true,
          releaseDate: true,
        },
      },
    },
  });
}

// Get a specific movie person by ID
export async function getMoviePersonById(id: string) {
  return await prisma.moviePerson.findUnique({
    where: { id },
    include: {
      movies: {
        select: {
          id: true,
          title: true,
          releaseDate: true,
        },
      },
    },
  });
}

// Create a new movie person
export async function createMoviePerson(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;

  if (!name || !role) {
    throw new Error("Name and role are required");
  }

  const moviePerson = await prisma.moviePerson.create({
    data: {
      name,
      role,
    },
  });

  revalidatePath("/admin/movies/people");
  return moviePerson;
}

// Update a movie person
export async function updateMoviePerson(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;

  if (!name || !role) {
    throw new Error("Name and role are required");
  }

  const moviePerson = await prisma.moviePerson.update({
    where: { id },
    data: {
      name,
      role,
    },
  });

  revalidatePath("/admin/movies/people");
  revalidatePath(`/admin/movies/people/${id}`);
  return moviePerson;
}

// Delete a movie person
export async function deleteMoviePerson(id: string) {
  const moviePerson = await prisma.moviePerson.delete({
    where: { id },
  });

  revalidatePath("/admin/movies/people");
  return moviePerson;
}

// Associate a person with a movie
export async function associatePersonWithMovie(
  personId: string,
  movieId: string
) {
  // Using the implicit many-to-many relation
  const result = await prisma.moviePerson.update({
    where: { id: personId },
    data: {
      movies: {
        connect: { id: movieId },
      },
    },
    include: {
      movies: true,
    },
  });

  revalidatePath("/admin/movies/people");
  revalidatePath(`/admin/movies/people/${personId}`);
  return result;
}

// Remove association between person and movie
export async function removePersonFromMovie(personId: string, movieId: string) {
  const result = await prisma.moviePerson.update({
    where: { id: personId },
    data: {
      movies: {
        disconnect: { id: movieId },
      },
    },
    include: {
      movies: true,
    },
  });

  revalidatePath("/admin/movies/people");
  revalidatePath(`/admin/movies/people/${personId}`);
  return result;
}

// Get all movies for dropdown
export async function getAllMovies() {
  return await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      releaseDate: true,
    },
    orderBy: { title: "asc" },
  });
}
