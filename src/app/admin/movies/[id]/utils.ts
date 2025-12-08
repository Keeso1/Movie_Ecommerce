/*  Image Handling  */
export function getMovieImageUrl(movie: { imageUrl?: string | null }): string {
  return movie.imageUrl || "/default-movie-image.jpg";
}
