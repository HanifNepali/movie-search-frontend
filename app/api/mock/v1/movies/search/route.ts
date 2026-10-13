import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { badRequest, serviceUnavailable } from "~/app/api/lib/errors";

import catalog from "~/app/api/mock/v1/_fixtures/catalog.json";
import { searchRequestSchema } from "~/lib/schemas";

const PAGE_SIZE = 12;
const SLOW_DELAY_MS = 3000;

export async function GET(request: NextRequest) {
  // Destructure the query parameters from the request URL
  const { searchParams } = request.nextUrl;

  // Parse and validate the query parameters using searchRequestSchema schema
  const parsed = searchRequestSchema.safeParse({
    query: searchParams.get("query") ?? "",
    page: searchParams.get("page") ?? undefined,
  });

  // Check if the parsed result is valid;
  // if not, return a 400 Bad Request response with details of the validation errors
  if (!parsed.success) {
    return badRequest(
      z.prettifyError(parsed.error) ?? "The request is invalid.",
    );
  }

  // Normalize the query to lowercase for case-insensitive matching0
  const { query, page } = parsed.data;
  const normalizedQuery = query.toLowerCase().trim();
  let searchTerm = normalizedQuery;

  // Handle special cases for the query parameter
  // Case 1: If the query is "error", return a 503 Service Unavailable response
  if (normalizedQuery === "error") {
    return serviceUnavailable("The upstream movie service did not respond.");
  }

  // Case 2: If the query is "slow", introduce an artificial delay to simulate a slow response
  if (normalizedQuery === "slow") {
    // "slow" has no matches of its own, so it serves the "batman" results.
    // The choice of "batman" is arbitrary; it could be any other term that has matches in the catalog.
    searchTerm = "batman";

    // artificial delay
    await new Promise((resolve) => setTimeout(resolve, SLOW_DELAY_MS));
  }

  const matchedResults = catalog.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm),
  );

  const startPage = (page - 1) * PAGE_SIZE;

  return NextResponse.json({
    page,
    totalPages: Math.ceil(matchedResults.length / PAGE_SIZE),
    totalResults: matchedResults.length,
    results: matchedResults.slice(startPage, startPage + PAGE_SIZE),
  });
}
