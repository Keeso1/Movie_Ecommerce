import MovieCardContainer from "@/components/movieCardContainer";
import { getGenres, getMovies } from "@/actions/movie-actions";
import MovieFilter from "@/components/movieFiltering";

export default async function Home(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const genre = Array.isArray(searchParams.genre)
    ? searchParams.genre[0]
    : searchParams.genre;

  // Fetch genres and movies in parallel
  const genres = await getGenres();
  const recentMovies = await getMovies("recent", genre);
  const popularMovies = await getMovies("popularity", genre);
  const oldestMovies = await getMovies("oldest", genre);
  const cheapestMovies = await getMovies("price", genre);
  console.log("genre", genre);
  return (
    <div className="flex flex-row min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-row justify-center items-center grow max-w-[30svw] px-5">
        <MovieFilter genres={genres} value={genre}></MovieFilter>
      </div>
      <div className="flex flex-col grow items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-s text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Welcome to the Movie Shop!
        </h1>
        <p className="max-w-md text-lg text align-middleleading-8 text-zinc-600 dark:text-zinc-400">
          Movie Card Component
        </p>
        <MovieCardContainer movies={recentMovies}></MovieCardContainer>
        <MovieCardContainer movies={popularMovies}></MovieCardContainer>
        <MovieCardContainer movies={oldestMovies}></MovieCardContainer>
        <MovieCardContainer movies={cheapestMovies}></MovieCardContainer>
      </div>
    </div>
  );
}
