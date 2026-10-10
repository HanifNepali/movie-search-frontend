"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function MovieError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-10">
      <div role="alert" className="flex flex-col items-start gap-3">
        <h1 className="text-2xl font-semibold text-foreground">
          Sorry, could not load this movie
        </h1>
        <p className="text-sm text-muted">
          The movie API might be slow or unreachable. You can try again.
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
        >
          Try again
        </button>
      </div>
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
