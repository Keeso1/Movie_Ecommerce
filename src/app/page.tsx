import MovieCardContainer from "@/components/movieCardContainer";
import { getMovies } from "@/actions/movie-actions";

export default async function Home() {
  const movies = await getMovies();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-s text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to the Movie Shop!
          </h1>
          <p className="max-w-md text-lg text align-middleleading-8 text-zinc-600 dark:text-zinc-400">
            Movie Card Component
          </p>
          <MovieCardContainer movies={movies}></MovieCardContainer>
        </div>
      </main>
    </div>
  );
}
