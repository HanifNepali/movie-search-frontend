import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { searchMovies } from "~/lib/api";
import type { SearchResponse } from "~/lib/schemas";

import { SearchResults } from "./SearchResults";

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

describe("SearchResults", () => {
  beforeEach(() => vi.clearAllMocks());

  it("asks the API for the given query and page", async () => {
    respondWith({ page: 1, totalPages: 3, totalResults: 40, results: [movie] });

    render(await SearchResults({ query: "batman", page: 1 }));

    expect(searchMovies).toHaveBeenCalledWith("batman", 1);
  });

  it("renders the results with pagination", async () => {
    respondWith({ page: 1, totalPages: 3, totalResults: 40, results: [movie] });

    render(await SearchResults({ query: "batman", page: 1 }));

    expect(
      screen.getByRole("heading", { name: /40 results for/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "A Trending Movie" }),
    ).toBeVisible();
    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeVisible();
  });

  it("renders the empty state when nothing matches", async () => {
    respondWith({ page: 1, totalPages: 0, totalResults: 0, results: [] });

    render(await SearchResults({ query: "noresults", page: 1 }));

    expect(
      screen.getByRole("heading", { name: "Sorry, no movies found" }),
    ).toBeVisible();
    expect(screen.queryByRole("navigation")).toBeNull();
  });
});
