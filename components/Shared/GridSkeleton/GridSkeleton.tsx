export function GridSkeleton() {
  return (
    <div
      role="status"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      {/* A skeleton is silent to screen readers without this.*/}
      <span className="sr-only">Loading movies…</span>
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="aspect-2/3 w-full rounded-lg bg-surface motion-safe:animate-pulse"
          // motion-safe: stops the pulse for users who have set "reduce motion"
        />
      ))}
    </div>
  );
}
