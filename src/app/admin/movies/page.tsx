//    npm install zod

import { prisma } from "@/lib/prisma";
import { MovieCard } from "@/components/movie/movie-card";
import { Movie } from "@prisma/client";

type SearchParams = {
  search?: string;
  genreId?: string;
  personId?: string;
};

async function getMovies(filters: SearchParams) {
  const where: any = { deleted: false };

  if (filters.search) {
    where.title = {
      contains: filters.search,
      mode: "insensitive",
    };
  }

  if (filters.genreId) {
    where.genres = {
      some: { id: filters.genreId },
    };
  }

  if (filters.personId) {
    where.moviePersons = {
      some: { personId: filters.personId },
    };
  }

  return prisma.movie.findMany({
    where,
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      releaseDate: true,
      runtime: true,
      genres: {
        select: { id: true, name: true },
      },
      moviePersons: {
        select: {
          role: true,
          person: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [movies, genres, people] = await Promise.all([
    getMovies(searchParams),
    prisma.genre.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.person.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-4">
      <form className="mb-4">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Movie filters</legend>

          <input
            name="search"
            placeholder="Search by title…"
            defaultValue={searchParams.search ?? ""}
            className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm flex-1 min-w-[200px]"
          />

          <select
            name="genreId"
            defaultValue={searchParams.genreId ?? ""}
            className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            name="personId"
            defaultValue={searchParams.personId ?? ""}
            className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-sm"
          >
            <option value="">All people</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-3 py-2 rounded bg-emerald-600 text-sm"
          >
            Apply
          </button>
        </fieldset>
      </form>

      {movies.length === 0 ? (
        <div className="text-center text-slate-400 py-10">
          No movies match your filters.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          {movies.map((m: Movie) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
}
