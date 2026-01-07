import MovieCardContainer from "@/components/movieCardContainer";
import { getGenres, getMovies } from "@/actions/movie-actions";
import MovieFilter from "@/components/movieFiltering";
import Link from "next/link";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;

  const genre = Array.isArray(searchParams.genre)
    ? searchParams.genre[0]
    : searchParams.genre;
  const search = Array.isArray(searchParams.search)
    ? searchParams.search[0]
    : searchParams.search;

  const genres = await getGenres();

  const recentMovies = await getMovies("recent", genre, search);
  const popularMovies = await getMovies("popularity", genre, search);
  const oldestMovies = await getMovies("oldest", genre, search);
  const cheapestMovies = await getMovies("price", genre, search);

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <aside className="sticky top-0 h-screen max-w-[20svw] overflow-y-auto">
        <MovieFilter genres={genres} values={{ genre, search }} />
      </aside>

      <main className="flex flex-col grow text-justify-center gap-10 px-6 py-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 justify-items-center">
            Welcome to the Movie Shop
          </h1>
          <p className="mt-2 text-orange-400 dark:text-white-800 text shadow-cyan-300 align text-center max-w-xl">
            Browse our movie catalog for the latest releases, popular titles,
            and great deals.
          </p>
        </header>

        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Movies</h2>
              <p className="text-sm text-zinc-500">
                Sorted by release date (newest first)
              </p>
            </div>
            <Link
              href="/movies?sort=recent"
              className="text-sm font-medium text-blue-400 hover:underline"
            >
              View all
            </Link>
          </div>

          <MovieCardContainer movies={recentMovies.slice(0, 5)} />
        </section>

        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Popular Movies</h2>
              <p className="text-sm text-zinc-500">
                Based on a derived popularity score using release date and price
              </p>
            </div>
            <Link
              href="/movies?sort=popularity"
              className="text-sm font-medium text-blue-400 hover:underline"
            >
              View all
            </Link>
          </div>

          <MovieCardContainer movies={popularMovies.slice(0, 5)} />
        </section>

        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Oldest Movies</h2>
              <p className="text-sm text-zinc-500">
                Sorted by release date (oldest first)
              </p>
            </div>
            <Link
              href="/movies?sort=oldest"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>

          <MovieCardContainer movies={oldestMovies.slice(0, 5)} />
        </section>

        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Cheapest Movies</h2>
              <p className="text-sm text-zinc-500">Sorted by lowest price</p>
            </div>
            <Link
              href="/movies?sort=recent"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <MovieCardContainer movies={cheapestMovies.slice(0, 5)} />
        </section>
      </main>
    </div>
  );
}
