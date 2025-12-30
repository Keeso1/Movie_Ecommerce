import { auth } from "@/lib/auth";
import CreateMovieForm from "@/components/create-movie-form";
import { getActors, getDirectors } from "@/actions/create-movie-actions";
import { headers } from "next/headers";
import { getGenres } from "@/actions/movie-actions";

export default async function CreateMoviePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const fetchMoviePerson = async (role: string) => {
    const moviePersonData =
      role == "actor" ? await getActors() : await getDirectors();
    const formattedMoviePersons = moviePersonData.map((person) => ({
      value: person.id,
      label: person.name,
    }));
    return formattedMoviePersons;
  };

  const fetchGenres = async () => {
    const genreData = await getGenres();
    const formattedGenres = genreData.map((genre) => ({
      value: genre.id,
      label: genre.name,
    }));
    return formattedGenres;
  };

  const actors = fetchMoviePerson("actor");
  const directors = fetchMoviePerson("director");
  const genres = fetchGenres();
  if (!session || session.user.role !== "admin") {
    return (
      <div>
        <p>404 not authorised</p>
      </div>
    );
  }

  return (
    <CreateMovieForm
      actors={actors}
      directors={directors}
      genres={genres}
    ></CreateMovieForm>
  );
}
