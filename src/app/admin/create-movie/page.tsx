"use client";
import { authClient } from "@/lib/auth-client";
import CreateMovieForm from "@/components/create-movie-form";
import { getActors, getDirectors } from "@/actions/create-movie-actions";
import { useEffect, useState } from "react";

export default function CreateMoviePage() {
  const session = authClient.useSession();
  const [actors, setActors] = useState<{ value: string; label: string }[]>([]);
  const [directors, setDirectors] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMoviePerson = async (role: string) => {
      try {
        const moviePersonData =
          role == "actor" ? await getActors() : await getDirectors();
        const formattedMoviePersons = moviePersonData.map((person) => ({
          value: person.id,
          label: person.name,
        }));
        if (role == "actor") {
          setActors(formattedMoviePersons);
        } else if (role == "director") {
          setDirectors(formattedMoviePersons);
        }
      } catch (error) {
        console.error("Failed to fetch actors:", error);
        // Optionally, handle the error state in the UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoviePerson("actor");
    fetchMoviePerson("director");
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

  return (
    <CreateMovieForm actors={actors} directors={directors}></CreateMovieForm>
  );
}
