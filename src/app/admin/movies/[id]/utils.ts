/*  Image Handling  */
export function getMovieImageUrl(movie: { imageUrl?: string | null }): string {
  return movie.imageUrl || "/A_new_hope.jpg";
}
