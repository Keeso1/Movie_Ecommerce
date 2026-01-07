import { getMovieById } from "@/actions/movie-actions";
import UpdateMovieForm from "@/components/update-movie-form";
import { fetchMoviePerson, fetchGenres } from "../../create-movie/page";

export default async function MoviePage(props: { params: { id: string } }) {
  const params = await props.params;
  const movie = await getMovieById(params.id);

  const actors = fetchMoviePerson("actor");
  const directors = fetchMoviePerson("director");
  const genres = fetchGenres();

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <UpdateMovieForm
      movie={movie}
      actors={actors}
      directors={directors}
      genres={genres}
      movieId={params.id}
    ></UpdateMovieForm>
  );
}
