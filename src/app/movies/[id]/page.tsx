// 'use server' - This page will be server-rendered to fetch movie details
"use server";

import { getMovieById } from "@/actions/movie-actions"; // Function to fetch movie by ID
import Image from "next/image";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { headers } from "next/headers";

export default async function MoviePage(props: { params: { id: string } }) {
  const params = await props.params;
  const movie = await getMovieById(params.id); // Fetch movie details by ID
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!movie) {
    return <div>Movie not found</div>;
  }

  const directors = movie.moviePersons.filter(
    (person) => person.role.toLowerCase() === "director",
  );
  const actors = movie.moviePersons.filter(
    (person) => person.role.toLowerCase() === "actor",
  );

  return (
    <div className="container mx-auto p-4 md:p-8 h-full flex items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
        <div className="relative min-h-96 md:min-h-full overflow-hidden rounded-lg">
          {movie.imageUrl ? (
            <Image
              src={movie.imageUrl}
              alt={movie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400 rounded-lg">
              No Image Available
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <div className="flex flex-row justify-between">
              <p className="text-gray-700 text-lg mb-6">
                {new Date(movie.releaseDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 text-lg mb-6">{movie.runtime} min</p>
            </div>
            <p className="text-gray-700 text-lg mb-6">{movie.description}</p>

            {directors.length > 0 && (
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4">Directors</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {directors.map((director) => (
                    <span key={director.id} className="text-lg text-gray-800">
                      {director.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {actors.length > 0 && (
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4">Actors</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {actors.map((actor) => (
                    <span key={actor.id} className="text-lg text-gray-800">
                      {actor.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.genres.length > 0 && (
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4">Genres</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {movie.genres.map((genre) => (
                    <span key={genre.id} className="text-lg text-gray-800">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <span className="text-2xl font-semibold text-green-600">
                ${movie.price.toFixed(2)}
              </span>

              {/* Add to Cart Button */}
              <AddToCartButton movie={movie} />
            </div>

            {session?.user.role === "admin" ? (
              <Button asChild type="button">
                <Link href={`/admin/movies/${params.id}`}>Edit Movie</Link>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
