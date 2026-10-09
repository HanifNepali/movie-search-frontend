import { Suspense } from "react";
import { SearchBar } from "~/components/SearchBar";
import {
  SearchResults,
  SearchResultsBoundary,
} from "~/components/SearchResults";
import { GridSkeleton } from "~/components/Shared/GridSkeleton";
import { TrendingGrid } from "~/components/TrendingGrid";
import { getTrendingMovies } from "~/lib/api";
import { searchParamsSchema } from "~/lib/schemas";

// Renders per-request rather than being statically generated at build time,
// since this page depends on the .NET API being reachable — which it isn't
// during `next build` in CI.
export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { query, page } = searchParamsSchema.parse(await searchParams);

  const trendingMovies = await getTrendingMovies();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Movie Search Case
        </h1>
        <SearchBar initialQuery={query} />
      </header>

      {/* if the query is empty, Show trending movies else show search results. */}
      {query === "" ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium text-foreground">
            Trending this week
          </h2>
          <TrendingGrid movies={trendingMovies} />
        </section>
      ) : (
        <SearchResultsBoundary>
          <Suspense fallback={<GridSkeleton />}>
            <SearchResults query={query} page={page} />
          </Suspense>
        </SearchResultsBoundary>
      )}
    </main>
  );
}
