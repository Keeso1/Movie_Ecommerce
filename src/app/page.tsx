import MovieCardContainer from "@/components/movieCardContainer";
import { getGenres, getMovies } from "@/actions/movie-actions";
import MovieFilter from "@/components/movieFiltering";
import { Slider } from "@radix-ui/react-slider";

export default async function Home() {
  const movies = await getMovies();
  const genres = await getGenres();
  
  return (
    <div className="flex flex-row min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-row justify-center items-center grow max-w-[30svw] px-5">
        <MovieFilter genres={genres}></MovieFilter>
        <Slider disabled={true} orientation="vertical" className="h-full w-10 bg-[#EEEEEE]" max={100}></Slider>
      </div>
      <div className="flex flex-col grow items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-s text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Welcome to the Movie Shop!
        </h1>
        <p className="max-w-md text-lg text align-middleleading-8 text-zinc-600 dark:text-zinc-400">
          Movie Card Component
        </p>
        <MovieCardContainer movies={movies}></MovieCardContainer>
      </div>
    </div>
  );
}
