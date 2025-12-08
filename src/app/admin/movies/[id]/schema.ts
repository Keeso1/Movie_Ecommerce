/*  Zod validation schema for movie data  */

import z from "zod";

export const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  releaseYear: z.number().int().min(1900).max(new Date().getFullYear()),
  imageUrl: z.string().url().optional(),
});

export type MovieInput = z.infer<typeof movieSchema>;
export default movieSchema;