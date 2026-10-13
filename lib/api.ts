import "server-only";

import type { Movie, MovieDetail, Video } from "~/types/movie";

import {
  movieDetailSchema,
  moviesSchema,
  searchResponseSchema,
  videosSchema,
  type SearchResponse,
} from "./schemas";
import z from "zod";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env.local and point it at the running API.",
  );
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });

  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}`,
      response.status,
    );
  }

  return (await response.json()) as T;
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const result = await apiFetch<unknown>("/movies/trending", {
    cache: "no-store",
  });

  const parsed = moviesSchema.safeParse(result);

  if (!parsed.success) {
    throw new Error(
      `GET /movies/trending does not match the API contract:\n${z.prettifyError(parsed.error)}`,
    );
  }

  return parsed.data;
}

export async function searchMovies(
  query: string,
  page = 1,
): Promise<SearchResponse> {
  const params = new URLSearchParams({ query, page: String(page) });

  const result = await apiFetch<unknown>(`/movies/search?${params}`, {
    cache: "no-store",
  });

  const parsed = searchResponseSchema.safeParse(result);

  if (!parsed.success) {
    throw new Error(
      `GET /movies/search does not match the API contract:\n${z.prettifyError(parsed.error)}`,
    );
  }

  return parsed.data;
}

/** Full details for one movie. Throws `ApiError` (status 404) if it doesn't exist. */
export async function getMovieDetails(id: number): Promise<MovieDetail> {
  const body = await apiFetch<unknown>(`/movies/${id}`, { cache: "no-store" });

  const parsed = movieDetailSchema.safeParse(body);

  if (!parsed.success) {
    throw new Error(
      `GET /movies/${id} does not match the API contract:\n${z.prettifyError(parsed.error)}`,
    );
  }

  return parsed.data;
}

/** All videos for one movie. Empty when there are none. */
export async function getMovieVideos(id: number): Promise<Video[]> {
  const body = await apiFetch<unknown>(`/movies/${id}/videos`, {
    cache: "no-store",
  });

  const parsed = videosSchema.safeParse(body);

  if (!parsed.success) {
    throw new Error(
      `GET /movies/${id}/videos does not match the API contract:\n${z.prettifyError(parsed.error)}`,
    );
  }

  return parsed.data;
}
