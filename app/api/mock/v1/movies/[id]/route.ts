import { NextResponse } from "next/server";
import { badRequest, notFound } from "~/app/api/lib/errors";

import movieDetails from "~/app/api/mock/v1/_fixtures/details.json";
import { movieIdSchema } from "~/lib/schemas";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsedId = movieIdSchema.safeParse((await params).id);

  if (!parsedId.success) {
    return badRequest("The 'id' must be a positive whole number.");
  }

  const movie = movieDetails.find((entry) => entry.id === parsedId.data);

  if (!movie) {
    return notFound(`Movie ${parsedId.data} does not exist.`);
  }

  return NextResponse.json(movie);
}
