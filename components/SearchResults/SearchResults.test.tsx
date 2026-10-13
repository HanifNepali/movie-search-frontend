import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { searchMovies } from "~/lib/api";
import type { SearchResponse } from "~/lib/schemas";

import { ResultsGrid, ResultsPagination, SearchResults } from "./SearchResults";

vi.mock("~/lib/api", () => ({ searchMovies: vi.fn() }));

const movie = {
  id: 1,
  title: "A Trending Movie",
  overview: null,
  posterPath: null,
  backdropPath: null,
  voteAverage: 8.1,
  releaseDate: "2020-05-01",
};

function respondWith(response: SearchResponse) {
  vi.mocked(searchMovies).mockResolvedValue(response);
}

/**
 * SearchResults starts one request and passes it to two parts (ResultsGrid and ResultsPagination), each inside its own Suspense boundary.  
 * jsdom can’t resolve async server components inside Suspense, so rendering SearchResults would only show the loading skeletons
 * `ResultsGrid` and `ResultsPagination` are plain async functions, so each one is awaited and its output rendered directly. *
 * `SearchResults` itself is checked only for the request it starts.
 */

describe("SearchResults", () => {
  beforeEach(() => vi.clearAllMocks());

  it("asks the API for the given query and page", async () => {
    respondWith({ page: 1, totalPages: 3, totalResults: 40, results: [movie] });

    // Called, not rendered: it only starts the request
    // and returns a Suspense tree, which jsdom can't resolve.
    SearchResults({ query: "batman", page: 1 });

    expect(searchMovies).toHaveBeenCalledTimes(1);
    expect(searchMovies).toHaveBeenCalledWith("batman", 1);
  });

  it("renders the pagination links", async () => {
    respondWith({ page: 1, totalPages: 3, totalResults: 40, results: [movie] });

    render(
      await ResultsPagination({
        response: searchMovies("batman", 1),
        query: "batman",
      }),
    );

    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Next page" })).toHaveAttribute(
      "href",
      "/?query=batman&page=2",
    );
  });

  it("renders the empty state when nothing matches", async () => {
    respondWith({ page: 1, totalPages: 0, totalResults: 0, results: [] });

    render(
      await act(() =>
        ResultsGrid({
          response: searchMovies("noresults", 1),
          query: "noresults",
        }),
      ),
    );

    expect(
      screen.getByRole("heading", { name: "Sorry, no movies found" }),
    ).toBeVisible();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
