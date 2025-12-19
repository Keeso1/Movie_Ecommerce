'use client';

import Image from "next/image";
import Link from "next/link";
import { getMovieType } from "@/actions/movie-actions";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";

export default function MovieCard({ movie }: { movie: getMovieType }) {
  const session = authClient.useSession();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: movie.id,
      title: movie.title,
      price: movie.price ?? 0,
      quantity: 1,
      imageUrl: movie.imageUrl ?? "",
    });
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      
      {/* CLICKABLE IMAGE / DETAILS */}
      <Link href={
        session.data?.user.role === "admin"
          ? `/admin/movies/${movie.id}`
          : `/movies/${movie.id}`
      }>
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
            <div className="h-[500px] flex items-center justify-center">
              No Image
            </div>
          )}
        </div>

        <div className="p-4">
          {movie.runtime !== null && <span>{movie.runtime} min</span>}
          {movie.releaseDate && (
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          )}
          <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
          <p>{movie.genres.map((genre) => genre.name).join(" • ")}</p>
          {movie.price !== null && (
          <div className="flex flex-row justify-between mt-4 text-green-600 font-semibold">
            <p>${movie.price.toFixed(2)}</p>
            <p>{movie.stock} in stock</p>
          </div>
        )}
        </div>
      </Link>

      {/* ADD TO CART BUTTON (NOT A LINK) */}
      <button
        onClick={handleAddToCart}
        className="m-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
