const Loading = () => (
  <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
    <div
      aria-hidden="true"
      className="h-5 w-32 rounded bg-surface motion-safe:animate-pulse"
    />

    <div role="status" className="flex flex-col gap-8">
      <span className="sr-only">Loading movie…</span>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="aspect-21/9 w-full rounded-lg bg-surface motion-safe:animate-pulse"
      />

      <div aria-hidden="true" className="flex flex-col gap-6 sm:flex-row">
        {/* Poster */}
        <div className="aspect-2/3 w-full max-w-60 shrink-0 rounded-lg bg-surface motion-safe:animate-pulse" />

        {/* Title, tagline, facts, overview */}
        <div className="flex w-full flex-col gap-3">
          <div className="h-8 w-64 rounded bg-surface motion-safe:animate-pulse" />
          <div className="h-4 w-48 rounded bg-surface motion-safe:animate-pulse" />
          <div className="h-4 w-56 rounded bg-surface motion-safe:animate-pulse" />
          <div className="h-24 w-full max-w-prose rounded bg-surface motion-safe:animate-pulse" />
        </div>
      </div>
    </div>

    {/* Skipping Trailer skeleton as it has its own suspense fallback */}
  </main>
);

export default Loading;
