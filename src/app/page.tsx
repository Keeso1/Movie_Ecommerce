import MovieCardContainer from "@/components/movieCardContainer";
import { getGenres, getMovies } from "@/actions/movie-actions";
import MovieFilter from "@/components/movieFiltering";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;

  const genre = Array.isArray(searchParams.genre)
    ? searchParams.genre[0]
    : searchParams.genre;
  const search = Array.isArray(searchParams.search)
    ? searchParams.search[0]
    : searchParams.search;
  const sort = Array.isArray(searchParams.sort)
    ? searchParams.sort[0]
    : searchParams.sort;
  if (sort) {
    console.log(sort[0]);
  }

  const genres = await getGenres();
  const movies = await getMovies(sort, genre, search);

  return (
    <div className="flex flex-row min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-row flex-wrap sticky top-0 self-start justify-center grow max-w-[20svw] h-screen overflow-y-auto">
        <MovieFilter
          genres={genres}
          values={{ sort: sort, genre: genre, search: search }}
        ></MovieFilter>
      </div>
      <div className="flex flex-col grow items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-s text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Welcome to the Movie Shop!
        </h1>
        <p className="max-w-md text-lg text align-middleleading-8 text-zinc-600 dark:text-zinc-400">
          Movie Card Component
        </p>
        <h2>Recent movies</h2>
        <MovieCardContainer movies={movies}></MovieCardContainer>
      </div>
    </div>
  );
}
