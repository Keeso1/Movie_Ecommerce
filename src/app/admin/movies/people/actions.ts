//admin/movies/people/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// Helper function to serialize Decimal to number
function serializeDecimal(value: any): number {
  if (value && typeof value === "object" && "toNumber" in value) {
    return value.toNumber();
  }
  return Number(value) || 0;
}

// Helper function to serialize movie data
function serializeMovie(movie: any) {
  return {
    ...movie,
    price: serializeDecimal(movie.price),
    releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
  };
}

// List all movie persons
export async function getMoviePersons() {
  try {
    const persons = await prisma.moviePerson.findMany({
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

    // Serialize the results
    return persons.map((person) => ({
      ...person,
      movies:
        person.movies?.map((movie) => ({
          ...movie,
          releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
        })) || [],
    }));
  } catch (error) {
    console.error("Error fetching movie persons:", error);
    throw new Error("Failed to fetch movie persons");
  }
}

// Get a specific movie person by ID
export async function getMoviePersonById(id: string) {
  try {
    const person = await prisma.moviePerson.findUnique({
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

    if (!person) return null;

    // Serialize the result
    return {
      ...person,
      movies:
        person.movies?.map((movie) => ({
          ...movie,
          releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
        })) || [],
    };
  } catch (error) {
    console.error("Error fetching movie person:", error);
    throw new Error("Failed to fetch movie person");
  }
}

// Create a new movie person
export async function createMoviePerson(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const customRole = formData.get("customRole") as string;

  if (!name || !role) {
    throw new Error("Name and role are required");
  }

  // Use custom role if provided and role is "other"
  const finalRole = role === "other" && customRole ? customRole : role;

  try {
    const moviePerson = await prisma.moviePerson.create({
      data: {
        name,
        role: finalRole,
      },
    });

    revalidatePath("/admin/movies/people");
    return moviePerson;
  } catch (error) {
    console.error("Error creating movie person:", error);
    throw new Error("Failed to create movie person");
  }
}

// Update a movie person
export async function updateMoviePerson(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const customRole = formData.get("customRole") as string;

  if (!name || !role) {
    throw new Error("Name and role are required");
  }

  // Use custom role if provided and role is "other"
  const finalRole = role === "other" && customRole ? customRole : role;

  try {
    const moviePerson = await prisma.moviePerson.update({
      where: { id },
      data: {
        name,
        role: finalRole,
      },
    });

    revalidatePath("/admin/movies/people");
    revalidatePath(`/admin/movies/people/${id}`);
    return moviePerson;
  } catch (error) {
    console.error("Error updating movie person:", error);
    throw new Error("Failed to update movie person");
  }
}

// Delete a movie person
export async function deleteMoviePerson(id: string) {
  try {
    const moviePerson = await prisma.moviePerson.delete({
      where: { id },
    });

    revalidatePath("/admin/movies/people");
    return moviePerson;
  } catch (error) {
    console.error("Error deleting movie person:", error);
    throw new Error("Failed to delete movie person");
  }
}

// Associate a person with a movie
export async function associatePersonWithMovie(
  personId: string,
  movieId: string
) {
  try {
    // Using the implicit many-to-many relation
    const result = await prisma.moviePerson.update({
      where: { id: personId },
      data: {
        movies: {
          connect: { id: movieId },
        },
      },
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

    revalidatePath("/admin/movies/people");
    revalidatePath(`/admin/movies/people/${personId}`);

    // Serialize the result
    return {
      ...result,
      movies:
        result.movies?.map((movie) => ({
          ...movie,
          releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
        })) || [],
    };
  } catch (error) {
    console.error("Error associating person with movie:", error);
    throw new Error("Failed to associate person with movie");
  }
}

// Remove association between person and movie
export async function removePersonFromMovie(personId: string, movieId: string) {
  try {
    const result = await prisma.moviePerson.update({
      where: { id: personId },
      data: {
        movies: {
          disconnect: { id: movieId },
        },
      },
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

    revalidatePath("/admin/movies/people");
    revalidatePath(`/admin/movies/people/${personId}`);

    // Serialize the result
    return {
      ...result,
      movies:
        result.movies?.map((movie) => ({
          ...movie,
          releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
        })) || [],
    };
  } catch (error) {
    console.error("Error removing person from movie:", error);
    throw new Error("Failed to remove person from movie");
  }
}

// Get all movies for dropdown
export async function getAllMovies() {
  try {
    const movies = await prisma.movie.findMany({
      select: {
        id: true,
        title: true,
        releaseDate: true,
        price: true,
      },
      orderBy: { title: "asc" },
    });

    // Serialize the results
    return movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
      price: serializeDecimal(movie.price),
    }));
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw new Error("Failed to fetch movies");
  }
}

// Get all movies for dropdown (filtered for non-deleted movies)
export async function getAllMoviesForDropdown() {
  try {
    const movies = await prisma.movie.findMany({
      select: {
        id: true,
        title: true,
        releaseDate: true,
      },
      orderBy: { title: "asc" },
      where: {
        deleted: false, // Only show non-deleted movies
      },
    });

    // Serialize the results
    return movies.map((movie) => ({
      ...movie,
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
    }));
  } catch (error) {
    console.error("Error fetching movies for dropdown:", error);
    throw new Error("Failed to fetch movies");
  }
}

// Quick associate person with movie from form
export async function quickAssociateMoviePerson(formData: FormData) {
  const personId = formData.get("personId") as string;
  const movieId = formData.get("movieId") as string;

  if (!personId || !movieId) {
    throw new Error("Person ID and Movie ID are required");
  }

  try {
    const result = await prisma.moviePerson.update({
      where: { id: personId },
      data: {
        movies: {
          connect: { id: movieId },
        },
      },
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

    revalidatePath("/admin/movies/people");
    revalidatePath(`/admin/movies/people/${personId}`);

    // Serialize the result
    return {
      ...result,
      movies:
        result.movies?.map((movie) => ({
          ...movie,
          releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
        })) || [],
    };
  } catch (error) {
    console.error("Error quick associating movie:", error);
    throw new Error("Failed to associate movie");
  }
}

// Create a new movie and associate it with a person
export async function createMovieAndAssociate(
  personId: string,
  formData: FormData
) {
  const title = formData.get("title") as string;
  const releaseYear = formData.get("releaseYear") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!title || !releaseYear) {
    throw new Error("Title and release year are required");
  }

  try {
    // First create the movie
    const movie = await prisma.movie.create({
      data: {
        title: title.trim(),
        description: description || `Movie: ${title}`,
        price: price ? parseFloat(price) : 9.99,
        releaseDate: new Date(`${releaseYear}-01-01`),
        imageUrl: imageUrl || "",
        stock: 1,
        runtime: 120,
      },
    });

    // Then associate it with the person
    const result = await prisma.moviePerson.update({
      where: { id: personId },
      data: {
        movies: {
          connect: { id: movie.id },
        },
      },
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

    revalidatePath("/admin/movies/people");
    revalidatePath(`/admin/movies/people/${personId}`);
    revalidatePath("/admin/movies");

    // Serialize the result
    return {
      ...serializeMovie(movie),
      associatedPerson: {
        ...result,
        movies:
          result.movies?.map((m) => ({
            ...m,
            releaseDate: m.releaseDate ? new Date(m.releaseDate) : null,
          })) || [],
      },
    };
  } catch (error) {
    console.error("Error creating and associating movie:", error);
    throw new Error("Failed to create and associate movie");
  }
}

// Bulk associate multiple movies with a person
export async function bulkAssociateMovies(
  personId: string,
  movieIds: string[]
) {
  try {
    const result = await prisma.moviePerson.update({
      where: { id: personId },
      data: {
        movies: {
          connect: movieIds.map((id) => ({ id })),
        },
      },
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

    revalidatePath("/admin/movies/people");
    revalidatePath(`/admin/movies/people/${personId}`);

    // Serialize the result
    return {
      ...result,
      movies:
        result.movies?.map((movie) => ({
          ...movie,
          releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
        })) || [],
    };
  } catch (error) {
    console.error("Error bulk associating movies:", error);
    throw new Error("Failed to associate movies");
  }
}

// Get movies not associated with a specific person
export async function getAvailableMoviesForPerson(personId: string) {
  try {
    // First get the person with their movies
    const person = await prisma.moviePerson.findUnique({
      where: { id: personId },
      include: {
        movies: {
          select: { id: true },
        },
      },
    });

    if (!person) {
      throw new Error("Person not found");
    }

    // Get all movies except those already associated
    const associatedMovieIds = person.movies.map((movie) => movie.id);

    const movies = await prisma.movie.findMany({
      where: {
        id: {
          notIn: associatedMovieIds,
        },
        deleted: false,
      },
      select: {
        id: true,
        title: true,
        releaseDate: true,
      },
      orderBy: { title: "asc" },
    });

    // Serialize the results
    return movies.map((movie) => ({
      ...movie,
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
    }));
  } catch (error) {
    console.error("Error fetching available movies:", error);
    throw new Error("Failed to fetch available movies");
  }
}

// Search movie persons by name or role
export async function searchMoviePersons(query: string) {
  try {
    const persons = await prisma.moviePerson.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            role: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        movies: {
          select: {
            id: true,
            title: true,
            releaseDate: true,
          },
        },
      },
      orderBy: { name: "asc" },
      take: 20, // Limit results
    });

    // Serialize the results
    return persons.map((person) => ({
      ...person,
      movies:
        person.movies?.map((movie) => ({
          ...movie,
          releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
        })) || [],
    }));
  } catch (error) {
    console.error("Error searching movie persons:", error);
    throw new Error("Failed to search movie persons");
  }
}

// Create a standalone movie (for use in other components)
export async function createMovie(formData: FormData) {
  const title = formData.get("title") as string;
  const releaseYear = formData.get("releaseYear") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const runtime = formData.get("runtime") as string;

  if (!title || !releaseYear) {
    throw new Error("Title and release year are required");
  }

  try {
    const movie = await prisma.movie.create({
      data: {
        title: title.trim(),
        description: description || `Movie: ${title}`,
        price: price ? parseFloat(price) : 9.99,
        releaseDate: new Date(`${releaseYear}-01-01`),
        imageUrl: imageUrl || "",
        stock: 1,
        runtime: runtime ? parseInt(runtime) : 120,
      },
    });

    revalidatePath("/admin/movies");
    revalidatePath("/admin/movies/people");

    // Serialize the result
    return serializeMovie(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    throw new Error("Failed to create movie");
  }
}
