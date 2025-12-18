//          { UPDATE page for the Admin to edit & update movie details }

import { prisma } from "@/lib/prisma";
import { updateMovie } from "../movie_update";
import { notFound } from "next/navigation";

export default async function AdminEditMoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await prisma.movie.findUnique({
    where: { id: params.id },
    include: {
      genres: true,
      moviePersons: true,
    },
  });

  if (!movie) notFound();

  const allGenres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-semibold">Edit movie: {movie.title}</h1>

      <form action={updateMovie} className="space-y-6">
        {/* RequireD */}

        <input type="hidden" name="id" value={movie.id} />

        {/* TitlE */}

        <div>
          <label htmlFor="title" className="block text-sm mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={movie.title}
            className="w-full border p-2"
            required
          />
        </div>

        {/* DescriptioN */}

        <div>
          <label htmlFor="description" className="block text-sm mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={movie.description}
            className="w-full border p-2"
            rows={4}
          />
        </div>

        {/* ReleasE date & RuntimE */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="releaseDate" className="block text-sm mb-1">
              Release date
            </label>
            <input
              id="releaseDate"
              type="date"
              name="releaseDate"
              defaultValue={movie.releaseDate.toISOString().split("T")[0]}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="runtime" className="block text-sm mb-1">
              Runtime (min)
            </label>
            <input
              id="runtime"
              type="number"
              name="runtime"
              placeholder="Minutes"
              defaultValue={movie.runtime ?? ""}
              className="border p-2 w-full"
            />
          </div>
        </div>

        {/* PricE & StocK */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm mb-1">
              Price
            </label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Price"
              defaultValue={movie.price}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm mb-1">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              name="stock"
              placeholder="Stock quantity"
              defaultValue={movie.stock}
              className="border p-2 w-full"
            />
          </div>
        </div>

        {/* ImagE URL */}

        <div>
          <label htmlFor="imageUrl" className="block text-sm mb-1">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            placeholder="https://…"
            defaultValue={movie.imageUrl}
            className="w-full border p-2"
          />
        </div>

        {/* GenreS */}

        <fieldset>
          <legend className="text-sm font-medium mb-2">Genres</legend>

          <div className="grid grid-cols-2 gap-2">
            {allGenres.map((genre) => (
              <label
                key={genre.id}
                htmlFor={`genre-${genre.id}`}
                className="flex gap-2 items-center"
              >
                <input
                  id={`genre-${genre.id}`}
                  type="checkbox"
                  name="genreIds"
                  value={genre.id}
                  defaultChecked={movie.genres.some((g) => g.id === genre.id)}
                />
                {genre.name}
              </label>
            ))}
          </div>
        </fieldset>

        {/* CreditS (READ-ONLY FOR NOW) */}

        <fieldset>
          <legend className="text-sm font-medium mb-2">Credits</legend>

          {movie.moviePersons.map((mp) => (
            <div key={mp.id} className="flex gap-2 mb-2">
              <input
                disabled
                value={mp.name}
                className="border p-2 bg-slate-100 flex-1"
                placeholder="Name"
              />
              <input
                disabled
                value={mp.role}
                className="border p-2 bg-slate-100 flex-1"
                placeholder="Role"
              />
            </div>
          ))}
        </fieldset>

        {/* SubmiT */}

        <div className="pt-4">
          <button type="submit" className="bg-emerald-600 text-white px-6 py-2">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
