"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMoviePerson } from "../actions";
import Link from "next/link";

export default function CreateMoviePersonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    try {
      await createMoviePerson(formData);
      router.push("/admin/movies/people");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const roleOptions = [
    "actor",
    "director",
    "producer",
    "writer",
    "cinematographer",
    "composer",
    "editor",
    "production designer",
    "costume designer",
  ];

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center mb-8">
        <Link
          href="/admin/movies/people"
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to All People
        </Link>
        <h1 className="text-2xl font-bold">Add New Movie Person</h1>
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
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role *
          </label>
          <select
            id="role"
            name="role"
            required
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a role</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            If "Other" is selected, you can specify the exact role in the text
            field below.
          </p>
        </div>

        {selectedRole === "other" && (
          <div>
            <label
              htmlFor="customRole"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Custom Role *
            </label>
            <input
              type="text"
              id="customRole"
              name="customRole"
              required={selectedRole === "other"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter custom role (e.g., Stunt Coordinator, Makeup Artist)"
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6">
          <Link
            href="/admin/movies/people"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition flex items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Person"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
