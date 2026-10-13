export function TrailerSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-3">
      <span className="sr-only">Loading trailer</span>
      <div
        aria-hidden="true"
        className="h-6 w-24 rounded bg-surface motion-safe:animate-pulse"
      />
      <div
        aria-hidden="true"
        className="aspect-video w-full rounded-lg bg-surface motion-safe:animate-pulse"
      />
    </div>
  );
}
