import { NextResponse } from "next/server";

const titles = {
  400: "Invalid request",
  404: "Not found",
  500: "Internal server error",
  503: "Service unavailable",
} as const;

type ErrorStatus = keyof typeof titles;

export const errorResponse = (status: ErrorStatus, detail: string) =>
  NextResponse.json(
    { type: "about:blank", title: titles[status], status, detail },
    { status, headers: { "Content-Type": "application/problem+json" } },
  );

export const badRequest = (detail: string) => errorResponse(400, detail);
export const notFound = (detail: string) => errorResponse(404, detail);
export const serviceUnavailable = (detail: string) =>
  errorResponse(503, detail);
