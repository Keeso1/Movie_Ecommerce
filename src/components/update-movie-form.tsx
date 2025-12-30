"use client";
import z from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
// import MultipleSelectDemo from "@/components/ui/select-32";
// import { getMoviePersons } from "@/actions/create-movie-actions";
import MultipleSelector, { Option } from "./ui/multi-select";
import { Controller } from "react-hook-form";
import { FieldDescription } from "@/components/ui/field";
import { Suspense, use, useState } from "react";
import { createOrUpdateMovie } from "@/actions/create-movie-actions";
import { ControllerRenderProps } from "react-hook-form";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { fetchMoviePerson, fetchGenres } from "@/app/admin/create-movie/page";
import { getMovieType } from "@/actions/movie-actions";
import { useEffect } from "react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  runtime: z.number().min(1, "Runtime must be greater than 0"),
  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  price: z.number().min(0, "Price can't be negative"),
  stock: z.number().min(0, "Stock can't be negative"),
  actors: z.array(z.object({ value: z.string(), label: z.string() })),
  directors: z.array(z.object({ value: z.string(), label: z.string() })),
  genres: z.array(z.object({ value: z.string(), label: z.string() })),
});

export type createMovieFormData = z.infer<typeof schema>;

export default function UpdateMovieForm({ movie }: { movie: getMovieType }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const actors = fetchMoviePerson("actor");
  const directors = fetchMoviePerson("director");
  const genres = fetchGenres();

  const form = useForm<createMovieFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: movie.title,
      description: movie.description,
      runtime: movie.runtime ?? undefined,
      releaseDate: movie.releaseDate.toISOString().split("T")[0],
      price: movie.price,
      stock: movie.stock,
      actors: [],
      directors: [],
      genres: [],
    },
  });

  useEffect(() => {
    // Transform the movie's relational data into the Option[] format for the form.
    const defaultActors = movie.moviePersons
      .filter((person) => person.role === "actor")
      .map((person) => ({ value: person.id, label: person.name }));
    const defaultDirectors = movie.moviePersons
      .filter((person) => person.role === "director")
      .map((person) => ({ value: person.id, label: person.name }));
    const defaultGenres = movie.genres.map((genre) => ({
      value: genre.id,
      label: genre.name,
    }));

    // Reset the form with the fully populated default values.
    form.reset({
      title: movie.title,
      description: movie.description,
      runtime: movie.runtime ?? undefined,
      releaseDate: movie.releaseDate.toISOString().split("T")[0],
      price: movie.price,
      stock: movie.stock,
      actors: defaultActors,
      directors: defaultDirectors,
      genres: defaultGenres,
    });
  }, [movie, form]);

  function MultiSelectWrapper({
    data,
    field,
  }: {
    data: Promise<Option[]>;
    field: ControllerRenderProps<
      createMovieFormData,
      "actors" | "directors" | "genres"
    >;
  }) {
    const resolvedData = use(data);

    return (
      <MultipleSelector
        value={field.value}
        onChange={field.onChange}
        options={resolvedData}
        placeholder={
          field.name === "genres"
            ? "Type to search for genre.."
            : field.name === "actors"
              ? "Type to search for actors"
              : "Type to search for directors"
        }
        creatable
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    );
  }

  const onSubmit = async (data: createMovieFormData) => {
    setIsLoading(true);
    console.log(data.genres);
    console.log(data.actors);
    console.log(data.directors);
    try {
      const result = await createOrUpdateMovie(data);
      if (!result) {
        toast("Error", {
          description: "Failed to create movie",
        });
      } else {
        toast("Success", {
          description: "Movie created successfully",
        });
        router.push("/");
      }
    } catch {
      toast("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <FieldContent>
            <Input {...form.register("title")} disabled={isLoading} />
            <FieldError errors={[form.formState.errors.title]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <FieldContent>
            <Input {...form.register("description")} disabled={isLoading} />
            <FieldError errors={[form.formState.errors.description]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Runtime</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              {...form.register("runtime", {
                disabled: isLoading,
                valueAsNumber: true,
              })}
            />
            <FieldError errors={[form.formState.errors.runtime]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>ReleaseDate</FieldLabel>
          <FieldContent>
            <Input
              type="date"
              {...form.register("releaseDate", {
                //valueAsDate: true,
                disabled: isLoading,
              })}
            />
            <FieldError errors={[form.formState.errors.releaseDate]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Price</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              {...form.register("price", {
                valueAsNumber: true,
                disabled: isLoading,
              })}
            />
            <FieldError errors={[form.formState.errors.price]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Stock</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              {...form.register("stock", {
                valueAsNumber: true,
                disabled: isLoading,
              })}
            />
            <FieldError errors={[form.formState.errors.stock]} />
          </FieldContent>
        </Field>

        <Suspense fallback={<p>Loading...</p>}>
          <Controller
            name="directors"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="directors-dropdown">
                    Directors
                  </FieldLabel>
                  <FieldDescription>
                    Which directors worked on this movie?
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <MultiSelectWrapper data={directors} field={field} />
              </Field>
            )}
          />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <Controller
            name="actors"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="directors-dropdown">Actors</FieldLabel>
                  <FieldDescription>
                    Which actors worked on this movie?
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <MultiSelectWrapper data={actors} field={field} />
              </Field>
            )}
          />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <Controller
            name="genres"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="directors-dropdown">Genres</FieldLabel>
                  <FieldDescription>
                    Which genres does this movie have?
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <MultiSelectWrapper data={genres} field={field} />
              </Field>
            )}
          />
        </Suspense>

        <Button type="submit" disabled={isLoading}>
          Create Movie
        </Button>
      </form>
    </FormProvider>
  );
}
