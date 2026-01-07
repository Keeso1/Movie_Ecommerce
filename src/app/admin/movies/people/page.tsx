//admin/movies/people/page.tsx

import { getMoviePersons, getAllMoviesForDropdown } from "./actions";
import Link from "next/link";
import { DeleteButton } from "./components/DeleteButton";
import { MovieAssociationDropdown } from "./components/MovieAssociationDropdown";

// Helper function to count roles properly
function countRoles(people: any[], roleType: string) {
  return people.filter(
    (p) => p.role && p.role.toLowerCase().includes(roleType.toLowerCase())
  ).length;
}

export default async function MoviePeoplePage() {
  const people = await getMoviePersons();
  const movies = await getAllMoviesForDropdown();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Movie People Management</h1>
          <p className="text-gray-600 mt-2">
            Manage actors, directors, and other movie personnel. Associate them
            with movies directly from this page.
          </p>
        </div>
        <Link
          href="/admin/movies/people/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Person
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total People</h3>
          <p className="text-2xl">{people.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Actors</h3>
          <p className="text-2xl">{countRoles(people, "actor")}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Directors</h3>
          <p className="text-2xl">{countRoles(people, "director")}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Other Roles</h3>
          <p className="text-2xl">
            {people.length -
              countRoles(people, "actor") -
              countRoles(people, "director")}
          </p>
        </div>
      </div>

      {/* Quick Association Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Associate Movies</h2>
        <form
          action={async (formData) => {
            "use server";
            const { quickAssociateMoviePerson } = await import("./actions");
            await quickAssociateMoviePerson(formData);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="quickPersonSelect"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Person
              </label>
              <select
                name="personId"
                id="quickPersonSelect"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a person...</option>
                {people.map((person: any) => (
                  <option key={person.id} value={person.id}>
                    {person.name} ({person.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="quickMovieSelect"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Movie
              </label>
              <select
                name="movieId"
                id="quickMovieSelect"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a movie...</option>
                {movies.map((movie: any) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title} ({new Date(movie.releaseDate).getFullYear()})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Associate
              </button>
            </div>
          </div>
        </form>
        <p className="text-sm text-gray-500 mt-3">
          Quickly associate a person with a movie. You can also associate movies
          individually from each person's row below.
        </p>
      </div>

      {/* People Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name & Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Associated Movies
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quick Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manage
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {people.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No movie people found.{" "}
                  <Link
                    href="/admin/movies/people/create"
                    className="text-blue-600 hover:underline"
                  >
                    Add your first person
                  </Link>
                </td>
              </tr>
            ) : (
              people.map((person: any) => {
                // Filter out movies already associated with this person
                const availableMovies = movies.filter(
                  (movie: any) =>
                    !person.movies?.some((m: any) => m.id === movie.id)
                );

                return (
                  <tr key={person.id}>
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/admin/movies/people/${person.id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium hover:underline text-lg"
                        >
                          {person.name}
                        </Link>
                        <div className="mt-1">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                              person.role?.toLowerCase() === "actor"
                                ? "bg-green-100 text-green-800"
                                : person.role?.toLowerCase() === "director"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {person.role || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {person.movies && person.movies.length > 0 ? (
                            person.movies.slice(0, 3).map((movie: any) => (
                              <Link
                                key={movie.id}
                                href={`/admin/movies/${movie.id}`}
                                className="inline-block px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition"
                                title={movie.title}
                              >
                                {movie.title.length > 20
                                  ? movie.title.substring(0, 20) + "..."
                                  : movie.title}
                              </Link>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No movies associated
                            </span>
                          )}
                          {person.movies && person.movies.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-200 rounded">
                              +{person.movies.length - 3} more
                            </span>
                          )}
                        </div>
                        {person.movies && person.movies.length > 0 && (
                          <div className="text-xs text-gray-500">
                            {person.movies.length} movie
                            {person.movies.length !== 1 ? "s" : ""} total
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <MovieAssociationDropdown
                          personId={person.id}
                          personName={person.name}
                          availableMovies={availableMovies}
                        />
                        {person.movies && person.movies.length > 0 && (
                          <div className="text-xs">
                            <Link
                              href={`/admin/movies/people/${person.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            ></Link>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/movies/people/${person.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </Link>
                      <DeleteButton personId={person.id} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">
          How to Associate Movies:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • Use the "Quick Associate Movies" section at the top to quickly
            link people with movies
          </li>
          <li>
            • Use the dropdown in each person's row to add specific movies
          </li>
          <li>
            • Click on a person's name to go to their detail page for full
            management
          </li>
          <li>• Click on movie titles to go to the movie's detail page</li>
        </ul>
      </div>
    </div>
  );
}
