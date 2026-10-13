import { getMovieVideos } from "~/lib/api";
import { pickTrailer } from "~/lib/utils";

export interface TrailerProps {
  movieId: number;
  title: string;
}

export default async function Trailer({ movieId, title }: TrailerProps) {
  const trailer = pickTrailer(await getMovieVideos(movieId));

  // For no embeddable video: not showing anything rather than an empty section.
  // Not showing a placeholder is better than showing a placeholder that doesn't work.
  if (!trailer) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="mb-4 text-center text-2xl font-medium text-foreground">
        Trailer
      </h2>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface">
        <iframe
          src={`https://www.youtube.com/embed/${encodeURIComponent(trailer.key)}`}
          title={`${title}: ${trailer.name}`}
          loading="lazy"
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </section>
  );
}
