//app/admin/movies/people/components/MovieAssociationDropdown.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MovieAssociationDropdownProps {
  personId: string;
  personName: string;
  availableMovies: Array<{
    id: string;
    title: string;
    releaseDate: Date;
  }>;
}

export function MovieAssociationDropdown({
  personId,
  personName,
  availableMovies,
}: MovieAssociationDropdownProps) {
  const router = useRouter();
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNewMovieForm, setShowNewMovieForm] = useState(false);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieYear, setNewMovieYear] = useState(
    new Date().getFullYear().toString()
  );
  const [creatingMovie, setCreatingMovie] = useState(false);

  async function handleAssociate(e: React.FormEvent) {
    e.preventDefault();

    // If showing new movie form and new movie title is entered, create new movie first
    if (showNewMovieForm && newMovieTitle.trim()) {
      await handleCreateAndAssociate();
      return;
    }

    // Otherwise, associate with existing movie
    if (!selectedMovieId || selectedMovieId === "new") {
      // If "Add New Movie" is selected but form isn't shown yet
      if (selectedMovieId === "new") {
        setShowNewMovieForm(true);
        setSelectedMovieId("");
      }
      return;
    }

    setLoading(true);
    try {
      const { associatePersonWithMovie } = await import("../actions");
      await associatePersonWithMovie(personId, selectedMovieId);
      setSelectedMovieId("");
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);

      router.refresh();
    } catch (error) {
      console.error("Failed to associate movie:", error);
      alert("Failed to associate movie. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAndAssociate() {
    if (!newMovieTitle.trim()) {
      alert("Please enter a movie title");
      return;
    }

    setCreatingMovie(true);
    try {
      // Create form data for the server action
      const formData = new FormData();
      formData.append("title", newMovieTitle.trim());
      formData.append("releaseYear", newMovieYear);
      formData.append("description", `Movie associated with ${personName}`);
      formData.append("price", "9.99");
      formData.append("imageUrl", "");

      // Use the server action to create movie and associate
      const { createMovieAndAssociate } = await import("../actions");
      await createMovieAndAssociate(personId, formData);

      // Reset form
      setNewMovieTitle("");
      setNewMovieYear(new Date().getFullYear().toString());
      setShowNewMovieForm(false);
      setSelectedMovieId("");
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);

      router.refresh();
    } catch (error) {
      console.error("Failed to create and associate movie:", error);
      alert("Failed to create and associate movie. Please try again.");
    } finally {
      setCreatingMovie(false);
    }
  }

  function handleCancelNewMovie() {
    setShowNewMovieForm(false);
    setNewMovieTitle("");
    setSelectedMovieId("");
  }

  if (availableMovies.length === 0 && !showNewMovieForm) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-400 mb-2">
          No movies available to associate
        </div>
        <button
          onClick={() => setShowNewMovieForm(true)}
          className="w-full px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition"
        >
          + Create New Movie
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleAssociate} className="space-y-2">
        <div className="flex space-x-2">
          <select
            value={selectedMovieId}
            onChange={(e) => {
              setSelectedMovieId(e.target.value);
              if (e.target.value === "new") {
                setShowNewMovieForm(true);
              } else {
                setShowNewMovieForm(false);
              }
            }}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={!showNewMovieForm}
          >
            <option value="">Select a movie...</option>
            {availableMovies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title} ({new Date(movie.releaseDate).getFullYear()})
              </option>
            ))}
            <option value="new" className="font-semibold text-purple-600">
              + Add New Movie
            </option>
          </select>
          <button
            type="submit"
            disabled={
              loading ||
              creatingMovie ||
              (!selectedMovieId && !showNewMovieForm)
            }
            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 transition flex items-center"
          >
            {loading || creatingMovie ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
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
            ) : showNewMovieForm ? (
              "Create & Add"
            ) : (
              "Add"
            )}
          </button>
        </div>

        {showNewMovieForm && (
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Create New Movie
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Movie Title *
                </label>
                <input
                  type="text"
                  value={newMovieTitle}
                  onChange={(e) => setNewMovieTitle(e.target.value)}
                  placeholder="Enter movie title"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Release Year
                </label>
                <input
                  type="number"
                  value={newMovieYear}
                  onChange={(e) => setNewMovieYear(e.target.value)}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancelNewMovie}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateAndAssociate}
                  disabled={creatingMovie || !newMovieTitle.trim()}
                  className="flex-1 px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  {creatingMovie ? "Creating..." : "Create & Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {showSuccess && (
        <div className="text-xs text-green-600 animate-pulse bg-green-50 p-2 rounded">
          ✓{" "}
          {showNewMovieForm
            ? "Movie created and associated successfully!"
            : "Movie associated successfully!"}
        </div>
      )}
    </div>
  );
}
