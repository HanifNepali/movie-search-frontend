import { Suspense } from "react";

import { EmptyState, Pagination } from "~/components/Shared";
import { TrendingGrid } from "~/components/TrendingGrid";
import { searchMovies } from "~/lib/api";
import type { SearchResponse } from "~/lib/schemas";

import { LiveAnnouncement } from "../Shared";
import { SearchResultsSkeleton } from "./SearchResultsSkeleton";
import { PaginationSkeleton } from "../Shared/Pagination/PaginationSkeleton";

export interface SearchResultsProps {
  query: string;
  page: number;
}

interface PartProps {
  response: Promise<SearchResponse>;
  query: string;
}

export function SearchResults({ query, page }: SearchResultsProps) {
  // Started once and awaited by both parts, so there is a single API request.
  const response = searchMovies(query, page);

  return (
    <section className="flex flex-col gap-4">
      {/* Keyed: remounts on every search or page, so the skeleton shows. */}
      <Suspense key={`${query}-${page}`} fallback={<SearchResultsSkeleton />}>
        <ResultsGrid response={response} query={query} />
      </Suspense>

      {/* Not keyed: during a navigation the current pagination is shown until the new one is ready. */}
      <Suspense fallback={<PaginationSkeleton />}>
        <ResultsPagination response={response} query={query} />
      </Suspense>
    </section>
  );
}

export async function ResultsGrid({ response, query }: PartProps) {
  const { totalResults, results } = await response;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium text-foreground">
        {totalResults} results for &ldquo;{query}&rdquo;
      </h2>

      {results.length === 0 ? (
        <>
          <LiveAnnouncement message={`No movies found for “${query}”.`} />
          <EmptyState>
            <EmptyState.Title>Sorry, no movies found</EmptyState.Title>
            <EmptyState.Description>
              Nothing matched &ldquo;{query}&rdquo;. Please check the spelling
              or try a different title.
            </EmptyState.Description>
          </EmptyState>
        </>
      ) : (
        <div className="min-h-148">
          <TrendingGrid movies={results} />
        </div>
      )}
    </div>
  );
}

export async function ResultsPagination({ response, query }: PartProps) {
  const { page, totalPages, totalResults } = await response;

  return (
    <Pagination
      query={query}
      page={page}
      totalPages={totalPages}
      totalResults={totalResults}
    />
  );
}
