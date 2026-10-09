# Testing

Tests use Vitest, Testing Library and jsdom, and kept next to the code they cover.

```bash
pnpm test                          # run everything once
pnpm test components/Shared/Pagination   # run one folder or file
pnpm lint && pnpm typecheck && pnpm test # all checks
```

## What is covered

| Area               | Test file                                          | What it checks                                                                                                 |
| ------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Pagination window  | `lib/utils/pagination.test.ts`                     | Page list for edge cases                                                                                       |
| Trailer picking    | `lib/utils/videos.test.ts`                         | Prefers a YouTube `Trailer`, falls back to any YouTube video, ignores other sites                              |
| Runtime formatting | `lib/utils/format.test.ts`                         | Minutes to `1h 6m` style text                                                                                  |
| Schemas            | `lib/schemas.test.ts`                              | Lenient URL params fall back to defaults, strict request rules reject bad input, response shapes are validated |
| Debounce           | `hooks/useDebounce.test.ts`                        | Value updates only after the delay, and the delay restarts on each change                                      |
| `Pagination`       | `components/Shared/Pagination/Pagination.test.tsx` | Current page, Previous and Next links, the 500-page ceiling, hidden when there is nothing to page              |
| `SearchBar`        | `components/SearchBar/SearchBar.test.tsx`          | Disabled while empty, debounced `replace`, immediate `push` on submit, sync on Back and Forward                |
| `SearchResults`    | `components/SearchResults/SearchResults.test.tsx`  | Results with pagination, the empty state                                                                       |
| `Trailer`          | `components/Trailer/Trailer.test.tsx`              | Embeds the YouTube video, renders nothing when no video qualifies                                              |
| `MovieCard`        | `components/MovieCard/MovieCard.test.tsx`          | Title, rating and year, link to the detail page                                                                |

## How the tests work

- **The data layer is mocked.** `vi.mock("~/lib/api", ...)` replaces `lib/api.ts`, which also avoids its `server-only` import.
- **`next/navigation` is mocked** in `SearchBar` tests. They check what the router receives, not how the component works inside.
- **Timers are faked** (`vi.useFakeTimers`) for debounce behavior.

## What is not covered

- **The error boundaries** (`SearchResultsBoundary`, `TrailerBoundary`) and their fallbacks.
- **The mock API route handlers**, and the fixture JSON files.
- **End to end:** There are no browser tests. I checked search, pagination and the detail page manually against the mock's trigger values (see [Mock API](mock-api.md)).
