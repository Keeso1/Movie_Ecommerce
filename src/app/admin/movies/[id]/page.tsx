import { getMovieById } from "@/actions/movie-actions";
import Image from "next/image";

export default async function MoviePage(props: { params: { id: string } }) {
  const params = await props.params;
  const movie = await getMovieById(params.id);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-120">
          {movie.imageUrl ? (
            <Image
              src={movie.imageUrl}
              alt={movie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-700 mb-4">{movie.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-green-600">
              ${movie.price.toFixed(2)}
            </span>
            <span className="text-gray-600">
              {new Date(movie.releaseDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
