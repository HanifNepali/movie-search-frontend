import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ApiError, getMovieDetails } from "~/lib/api";
import { formatRuntime } from "~/lib/utils";
import { movieIdSchema } from "~/lib/schemas";
import { TrailerBoundary, TrailerSkeleton } from "~/components/Trailer";
import { Suspense } from "react";
import Trailer from "~/components/Trailer/Trailer";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
  const parsedId = movieIdSchema.safeParse((await params).id);
  if (!parsedId.success) notFound();

  // Only translates "the API says 404" into Next's not-found page.
  // Every other failure is rethrown to the route's error.tsx.
  const movie = await getMovieDetails(parsedId.data).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  const moveFacts = [
    movie.releaseDate?.slice(0, 4),
    movie.runtime !== null ? formatRuntime(movie.runtime) : null,
    movie.genres.length > 0 ? movie.genres.join(", ") : null,
  ].filter(Boolean);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <Link
        href="/"
        className="w-fit text-sm text-brand-400 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      >
        Back to search
      </Link>

      <article className="flex flex-col gap-8">
        {movie.backdropPath ? (
          <div className="relative aspect-21/9 w-full overflow-hidden rounded-lg bg-surface">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.backdropPath}`}
              alt={`Backdrop for ${movie.title}`}
              fill
              priority
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-60 items-center justify-center rounded-lg border border-border bg-surface text-xs text-muted">
            No backdrop available
          </div>
        )}
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative aspect-2/3 w-full max-w-60 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
            {movie.posterPath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                alt={`Poster for ${movie.title}`}
                fill
                sizes="240px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted">
                No poster available
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-foreground">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-sm text-muted italic">{movie.tagline}</p>
            )}
            <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted">
              {moveFacts.length > 0 && <span>{moveFacts.join(" · ")}</span>}
              <span
                aria-label={`Rated ${movie.voteAverage.toFixed(1)} out of 10`}
              >
                ★ {movie.voteAverage.toFixed(1)}
              </span>
            </p>
            <p className="max-w-prose text-sm leading-relaxed text-foreground">
              {movie.overview ?? "No overview available."}
            </p>
          </div>
        </div>
        <TrailerBoundary>
          <Suspense fallback={<TrailerSkeleton />}>
            <Trailer movieId={movie.id} title={movie.title} />
          </Suspense>
        </TrailerBoundary>
      </article>
    </main>
  );
}
