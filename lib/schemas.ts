import { z } from "zod";

import type { Movie, MovieDetail, Video } from "~/types/movie";

/** Caps pagination at 500 pages to mimic TMDB */
export const MAX_PAGE = 500;

const PAGE_ERROR = `The 'page' parameter must be a whole number between 1 and ${MAX_PAGE}.`;

const movieFields = z.object({
  id: z.number().int(),
  title: z.string(),
  overview: z.string().nullable(),
  posterPath: z.string().nullable(),
  backdropPath: z.string().nullable(),
  voteAverage: z.number(),
  releaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD")
    .nullable(),
});

/**
 * Typed against the hand-written interfaces so the compiler fails
 * if a schema and its interface ever drift apart.
 */
export const movieSchema: z.ZodType<Movie> = movieFields;

export const moviesSchema = z.array(movieSchema);

export const searchResponseSchema = z.object({
  page: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  totalResults: z.number().int().min(0),
  results: z.array(movieSchema),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

export const searchRequestSchema = z.object({
  query: z.string().trim().min(1, "The 'query' parameter is required."),
  page: z.coerce
    .number({ error: PAGE_ERROR })
    .int(PAGE_ERROR)
    .min(1, PAGE_ERROR)
    .max(MAX_PAGE, PAGE_ERROR)
    .default(1),
});

/** Lenient parse for URL params: bad input falls back to defaults. */
export const searchParamsSchema = z.object({
  query: z.string().trim().catch(""),
  page: z.coerce.number().int().min(1).max(MAX_PAGE).catch(1),
});

export const movieDetailSchema: z.ZodType<MovieDetail> = movieFields.extend({
  runtime: z.number().int().nullable(),
  tagline: z.string().nullable(),
  genres: z.array(z.string()),
});

export const videosSchema: z.ZodType<Video[]> = z.array(
  z.object({
    key: z.string(),
    name: z.string(),
    site: z.string(),
    type: z.string(),
  }),
);

/** A movie id from a URL or request: a positive whole number. */
export const movieIdSchema = z.coerce.number().int().positive();
