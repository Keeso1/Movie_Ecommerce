import { getMoviePersonById, getAllMovies } from "../actions";
import Link from "next/link";
import { MovieAssociation } from "@/components/MovieAssociation"; // Import from root components

export default async function MoviePersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getMoviePersonById(id);
  const allMovies = await getAllMovies();

  if (!person) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Person not found</h1>
          <Link
            href="/admin/movies/people"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Movie People
          </Link>
        </div>
      </div>
    );
  }

  // Filter out movies already associated
  const availableMovies = allMovies.filter(
    (movie) => !person.movies.some((m: any) => m.id === movie.id)
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-8">
        <Link
          href="/admin/movies/people"
          className="text-gray-600 hover:text-gray-900 mr-4"
        >
          ← Back to Movie People
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{person.name}</h1>
          <p className="text-gray-600">
            Role:{" "}
            <span className="font-semibold capitalize">{person.role}</span>
          </p>
        </div>
        <div className="space-x-2">
          <Link
            href={`/admin/movies/people/${person.id}/edit`}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Edit
          </Link>
          <Link
            href="/admin/movies/people"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Person Details */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Person Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="text-sm text-gray-900">{person.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-lg font-medium">{person.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                  {person.role}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Associated Movies
              </dt>
              <dd className="text-lg font-medium">{person.movies.length}</dd>
            </div>
          </dl>
        </div>

        {/* Associated Movies */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Associated Movies</h2>
            <span className="text-sm text-gray-500">
              {person.movies.length} movies
            </span>
          </div>

          {person.movies.length > 0 ? (
            <div className="space-y-3">
              {person.movies.map((movie: any) => (
                <div
                  key={movie.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <Link
                      href={`/admin/movies/${movie.id}`}
                      className="font-medium hover:text-blue-600"
                    >
                      {movie.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Released:{" "}
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      const { removePersonFromMovie } = await import(
                        "../actions"
                      );
                      await removePersonFromMovie(person.id, movie.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No movies associated yet.</p>
          )}

          {/* Add Movie Association */}
          {availableMovies.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-3">Add to Movie</h3>
              <MovieAssociation
                personId={person.id}
                availableMovies={availableMovies}
                onAssociate={async (personId: string, movieId: string) => {
                  "use server";
                  const { associatePersonWithMovie } = await import(
                    "../actions"
                  );
                  return associatePersonWithMovie(personId, movieId);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
