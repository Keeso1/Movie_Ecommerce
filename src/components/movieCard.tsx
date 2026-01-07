"use client";

import Image from "next/image";
import Link from "next/link";
import { getMovieType } from "@/actions/movie-actions";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";

export default function MovieCard({ movie }: { movie: getMovieType }) {
  const session = authClient.useSession();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

<<<<<<< Updated upstream
    addToCart({
      id: movie.id,
      title: movie.title,
      price: movie.price ?? 0,
      quantity: 1,
      imageUrl: movie.imageUrl ?? "",
    });

    console.log("🛒 Added to cart:", movie.title);
=======
    addToCart({ movieId: movie.id, price: movie.price, quantity: 1 });
>>>>>>> Stashed changes
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <Link
        href={
          session.data?.user.role === "admin"
            ? `/admin/movies/${movie.id}`
            : `/movies/${movie.id}`
        }
      >
        <div className="relative bg-gray-200 cursor-pointer">
          {movie.imageUrl ? (
            <Image
              src={movie.imageUrl}
              alt={movie.title}
              width={300}
              height={500}
              className="object-cover"
            />
          ) : (
            <div className="h-[500px] flex items-center justify-center bg-gray-100 text-gray-500">
              No Image Available
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{movie.title}</h3>

        <p className="text-gray-500">
          {movie.genres?.map((g) => g.name).join(" • ")}
        </p>

        {movie.price !== null && (
          <div className="flex justify-between mt-4 text-green-600 font-semibold">
            <p>SEK {movie.price.toFixed(0)}</p>
            <p>{movie.stock} in stock</p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="m-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 relative z-10"
      >
        Add to Cart
      </button>
    </div>
  );
}
