import MovieCardContainer from "@/components/movieCardContainer";
import { getGenres, getMovies } from "@/actions/movie-actions";
import MovieFilter from "@/components/movieFiltering";
import type { sortingOptions } from "@/actions/movie-actions";

const titleMap: Record<string, string> = {
  recent: "Recently Added",
  popular: "Most Popular",
  rating: "Top Rated",
  alphabetical: "A-Z",
  oldest: "Oldest Movies",
};

export default async function MoviesPage(props: PageProps<"/movies">) {
  const searchParams = await props.searchParams;

  const sort = Array.isArray(searchParams.sort)
    ? searchParams.sort[0]
    : searchParams.sort ?? "recent";

  const genre = Array.isArray(searchParams.genre)
    ? searchParams.genre[0]
    : searchParams.genre;

  const search = Array.isArray(searchParams.search)
    ? searchParams.search[0]
    : searchParams.search;

  const genres = await getGenres();
  const movies = await getMovies(sort as sortingOptions, genre, search);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b bg-white dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            {titleMap[sort] ?? "Browse Movies"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Showing all movies sorted by{" "}
            <span className="font-medium">{sort}</span>
          </p>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-0 h-screen max-w-[20svw] overflow-y-auto">
          <MovieFilter genres={genres} values={{ genre, search }} />
        </aside>

        <main className="flex grow px-6 py-8">
          <MovieCardContainer movies={movies} />
        </main>
      </div>
    </div>
  );
}
