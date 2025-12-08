import Image from "next/image";
import Link from "next/link";

import { MovieModel } from "../../generated/prisma/models";

export default function MovieCard({ movie }: { movie: MovieModel }) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
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

      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{movie.title}</h3>

        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
          {movie.releaseDate && (
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          )}
          {movie.runtime !== null && <span>{movie.runtime} min</span>}
        </div>


        {movie.price !== null && (
          <div className="mt-4 text-green-600 font-semibold">
            ${movie.price.toFixed(2)}
          </div>
        )}
      </div>
    </Link>
  );
}
