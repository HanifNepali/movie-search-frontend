export function PaginationSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div
        aria-hidden="true"
        className="mx-auto mb-2 h-5 w-35 rounded-md bg-surface motion-safe:animate-pulse"
      />
      <div
        aria-hidden="true"
        className="mx-auto h-10 w-72 rounded-md bg-surface motion-safe:animate-pulse"
      />
    </div>
  );
}
