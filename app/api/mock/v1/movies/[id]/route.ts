import { NextResponse } from "next/server";

import movieDetails from "~/app/api/mock/v1/_fixtures/details.json";
import { movieIdSchema } from "~/lib/schemas";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsedId = movieIdSchema.safeParse((await params).id);

  if (!parsedId.success) {
    return NextResponse.json(
      {
        type: "about:blank",
        title: "Invalid request",
        status: 400,
        detail: "The 'id' must be a positive whole number.",
      },
      { status: 400, headers: { "Content-Type": "application/problem+json" } },
    );
  }

  const movie = movieDetails.find((entry) => entry.id === parsedId.data);

  if (!movie) {
    return NextResponse.json(
      {
        type: "about:blank",
        title: "Not found",
        status: 404,
        detail: `Movie ${parsedId.data} does not exist.`,
      },
      { status: 404, headers: { "Content-Type": "application/problem+json" } },
    );
  }

  return NextResponse.json(movie);
}
