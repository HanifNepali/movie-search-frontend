# Movie Search: Frontend

A Next.js movie search app built for the coding challenge. It shows trending movies, lets you search with pagination, and has a detail page with an embedded trailer. The app runs against a built-in mock API that follows the [API contract](docs/assignment.md#api-contract).

## Tasks completion

- P0-P2 tasks have been fully completed
- P3 is partially complete i.e debounced search query has been implemented.

## Features

- **Trending:** A list of trending movies on the home page, shown when there is no search query.
- **Search:** debounced search-as-you-type, with Enter to search immediately. The query and page live in the URL, so every search is shareable, bookmarkable and works with the Back button. **Hint: Please enter `the` as a sample movie to see results for pagination.**
- **Pagination:** page links driven by the API's `page`, `totalPages` and `totalResults`.
- **Movie detail:** poster, backdrop, tagline, runtime, genres, rating and overview.
- **Trailer:** an embedded YouTube trailer from the videos endpoint. Non-YouTube videos are ignored, and a movie with no embeddable video simply shows no trailer.
- **Loading, empty and error states:** skeletons while loading, a dedicated empty state for no results, and error boundaries for search results, the trailer and the movie details, so a failure in one area doesn't take down the rest of the page.
- **Runtime validation:** every API response is validated with Zod before it reaches a component.
- **Accessibility:** keyboard-operable, labelled form controls and visible focus states. See [Accessibility](docs/accessibility.md) for details and what was verified.
- **Mock API:** a Next.js route-handler mock with trigger values for every case in the assignment. **Every trending movie has details and a video entry.**

**Stack:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS 4, Zod, `react-error-boundary`, Vitest and Testing Library.

## Getting started

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

The app runs at <http://localhost:3000>. The default `.env.local` points at the built-in mock:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/mock/v1
```

The mock lives entirely in `app/api/mock/`, and deleting that folder removes it. Query values that trigger each mock case (no results, slow response, server error and so on) are listed in [Architecture](docs/architecture.md#mock-api).

## Running the tests

```bash
pnpm test
```

Run a single file or folder by passing a path filter:

```bash
pnpm test components/Shared/Pagination
```

Watch mode while developing:

```bash
pnpm exec vitest
```

Tests sit next to the code they cover (`*.test.ts` and `*.test.tsx`).See [Testing](docs/testing.md) for what is covered and what is not.

## Documentation

| Document                                                | Contents                                                           |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| [Assignment](docs/assignment.md)                        | The original assignment brief and API contract                     |
| [Architecture](docs/architecture.md)                    | How the pieces fit together and the search flow                    |
| [Mock API](docs/mock-api.md)                            | The mock API and its trigger values                                |
| [Technical decisions](docs/technical-decisions.md)      | What was prioritized and skipped, alternatives considered, and why |
| [Server vs client components](docs/server-vs-client.md) | What renders where, and why                                        |
| [Accessibility](docs/accessibility.md)                  | What accessibility concerns are addressed                          |
| [Testing](docs/testing.md)                              | Coverage, approach and gaps                                        |
