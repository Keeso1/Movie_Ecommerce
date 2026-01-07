//admin/movies/people/components/DeleteButton.tsx *

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMoviePerson } from "../actions";

interface DeleteButtonProps {
  personId: string;
}

export function DeleteButton({ personId }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteMoviePerson(personId);
      router.push("/admin/movies/people");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete person:", error);
      alert("Failed to delete person. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }

  if (showConfirm) {
    return (
      <div className="inline-flex items-center space-x-2">
        <span className="text-sm text-gray-600">Are you sure?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-sm bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-900"
    >
      Delete
    </button>
  );
}
