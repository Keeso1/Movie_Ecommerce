//admin/movies/people/[id]/edit/EditMoviePersonForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMoviePerson } from "../../actions";
import Link from "next/link";

interface EditMoviePersonFormProps {
  person: {
    id: string;
    name: string;
    role: string;
  };
}

export default function EditMoviePersonForm({
  person,
}: EditMoviePersonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    try {
      await updateMoviePerson(person.id, formData);
      router.push(`/admin/movies/people/${person.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link
          href={`/admin/movies/people/${person.id}`}
          className="text-gray-600 hover:text-gray-900 mr-4"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Edit {person.name}</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        action={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={person.name}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role *
          </label>
          <select
            id="role"
            name="role"
            defaultValue={person.role}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="actor">Actor</option>
            <option value="director">Director</option>
            <option value="producer">Producer</option>
            <option value="writer">Writer</option>
            <option value="cinematographer">Cinematographer</option>
            <option value="composer">Composer</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Person"}
          </button>
        </div>
      </form>
    </div>
  );
}
