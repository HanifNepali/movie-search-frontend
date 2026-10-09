import { NextResponse } from "next/server";

import videos from "~/app/api/mock/v1/_fixtures/videos.json";
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

  const videosByMovieId: Record<string, unknown> = videos;

  return NextResponse.json(videosByMovieId[String(parsedId.data)] ?? []);
}
