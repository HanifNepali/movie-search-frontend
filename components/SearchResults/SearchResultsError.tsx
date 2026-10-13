"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";
import type { FallbackProps } from "react-error-boundary";

export const SearchResultsError = ({ resetErrorBoundary }: FallbackProps) => {
  const router = useRouter();

  // resetErrorBoundary only re-renders the children in the browser, and they are still the failed server output.
  // router.refresh() makes the server re-run SearchResults (and the API call);
  // the reset then clears the error UI.
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
        Couldn&apos;t load search results
      </h2>
      <p className="text-sm text-muted">
        The movie API might be slow or unreachable. You can still try again.
      </p>
      <button
        type="button"
        onClick={handleRetry}
        className="focus-visible:outline-brand-400. rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Try again
      </button>
    </div>
  );
};
