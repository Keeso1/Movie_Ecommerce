//src/components/MovieAssociation.tsx *

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MovieAssociationProps {
  personId: string;
  availableMovies: Array<{
    id: string;
    title: string;
    releaseDate: Date;
  }>;
  onAssociate: (personId: string, movieId: string) => Promise<any>;
}

export function MovieAssociation({
  personId,
  availableMovies,
  onAssociate,
}: MovieAssociationProps) {
  const router = useRouter();
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAssociate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMovieId) return;

    setLoading(true);
    try {
      await onAssociate(personId, selectedMovieId);
      setSelectedMovieId("");
      router.refresh();
    } catch (error) {
      console.error("Failed to associate movie:", error);
      alert("Failed to associate movie. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleAssociate} className="flex space-x-2">
      <select
        value={selectedMovieId}
        onChange={(e) => setSelectedMovieId(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
      >
        <option value="">Select a movie...</option>
        {availableMovies.map((movie) => (
          <option key={movie.id} value={movie.id}>
            {movie.title} ({new Date(movie.releaseDate).getFullYear()})
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading || !selectedMovieId}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to Movie"}
      </button>
    </form>
  );
}