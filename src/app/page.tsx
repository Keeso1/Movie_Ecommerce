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
  console.log(search);
  const genres = await getGenres();
  const recentMovies = await getMovies("recent", genre, search);
  const popularMovies = await getMovies("popularity", genre, search);
  const oldestMovies = await getMovies("oldest", genre, search);
  const cheapestMovies = await getMovies("price", genre, search);

  return (
    <div className="flex flex-row min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-row justify-center items-center grow max-w-[30svw] px-5">
        <MovieFilter
          genres={genres}
          values={{ genre: genre, search: search }}
        ></MovieFilter>
      </div>
      <div className="flex flex-col grow items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-s text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Welcome to the Movie Shop!
        </h1>

        <h2>Recent movies</h2>
        <MovieCardContainer movies={recentMovies}></MovieCardContainer>
        <h2>Popular Movies</h2>
        <MovieCardContainer movies={popularMovies}></MovieCardContainer>
        <h2>Oldest Movies</h2>
        <MovieCardContainer movies={oldestMovies}></MovieCardContainer>
        <h2>Oldest Movies</h2>
        <MovieCardContainer movies={cheapestMovies}></MovieCardContainer>
      </div>
    </div>
  );
}
