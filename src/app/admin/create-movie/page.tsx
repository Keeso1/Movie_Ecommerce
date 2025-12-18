"use client";
import { authClient } from "@/lib/auth-client";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
// import MultipleSelectDemo from "@/components/ui/select-32";
// import { getMoviePersons } from "@/actions/create-movie-actions";
// import MultipleSelector from "@/components/ui/multi-select";
// import { getActors } from "@/actions/create-movie-actions";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  runtime: z.number().min(1, "Runtime must be greater than 0"),
  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  price: z.number().min(0, "Price can't be negative"),
  stock: z.number().min(0, "Stock can't be negative"),
  moviePersons: z.string().array(),
  genres: z.string().array(),
});

type createMovieFormData = z.infer<typeof schema>;

// const moviePersons = getMoviePersons.map(( person ) => ( {value: person.name, label: person.name} ));

export default function CreateMoviePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const session = authClient.useSession();
  // const [isAuthorised, setIsAuthorised] = useState(false)
  // const [actors, setActors] = useState<{ value: string; label: string }[]>([]);

  if (session.data?.user.role !== "admin") {
    router.push("/");
    // setIsAuthorised(true)
  }

  const form = useForm<createMovieFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      runtime: 0,
      releaseDate: new Date().toISOString().split("T")[0],
      price: 0,
      stock: 0,
      moviePersons: new Array<string>(),
      genres: new Array<string>(),
    },
  });

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
              {...form.register("runtime", { valueAsNumber: true })}
              disabled={isLoading}
            />
            <FieldError errors={[form.formState.errors.runtime]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>ReleaseDate</FieldLabel>
          <FieldContent>
            <Input
              type="date"
              {...form.register("releaseDate")}
              disabled={isLoading}
            />
            <FieldError errors={[form.formState.errors.releaseDate]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Price</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              {...form.register("price", { valueAsNumber: true })}
              disabled={isLoading}
            />
            <FieldError errors={[form.formState.errors.price]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Stock</FieldLabel>
          <FieldContent>
            <Input
              type="number"
              {...form.register("stock", { valueAsNumber: true })}
              disabled={isLoading}
            />
            <FieldError errors={[form.formState.errors.stock]} />
          </FieldContent>
        </Field>

        {/* <Field> */}
        {/*   <FieldLabel>Actors</FieldLabel> */}
        {/*   <FieldContent> */}
        {/*     <MultipleSelector */}
        {/*       options={actors} */}
        {/*       value={form.register(name: "moviePersons", )} */}
        {/*       onValueChange={form.register} */}
        {/*       placeholder="Choose frameworks..." */}
        {/*     /> */}
        {/*     <FieldError errors={[form.formState.errors.stock]} /> */}
        {/*   </FieldContent> */}
        {/* </Field> */}
      </form>
    </FormProvider>
  );
}
