import { TrendingGrid } from "~/components/TrendingGrid";
import { searchMovies } from "~/lib/api";
import { Pagination } from "../Shared";

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

      {results.length > 0 ? (
        <div className="min-h-148">
          <TrendingGrid movies={results} />
        </div>
      ) : (
        <>
          <h3>Sorry, no movies found</h3>
          <p>
            Nothing matched &ldquo;{query}&rdquo;. Please check the spelling or
            try a different title.
          </p>
        </>
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
