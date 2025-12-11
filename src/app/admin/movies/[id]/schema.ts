/**
 * Admin movie schema is now derived from the canonical movieSchema in src/lib/validation/movieSchema.ts.
 * If the admin form only edits a subset of fields, we use .pick() to select those fields.
 * This ensures validation rules remain consistent across the codebase.
 */

import { movieSchema as baseMovieSchema } from "../../../lib/validation/movieSchema";

// For the admin form, we only need a subset of fields (title, description, releaseYear, imageUrl)
export const movieSchema = baseMovieSchema.pick({
  title: true,
  description: true,
  releaseYear: true,
  imageUrl: true,
});

export type MovieInput = typeof movieSchema._type;
export default movieSchema;