import { describe, expect, it } from "vitest";

import {
  MAX_PAGE,
  movieIdSchema,
  movieSchema,
  searchParamsSchema,
  searchRequestSchema,
  searchResponseSchema,
} from "./schemas";

const validMovie = {
  id: 268,
  title: "Batman",
  overview: null,
  posterPath: null,
  backdropPath: null,
  voteAverage: 7.2,
  releaseDate: "1989-06-21",
};

describe("searchParamsSchema (lenient, for the URL)", () => {
  it("trims the query and parses the page", () => {
    expect(searchParamsSchema.parse({ query: "  batman ", page: "2" })).toEqual(
      { query: "batman", page: 2 },
    );
  });

  it("falls back to defaults when params are missing", () => {
    expect(searchParamsSchema.parse({})).toEqual({ query: "", page: 1 });
  });

  it("accepts the largest valid page", () => {
    expect(
      searchParamsSchema.parse({ query: "a", page: String(MAX_PAGE) }).page,
    ).toBe(MAX_PAGE);
  });
});

describe("searchRequestSchema (strict, from the API contract)", () => {
  it("defaults the page to 1", () => {
    expect(searchRequestSchema.parse({ query: "batman" })).toEqual({
      query: "batman",
      page: 1,
    });
  });

  it("accepts a numeric-looking query", () => {
    expect(searchRequestSchema.safeParse({ query: "20" }).success).toBe(true);
  });

  it.each(["", "   "])("rejects the blank query %j", (query) => {
    const result = searchRequestSchema.safeParse({ query });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "The 'query' parameter is required.",
    );
  });

  it.each(["0", "abc", "1.5", String(MAX_PAGE + 1)])(
    "rejects page=%s",
    (page) => {
      expect(searchRequestSchema.safeParse({ query: "a", page }).success).toBe(
        false,
      );
    },
  );
});

describe("movieIdSchema", () => {
  it("parses a positive whole number", () => {
    expect(movieIdSchema.parse("268")).toBe(268);
  });

  it.each(["0", "-1", "abc", "1.5", ""])("rejects %j", (id) => {
    expect(movieIdSchema.safeParse(id).success).toBe(false);
  });
});

describe("movieSchema / searchResponseSchema", () => {
  it("rejects a wrong type", () => {
    expect(
      movieSchema.safeParse({ ...validMovie, voteAverage: "high" }).success,
    ).toBe(false);
  });

  it("accepts the empty search response from the contract", () => {
    expect(
      searchResponseSchema.safeParse({
        page: 1,
        totalPages: 0,
        totalResults: 0,
        results: [],
      }).success,
    ).toBe(true);
  });

  it("rejects a response with a malformed result", () => {
    expect(
      searchResponseSchema.safeParse({
        page: 1,
        totalPages: 1,
        totalResults: 1,
        results: [{ id: 1 }],
      }).success,
    ).toBe(false);
  });
});
