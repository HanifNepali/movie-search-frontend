import { NextResponse } from "next/server";
import { badRequest } from "~/app/api/lib/errors";

import videos from "~/app/api/mock/v1/_fixtures/videos.json";
import { movieIdSchema } from "~/lib/schemas";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsedId = movieIdSchema.safeParse((await params).id);

  if (!parsedId.success) {
    return badRequest("The 'id' must be a positive whole number.");
  }

  const videosByMovieId: Record<string, unknown> = videos;

  return NextResponse.json(videosByMovieId[String(parsedId.data)] ?? []);
}
