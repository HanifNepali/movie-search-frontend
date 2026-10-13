"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { useDebounce } from "~/hooks/useDebounce";
import { cn } from "~/lib/cn";

export interface SearchBarProps {
  /** The `query` currently in the URL, read on the server. */
  initialQuery: string;
}

export function SearchBar({ initialQuery }: SearchBarProps) {
  const router = useRouter();

  const [input, setInput] = useState(initialQuery);
  // Keeps typing responsive: the navigation (server render) is a low-priority update.
  const [isPending, startTransition] = useTransition();

  const debouncedQuery = useDebounce(input.trim());

  // The last query this component put in the URL
  const lastQuery = useRef(initialQuery);

  const shouldDisableSearch = input.trim() === "" || isPending;

  const navigate = useCallback(
    (query: string, method: "push" | "replace") => {
      lastQuery.current = query;
      const url = query ? `/?${new URLSearchParams({ query })}` : "/";
      startTransition(() => router[method](url));
    },
    [router],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (shouldDisableSearch) return;

    const query = input.trim();
    // Submit searches immediately (skips the debounce) and adds a history entry.
    if (query !== lastQuery.current) navigate(query, "push");
  };

  // Typing: replace, update the URL once the user pauses
  // Without the "replace" option, this would add a new history entry for every keystroke.
  useEffect(() => {
    if (debouncedQuery !== lastQuery.current) {
      navigate(debouncedQuery, "replace");
    }
  }, [debouncedQuery, navigate]);

  // Back/forward navigation: the URL changed, so reflect it in the input.
  useEffect(() => {
    // Did the search bar cause the URL change?
    // If so, don't update the input, since it's already correct.
    if (initialQuery !== lastQuery.current) {
      lastQuery.current = initialQuery;
      setInput(initialQuery);
    }
  }, [initialQuery]);

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full max-w-md items-center gap-2"
    >
      <label htmlFor="movie-search" className="sr-only">
        Search for a movie
      </label>
      <input
        id="movie-search"
        type="search"
        name="query"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        autoComplete="off"
        aria-describedby="movie-search-hint"
        placeholder="Search for a movie…"
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted"
      />
      <span id="movie-search-hint" className="sr-only">
        Results update as you type. Press Enter to search immediately.
      </span>

      <button
        type="submit"
        aria-disabled={shouldDisableSearch}
        className={cn(
          "rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white",
          {
            "cursor-not-allowed opacity-50": shouldDisableSearch,
            "cursor-pointer hover:brightness-90": !shouldDisableSearch,
          },
        )}
      >
        Search
      </button>
      <span role="status" className="sr-only">
        {isPending ? "Searching…" : ""}
      </span>
    </form>
  );
}
