//admin/movies/people/page.tsx

import { getMoviePersons, getAllMovies } from "./actions";
import Link from "next/link";
import { DeleteButton } from "./components/DeleteButton";

export default async function MoviePeoplePage() {
  const people = await getMoviePersons();
  const movies = await getAllMovies();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Movie People Management</h1>
        <Link
          href="/admin/movies/people/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add New Person
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total People</h3>
          <p className="text-2xl">{people.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Actors</h3>
          <p className="text-2xl">
            {people.filter((p) => p.role === "actor").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Directors</h3>
          <p className="text-2xl">
            {people.filter((p) => p.role === "director").length}
          </p>
        </div>
      </div>

      {/* People Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Associated Movies
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {people.map((person) => (
              <tr key={person.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/movies/people/${person.id}`}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    {person.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {person.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {person.movies.map((movie) => (
                      <span
                        key={movie.id}
                        className="px-2 py-1 text-xs bg-gray-100 rounded"
                      >
                        {movie.title}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/admin/movies/people/${person.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <DeleteButton personId={person.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
