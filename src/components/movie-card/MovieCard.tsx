import Image from "next/image";
import Link from "next/link";
// Update the path below to the correct relative path if needed
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 bg-gray-200">
        {movie.imageUrl ? (
          <Image
            src={movie.imageUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="200px"
            priority={Number(movie.id) === 1} // Preload if it's the Star Wars card
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold truncate">{movie.title}</h3>

        {/* Meta info (year and runtime) */}
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
          {movie.releaseDate && (
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          )}
          {movie.runtime !== null && <span>{movie.runtime} min</span>}
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {movie.price !== null && (
          <div className="mt-4 text-green-600 font-semibold">
            ${movie.price.toFixed(2)}
          </div>
        )}
      </div>
    </Link>
  );
}
