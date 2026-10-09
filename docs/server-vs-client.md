# Server vs client components

Components are server components by default. A component gets `"use client"` only when it needs state, effects, event handlers, or an error boundary. Everything else, including the results, pagination and detail page, renders on the server and reaches the browser as HTML.

## What runs where in the application

| Runs on    | Components                                                             | Why                                                                            |
| ---------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Server     | `app/page.tsx`, `app/movies/[id]/page.tsx`                             | Read `searchParams` and `params`, fetch data                                   |
| Server     | `SearchResults`, `Trailer`                                             | Fetch and render, with no browser needs                                        |
| Server     | `Pagination`, `TrendingGrid`, `MovieCard`, `EmptyState`, skeletons     | Pure presentation, links only                                                  |
| **Client** | **`SearchBar`**                                                        | Input state, debounce timer, `useTransition`, `router.push` / `router.replace` |
| **Client** | **`SearchResultsBoundary`**, **`TrailerBoundary`** and their fallbacks | Error boundaries need client React, and "Try again" calls `router.refresh()`   |
| **Client** | **`error.tsx`** files                                                  | Required by Next.js                                                            |

`lib/api.ts` is `server-only`, so if a client component imports it, the build fails.

## Why `SearchBar` is client and `Pagination` is not

`SearchBar` owns text that changes on every keystroke, runs a timer, and starts navigations. `Pagination` only _describes_ the current state. Given `page`, `totalPages` and `totalResults`, it renders plain `<Link>`s, with no state and no handlers.

The two never talk to each other. They share only the URL:

```
SearchBar (client) --writes--> ?query=...&page=... --read by--> page.tsx (server) --props--> SearchResults, Pagination
```

## Server components inside client boundaries

Server components passed as `children` stay on the server even when a client component wraps them. The error boundaries use this:

```tsx
<SearchResultsBoundary>
  {" "}
  {/* client */}
  <Suspense fallback={<GridSkeleton />}>
    <SearchResults query={query} page={page} /> {/* server, async */}
  </Suspense>
</SearchResultsBoundary>
```
