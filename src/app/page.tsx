"use client"
import MovieCardContainer from "@/components/movieCardContainer";
import { getGenres, getMovies, getGenresType, getMoviesType } from "@/actions/movie-actions";
import MovieFilter from "@/components/movieFiltering";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState<getMoviesType>([]);
  const [genres, setGenres] = useState<getGenresType>([]);
  const [genre, setGenre] = useState<string | undefined>(undefined);

  const fetchMovies = useCallback(async () => {
    const movies = await getMovies(genre);
    setMovies(movies);
  }, [genre]);

  useEffect(() => {
    async function fetchGenres() {
      const genres = await getGenres();
      setGenres(genres);
    }
    fetchGenres();
    fetchMovies();
  }, [fetchMovies]);
  
  return (
    <div className="flex flex-row min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-row justify-center items-center grow max-w-[30svw] px-5">
        <MovieFilter genres={genres} value={genre} setValue={setGenre}></MovieFilter>
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
