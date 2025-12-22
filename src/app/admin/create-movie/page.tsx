"use client";
import { authClient } from "@/lib/auth-client";
import CreateMovieForm from "@/components/create-movie-form";
import { getActors } from "@/actions/create-movie-actions";
import { useEffect, useState } from "react";

export default function CreateMoviePage() {
  const session = authClient.useSession();
  const [actors, setActors] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const actorsData = await getActors();
        const formattedActors = actorsData.map((person) => ({
          value: person.id,
          label: person.name,
        }));
        setActors(formattedActors);
      } catch (error) {
        console.error("Failed to fetch actors:", error);
        // Optionally, handle the error state in the UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchActors();
  }, []); // Empty dependency array ensures this runs once on mount

  if (session.data?.user.role !== "admin") {
    return (
      <div>
        <p>404 not authorised</p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading form...</div>;
  }

  return <CreateMovieForm actors={actors}></CreateMovieForm>;
}
