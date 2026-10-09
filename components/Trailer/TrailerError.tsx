"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { type FallbackProps } from "react-error-boundary";

export default function TrailerError({ resetErrorBoundary }: FallbackProps) {
  const router = useRouter();

  // Same reasoning as SearchResultsError: reset alone re-renders the failed
  // server output, so the server has to re-run as well.
  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
      resetErrorBoundary();
    });
  };

  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-md border border-surface p-6"
    >
      <h2 className="text-lg font-medium text-foreground">
        Couldn&apos;t load the trailer
      </h2>
      <p className="text-sm text-muted">
        The rest of the page is unaffected. You can try again.
      </p>
      <button
        type="button"
        onClick={handleRetry}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
      >
        Try again
      </button>
    </div>
  );
}
