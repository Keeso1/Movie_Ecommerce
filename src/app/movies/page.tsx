import MovieCard from "@/components/movie-card/MovieCard";
import prisma from "@/lib/prisma";
import type { Movie } from "@/types/movie";

export default async function MoviesPage() {
  // Fetch movies with genres using Prisma's implicit many-to-many
  const moviesFromDb = await prisma.movie.findMany({
    where: { deleted: false },
    include: {
      genres: true, // This includes the Genre[] array
    },
    orderBy: { title: "asc" },
  });

  // Add "A New Hope" movie manually
  const aNewHope: Movie = {
    id: "a-new-hope",
    title: "Star Wars: A New Hope",
    description:
      "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
    price: 14.99,
    releaseDate: "1977-05-25",
    imageUrl: "/A new hope.jpg",
    runtime: 121,
    genres: [
      { id: "sci-fi", name: "Sci-Fi", description: null },
      { id: "adventure", name: "Adventure", description: null },
    ],
  };

  // Convert Prisma types to client-safe types
  const movies: Movie[] = moviesFromDb.map((movie) => ({
    ...movie,
    price: Number(movie.price), // Convert Decimal to number
    releaseDate:
      movie.releaseDate instanceof Date
        ? movie.releaseDate.toISOString()
        : movie.releaseDate,
    // genres is already Genre[] from Prisma
  }));

  const allMovies = [aNewHope, ...movies];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {allMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
