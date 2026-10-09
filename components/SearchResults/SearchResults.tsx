import { TrendingGrid } from "~/components/TrendingGrid";
import { searchMovies } from "~/lib/api";
import { EmptyState, Pagination } from "../Shared";

export interface SearchResultsProps {
  query: string;
  page: number;
}

export async function SearchResults({ query, page }: SearchResultsProps) {
  const { totalResults, results, totalPages } = await searchMovies(query, page);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-medium text-foreground">
        {totalResults} results for &ldquo;{query}&rdquo;
      </h2>

      {/* Show empty state if no results are found */}
      {results.length === 0 ? (
        <EmptyState>
          <EmptyState.Title>Sorry, no movies found</EmptyState.Title>
          <EmptyState.Description>
            Nothing matched &ldquo;{query}&rdquo;. Please check the spelling or
            try a different title.
          </EmptyState.Description>
        </EmptyState>
      ) : (
        <div className="min-h-148">
          <TrendingGrid movies={results} />
        </div>
      )}

      <Pagination
        query={query}
        page={page}
        totalPages={totalPages}
        totalResults={totalResults}
      />
    </section>
  );
}
