import { NextResponse } from "next/server";

import trendingFixture from "~/app/api/mock/v1/_fixtures/trending.json";

export function GET() {
  // This is a mock endpoint that returns a static fixture of trending movies.
  return NextResponse.json(trendingFixture);
}
