import { authClient } from "@/lib/auth-client";
import CreateMovieForm from "@/components/create-movie-form";

export default function CreateMoviePage() {
  const session = authClient.useSession();

  if (session.data?.user.role !== "admin") {
    return (
      <div>
        <p>404 not authorised</p>
      </div>
    );
  }
  return <CreateMovieForm></CreateMovieForm>;
}
