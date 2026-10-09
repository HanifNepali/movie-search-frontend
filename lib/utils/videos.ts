import type { Video } from "~/types/movie";

/**
 * The README only allows YouTube embeds, so other sites are ignored.
 * Prefers a "Trailer", then falls back to any YouTube video.
 */
export function pickTrailer(videos: Video[]): Video | null {
  const youtube = videos.filter((video) => video.site === "YouTube");

  return (
    youtube.find((video) => video.type === "Trailer") ?? youtube[0] ?? null
  );
}
