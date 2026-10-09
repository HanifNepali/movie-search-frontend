import type { ReactNode } from "react";
import TrailerError from "./TrailerError";
import { ErrorBoundary } from "react-error-boundary";

interface TrailerBoundaryProps {
  children: ReactNode;
}

export const TrailerBoundary = ({ children }: TrailerBoundaryProps) => (
  <ErrorBoundary FallbackComponent={TrailerError}>{children}</ErrorBoundary>
);
