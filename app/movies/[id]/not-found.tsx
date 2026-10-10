import Link from "next/link";

export default function MovieNotFound() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-10">
      <h1 className="text-2xl font-semibold text-foreground">
        Movie not found
      </h1>
      <p className="text-sm text-muted">
        We couldn&apos;t find the specific movie you are looking for. It may
        have been removed, or the link may be wrong.
      </p>
      <Link
        href="/"
        className="text-sm text-brand-400 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      >
        <span aria-hidden="true">←</span>
        Back to search
      </Link>
    </main>
  );
}
