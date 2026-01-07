"use client";

import Link from "next/link";
import Image from "next/image";
import { getMovieType } from "@/actions/movie-actions";
import { useCart } from "@/context/CartContext";

export default function MovieCard({ movie }: { movie: getMovieType }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    addToCart({
      movieId: movie.id,
      title: movie.title,
      price: movie.price ?? 0,
      quantity: 1,
      imageUrl: movie.imageUrl ?? "",
    });
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      {/* CLICKABLE MOVIE AREA */}
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="relative h-64 w-full bg-gray-100">
          {movie.imageUrl ? (
            <Image
              src={movie.imageUrl}
              alt={movie.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{movie.title}</h3>

          <p className="text-gray-500 text-sm">
            {movie.genres?.map((g) => g.name).join(" • ")}
          </p>

          {movie.price !== null && (
            <div className="flex justify-between mt-3 text-green-600 font-semibold text-sm">
              <p>SEK {movie.price.toFixed(0)}</p>
              <p>{movie.stock} in stock</p>
            </div>
          )}
        </div>
      </Link>

      {/* ACTION AREA */}
      <button
        onClick={handleAddToCart}
        className="m-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
