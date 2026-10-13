import { GridSkeleton } from "../Shared";

export function SearchResultsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div
        aria-hidden="true"
        className="h-7 w-48 rounded bg-surface motion-safe:animate-pulse"
      />
      <div className="min-h-150">
        <GridSkeleton />
      </div>
    </div>
  );
}
