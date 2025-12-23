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
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import MultipleSelectDemo from "@/components/ui/select-32";
// import { getMoviePersons } from "@/actions/create-movie-actions";
import { MultiSelect } from "./multi-select";
import { Controller } from "react-hook-form";
import { FieldDescription } from "@/components/ui/field";
import { Suspense, use, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  runtime: z.number().min(1, "Runtime must be greater than 0"),
  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  price: z.number().min(0, "Price can't be negative"),
  stock: z.number().min(0, "Stock can't be negative"),
  moviePersons: z.array(z.object({ value: z.string(), label: z.string() })),
  genres: z.string().array(),
});

type createMovieFormData = z.infer<typeof schema>;

export default function CreateMovieForm({
  actors,
  directors,
}: {
  actors: Promise<{ value: string; label: string }[]>;
  directors: Promise<{ value: string; label: string }[]>;
}) {
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // const [isAuthorised, setIsAuthorised] = useState(false)
  console.log(actors);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      runtime: 0,
      releaseDate: new Date().toISOString().split("T")[0],
      price: 0,
      stock: 0,
      moviePersons: new Array<{ value: string; label: string }>(),
      genres: new Array<string>(),
    },
  });

  function MultiSelectWrapper({
    moviePersons,
    field,
  }: {
    moviePersons: Promise<{ value: string; label: string }[]>;
    field: ControllerRenderProps<createMovieFormData, "moviePersons">;
  }) {
    const moviePerson = use(moviePersons);
    return (
      <MultiSelect
        options={moviePerson}
        onValueChange={field.onChange}
        placeholder="Select actors..."
        variant="secondary"
      />
    );
  }
  const onSubmit = (data: createMovieFormData) => {
    setIsLoading(true);
    console.log(data);
    setIsLoading(false);
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
                valueAsDate: true,
                disabled: isLoading,
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
                valueAsDate: true,
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

        <Suspense fallback="">
          <Controller
            name="moviePersons"
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
                <MultiSelectWrapper moviePersons={actors} field={field} />
              </Field>
            )}
          />
        </Suspense>

        <Suspense fallback={<p>Loading...</p>}>
          <Controller
            name="moviePersons"
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
                <MultiSelectWrapper moviePersons={directors} field={field} />
              </Field>
            )}
          />
        </Suspense>
      </form>
    </FormProvider>
  );
}
