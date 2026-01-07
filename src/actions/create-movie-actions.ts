"use server";
import prisma from "@/lib/prisma";
import { getPosterUrl } from "@/app/api/get_movie_poster";
import { Option } from "../components/ui/multi-select";
import { createMovieFormData } from "@/components/create-movie-form";

async function resolveCreatableOptions(
  options: Option[],
  modelName: "genre" | "moviePerson",
  role?: "actor" | "director",
) {
  const newOptions = options.filter((option) => option.value === option.label);
  const existingOptions = options.filter(
    (option) => option.value !== option.label,
  );

  for (const option of newOptions) {
    let existingEntity: { id: string; name: string } | null = null;

    if (modelName === "genre") {
      existingEntity = await prisma.genre.findFirst({
        where: { name: { equals: option.value, mode: "insensitive" } },
      });
      if (!existingEntity) {
        existingEntity = await prisma.genre.create({
          data: { name: option.value },
        });
      }
    } else if (modelName === "moviePerson" && role) {
      existingEntity = await prisma.moviePerson.findFirst({
        where: {
          name: { equals: option.value, mode: "insensitive" },
          role: role,
        },
      });
      if (!existingEntity) {
        existingEntity = await prisma.moviePerson.create({
          data: { name: option.value, role: role },
        });
      }
    }

    if (existingEntity) {
      existingOptions.push({
        value: existingEntity.id,
        label: existingEntity.name,
      });
    }
  }
  return existingOptions;
}

export async function createOrUpdateMovie(
  data: createMovieFormData,
  id?: string,
) {
  // Get an image based on the title
  let posterImage;
  const posterURL = await getPosterUrl(data.title);
  if (posterURL) {
    posterImage = posterURL;
  } else {
    posterImage = "/missing-image1.png";
  }

  const finalGenres = await resolveCreatableOptions(data.genres, "genre");
  const finalActors = await resolveCreatableOptions(
    data.actors,
    "moviePerson",
    "actor",
  );
  const finalDirectors = await resolveCreatableOptions(
    data.directors,
    "moviePerson",
    "director",
  );

  let movie;

  if (id) {
    movie = await prisma.movie.update({
      where: {
        id: id,
      },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        imageUrl: posterImage,
        releaseDate: new Date(data.releaseDate),
        runtime: data.runtime,
        stock: data.stock,
        genres: {
          connect: finalGenres.map((item) => ({ id: item.value })),
        },
        moviePersons: {
          connect: [
            ...finalDirectors.map((item) => ({
              id: item.value,
              role: "director",
            })),
            ...finalActors.map((item) => ({ id: item.value, role: "actor" })),
          ],
        },
      },
    });
  } else {
    movie = await prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        imageUrl: posterImage,
        releaseDate: new Date(data.releaseDate),
        runtime: data.runtime,
        stock: data.stock,
        genres: {
          connect: finalGenres.map((item) => ({ id: item.value })),
        },
        moviePersons: {
          connect: [
            ...finalDirectors.map((item) => ({
              id: item.value,
              role: "director",
            })),
            ...finalActors.map((item) => ({ id: item.value, role: "actor" })),
          ],
        },
      },
    });
  }

  console.log(movie);
  return movie;
}

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
