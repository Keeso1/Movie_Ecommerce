import { getMoviePersonById } from "../../actions";
import EditMoviePersonForm from "./EditMoviePersonForm";
import Link from "next/link";

export default async function EditMoviePersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getMoviePersonById(id);

  if (!person) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Person not found</h1>
          <Link
            href="/admin/movies/people"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Movie People
          </Link>
        </div>
      </div>
    );
  }

  return <EditMoviePersonForm person={person} />;
}