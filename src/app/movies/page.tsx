import MovieCard from "@/components/movie-card/MovieCard";
import prisma from "@/lib/prisma";
import type { Movie, MovieGenre } from "@/types/movie";

export default async function MoviesPage() {
  const movies = await prisma.movie.findMany({
    where: { deleted: false },
    include: {
      genres: true,
    },
    orderBy: { title: "asc" },
  });

  // Add "A New Hope" movie manually
  const aNewHope = {
    id: "a-new-hope",
    title: "Star Wars: A New Hope",
    description:
      "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
    price: 14.99,
    releaseDate: "1977-05-25",
    imageUrl: "/A new hope.jpg",
    runtime: 121,
    genres: [
      { genreId: "sci-fi", genre: { id: "sci-fi", name: "Sci-Fi" } },
      { genreId: "adventure", genre: { id: "adventure", name: "Adventure" } },
    ],
  };

  // Map genres to expected MovieGenre structure for MovieCard

  const moviesWithGenres: Movie[] = movies.map((movie) => {
    // Map genres to MovieGenre[]
    type GenreWithRelation = {
      id?: string;
      genreId?: string;
      name?: string;
      genre?: {
        id: string;
        name: string;
      };
    };

    const genres: MovieGenre[] = Array.isArray(movie.genres)
      ? movie.genres.map((g: GenreWithRelation) => {
          // If genre relation exists (from include), use it; else fallback to flat genre
          if (g.genre) {
            return {
              genreId: String(g.genreId),
              genre: {
                id: String(g.genre.id),
                name: g.genre.name || "",
              },
            };
          } else {
            return {
              genreId: String(g.id),
              genre: {
                id: String(g.id),
                name: g.name || "",
              },
            };
          }
        })
      : [];
    return {
      ...movie,
      price: Number(movie.price),
      releaseDate:
        movie.releaseDate instanceof Date
          ? movie.releaseDate.toISOString()
          : movie.releaseDate,
      genres,
    };
  });

  const allMovies = [aNewHope, ...moviesWithGenres];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {allMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
