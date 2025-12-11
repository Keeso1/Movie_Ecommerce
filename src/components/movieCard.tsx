import Image from "next/image";
import Link from "next/link";
import { getMovieType } from "@/actions/movie-actions";
import { authClient } from "@/lib/auth-client";
export default function MovieCard({ movie }: { movie: getMovieType }) {
  
  return (
    <Link
      href={authClient.admin ? `/admin/movies/${movie.id}` : `/movies/${movie.id}`}
      className="flex flex-col flex-wrap bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="relative bg-gray-200">
        {movie.imageUrl ? (
          <Image
            src={movie.imageUrl}
            alt={movie.title}
            width={300}
            height={500}
            className="object-cover"
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

        <div className="mt-2 text-sm text-gray-600 truncate">
          <p>{movie.genres.map(genre => genre.name).join(' • ')}</p>
        </div>

        {movie.price !== null && (
          <div className="flex flex-row justify-between mt-4 text-green-600 font-semibold">
            <p>${movie.price.toFixed(2)}</p>
            <p>{movie.stock} in stock</p>
            
          </div>
        )}
      </div>
    </Link>
  );
}
