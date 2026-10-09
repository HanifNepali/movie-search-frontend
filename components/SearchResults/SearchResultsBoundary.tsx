"use client";

import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SearchResultsError } from "./SearchResultsError";

export const SearchResultsBoundary = ({
  children,
}: {
  children: ReactNode;
}) => (
  <ErrorBoundary FallbackComponent={SearchResultsError}>
    {children}
  </ErrorBoundary>
);
