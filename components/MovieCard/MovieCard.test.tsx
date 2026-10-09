import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MovieCard } from "./MovieCard";

describe("MovieCard", () => {
  it("renders the movie title and rating", () => {
    render(
      <MovieCard
        movie={{
          id: 1,
          title: "A Trending Movie",
          overview: null,
          posterPath: null,
          backdropPath: null,
          voteAverage: 8.1,
          releaseDate: "2024-05-01",
        }}
      />,
    );

    expect(screen.getByText("A Trending Movie")).toBeInTheDocument();
    expect(screen.getByText("★ 8.1")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("links to the movie's detail page", () => {
    render(
      <MovieCard
        movie={{
          id: 42,
          title: "Linked Movie",
          overview: null,
          posterPath: null,
          backdropPath: null,
          voteAverage: 7,
          releaseDate: null,
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "Linked Movie" })).toHaveAttribute(
      "href",
      "/movies/42",
    );
  });
});
