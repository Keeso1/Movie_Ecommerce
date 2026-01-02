import { getMovieById } from "@/actions/movie-actions";
import { auth } from "@/lib/auth";
import UpdateMovieForm from "@/components/update-movie-form";
import { headers } from "next/headers";
import { fetchMoviePerson, fetchGenres } from "../../create-movie/page";

export default async function MoviePage(props: { params: { id: string } }) {
  const params = await props.params;
  const movie = await getMovieById(params.id);
  console.log(movie);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const actors = fetchMoviePerson("actor");
  const directors = fetchMoviePerson("director");
  const genres = fetchGenres();

  if (!movie) {
    return <div>Movie not found</div>;
  }

  if (!session || session.user.role !== "admin") {
    return (
      <div>
        <p>404 not authorised</p>
      </div>
    );
  }

  return (
    <UpdateMovieForm
      movie={movie}
      actors={actors}
      directors={directors}
      genres={genres}
    ></UpdateMovieForm>
  );
}
