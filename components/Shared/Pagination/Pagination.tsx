import Link from "next/link";
import { tv } from "tailwind-variants";

import { MAX_PAGE } from "~/lib/schemas";
import { getPageItems } from "~/lib/utils/pagination";

const item = tv({
  base: "inline-flex min-w-9 items-center justify-center rounded-md border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
  variants: {
    state: {
      link: "border-border bg-surface text-foreground hover:bg-surface-hover",
      current: "border-brand-600 bg-brand-600 font-medium text-white",
      disabled: "cursor-not-allowed border-border text-muted opacity-50",
    },
  },
});

export interface PaginationProps {
  query: string;
  page: number;
  totalPages: number;
  totalResults: number;
  pathname?: string;
}

function getPath(pathname: string, query: string, page: number) {
  const params = new URLSearchParams({ query });
  if (page > 1) params.set("page", String(page));
  return `${pathname}?${params}`;
}

export function Pagination({
  query,
  page,
  totalPages,
  totalResults,
  pathname = "/",
}: PaginationProps) {
  // The contract rejects page > MAX_PAGE, so never link past it.
  const lastPage = Math.min(totalPages, MAX_PAGE);

  if (totalResults === 0) return null;

  //  No pagination if there's only one page of results.
  if (lastPage <= 1) return null;

  // `min` keeps "Previous" useful if someone hand-edits the URL past the end.
  const previousPage = Math.min(page - 1, lastPage);

  return (
    <nav aria-label="Pagination" className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted">
        Page {page} of {lastPage} - {totalResults} results
      </p>

      <ul
        role="list"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        <li>
          {page > 1 ? (
            <Link
              href={getPath(pathname, query, previousPage)}
              rel="prev"
              aria-label="Previous page"
              className={item({ state: "link" })}
            >
              Previous
            </Link>
          ) : (
            <span aria-hidden="true" className={item({ state: "disabled" })}>
              Previous
            </span>
          )}
        </li>

        {getPageItems(page, lastPage).map((entry, index) =>
          entry === "ellipsis" ? (
            <li key={`ellipsis-${index}`} aria-hidden="true">
              <span className="px-1 text-muted">…</span>
            </li>
          ) : (
            <li key={entry}>
              {entry === page ? (
                <span
                  aria-current="page"
                  className={item({ state: "current" })}
                >
                  {entry}
                </span>
              ) : (
                <Link
                  href={getPath(pathname, query, entry)}
                  aria-label={`Page ${entry}`}
                  className={item({ state: "link" })}
                >
                  {entry}
                </Link>
              )}
            </li>
          ),
        )}

        <li>
          {page < lastPage ? (
            <Link
              href={getPath(pathname, query, page + 1)}
              rel="next"
              aria-label="Next page"
              className={item({ state: "link" })}
            >
              Next
            </Link>
          ) : (
            <span aria-hidden="true" className={item({ state: "disabled" })}>
              Next
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
