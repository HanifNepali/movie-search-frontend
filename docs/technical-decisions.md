# Technical decisions

This doc covers what was prioritized, what was skipped, and why the main technical choices were made. For how the pieces fit together, see [Architecture](architecture.md).

## What was prioritized and what was skipped

The assignment splits tasks into tiers, P0 to P3. I worked through them in order and finished each tier before starting the next.

| Tier | Task                                               | Status                                                        |
| ---- | -------------------------------------------------- | ------------------------------------------------------------- |
| P0   | Mock API that follows the contract                 | Done, including every trigger case                            |
| P0   | Search wired to `GET /movies/search`               | Done                                                          |
| P0   | Pagination driven by the response                  | Done                                                          |
| P1   | Loading, empty and error states for search         | Done                                                          |
| P1   | Accessibility: labels, keyboard use, visible focus | Done at a basic level (see [Accessibility](accessibility.md)) |
| P2   | Movie detail page                                  | Done                                                          |
| P2   | YouTube trailer from the videos endpoint           | Done                                                          |
| P2   | Detail and videos endpoints in the mock            | Done                                                          |
| P3   | Debouncing on search                               | Done                                                          |
| P3   | Revalidation or caching of search                  | Skipped                                                       |
| P3   | TV and series search                               | Skipped                                                       |

### Skipped tasks

- **TV and series search.** It needs new endpoints, a new contract and new UI, so it would need some more time.
- **Caching and revalidation.** Every request uses `cache: "no-store"`. The caching and revalidation would need a policy (how stale are results allowed to be?) to be configured. Debouncing was done because it directly reduces request volume.

## Decisions

### Showing "Trending Movies" when the query is empty

The home page needs something useful to show by default. When the query is empty, the page fetches and shows trending movies. When there is a query, it doesn't fetch trending at all, so there's no wasted request. On clearing the search box, you go back to the same trending view.

### Pagination

I lowered the number of movies per page from 20 to 12. That gives a smaller sample of the catalog to search through, and it means less scrolling to reach the pagination controls.

### Search state lives in the URL

`SearchBar` writes `?query=` to the URL and the server reads it. Results are never kept in client state.

- **For:** searches and pages can be shared and bookmarked, Back and Forward work, a refresh keeps your place, and pagination can be plain `<Link>`s that work without JavaScript.
- **Against:** every search is a server render. The debounce and `useTransition` are there to keep that cheap and keep typing smooth.

### `replace` while typing, `push` on submit

While you type, the URL updates with `router.replace`, so a burst of keystrokes doesn't fill up your history. When you press Enter or click Search, it uses `router.push`. That way a deliberate search adds a history entry and Back takes you to the previous one.

### A custom debounce hook instead of `useDeferredValue`

`useDebounce` is a small hook with a fixed 400 ms delay. React's `useDeferredValue` could replace it, since it also lowers the priority of a re-render. The difference is that a timed debounce **cuts the number of requests**, while `useDeferredValue` only delays rendering and would still send a request on every keystroke. Since the goal here is fewer server renders, the timer was the better fit. There's a related comment in the hook.

### Data validation with Zod at the app boundary

Every response gets parsed with Zod before it reaches a component.

- **Responses are `unknown` until proven otherwise.** Each exported function in `lib/api.ts` runs `safeParse` against its schema and throws a descriptive error if it doesn't match. If the real .NET API drifts from the contract, the failure names the field, instead of `undefined` appearing inside a component.
- **Two search-param schemas.** The strict one models the contract (the mock's `400` errors). A lenient one is used for user-editable URLs, so `?page=abc` shows page 1 and doesn't crash.

### Composition for the empty state

`EmptyState` is a compound component (`EmptyState.Title`, `EmptyState.Message`). The component handles layout and styling, and the caller supplies the content. It stays a server component.

### Only the trailer from YouTube is embedded

The contract says the frontend should only use videos where `site` is `"YouTube"`, because the embed URL only works with YouTube keys. The picker prefers a video of type `Trailer`, falls back to the first YouTube video, and shows nothing if neither exists.

## Known limitations

- **TV and series search** isn't implemented (P3).
- **No caching or revalidation** (P3). Every request is `no-store`.
- **`MAX_PAGE` is a hardcoded constant** that mirrors the contract. It isn't derived from the data.
