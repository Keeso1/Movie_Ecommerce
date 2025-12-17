"use client";
import { authClient } from "@/lib/auth-client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import MultipleSelectDemo from "@/components/ui/select-32";
// import { getMoviePersons } from "@/actions/create-movie-actions";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  runtime: z.number(),
  releaseDate: z.iso.date(),
  price: z.number(),
  stock: z.number(),
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
      releaseDate: new Date().toDateString(),
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          disabled={isLoading}
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          disabled={isLoading}
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          disabled={isLoading}
          control={form.control}
          name="runtime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Runtime</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          disabled={isLoading}
          control={form.control}
          name="releaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ReleaseDate</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          disabled={isLoading}
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          disabled={isLoading}
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
      </form>
    </Form>
  );
}
