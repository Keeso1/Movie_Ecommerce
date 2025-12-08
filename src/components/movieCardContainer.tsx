import { MovieModel } from "../../generated/prisma/models";
import MovieCard from "./movieCard";

interface MovieCardContainerProps {
  movies: MovieModel[];
}

export default function MovieCardContainer({ movies }: MovieCardContainerProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}