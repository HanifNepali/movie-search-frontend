# Mock API

The mock uses Next.js route handlers under `app/api/mock/`.

```
app/api/mock/v1/
 _fixtures/
   catalog.json      movies used in search
   trending.json     movies used in trending
   details.json      full details for movies
   videos.json       videos keyed by movie id
 movies/
   trending/route.ts
   search/route.ts
   [id]/route.ts
   [id]/videos/route.ts
```

Rules it follows:

- **The data is fixed JSON.** There's no call to TMDB. The data lives in `_fixtures/`, away from the handlers.
- **Handlers check the request, not their own output.** Search validates `query` and `page` with `searchRequestSchema`, and the id routes validate `id`. Response validation happens in the app, in `lib/api.ts`, because that's where the contract is enforced.

### Trigger values

| Endpoint                  | Request                           | Result                                                           |
| ------------------------- | --------------------------------- | ---------------------------------------------------------------- |
| `GET /movies/trending`    | any                               | 200, 12 movies                                                   |
| `GET /movies/search`      | `query=the`                       | 200, 27 results over 3 pages (12, 12, 3)                         |
|                           | `query=batman`                    | 200, a small result set on one page (matches title and overview) |
|                           | `query=noresults`                 | 200, `totalPages: 0`, `totalResults: 0`, `results: []`           |
|                           | `query=slow`                      | 200 after about 3 seconds, serves the `batman` results           |
|                           | `query=error`                     | 503 `problem+json`                                               |
|                           | missing, empty or blank `query`   | 400 `problem+json`                                               |
|                           | `page=0`, `page=501`, `page=abc`  | 400 `problem+json`                                               |
|                           | `query=batman&page=10`            | 200, `results: []`, `totalPages: 3`                              |
| `GET /movies/{id}`        | `569094`, `155`, `27205` etc      | 200, full details                                                |
|                           | any other id (for example `9999`) | 404 `problem+json`                                               |
|                           | `abc`, `0`                        | 400 `problem+json`                                               |
| `GET /movies/{id}/videos` | ids listed in `videos.json`       | 200, the listed videos                                           |
|                           | any other id                      | 200, `[]`                                                        |
|                           | `abc`, `0`                        | 400 `problem+json`                                               |

Notes on the data:

- **Search is case-insensitive** and matches both the title and the overview. `noresults` isn't a special case. It's just any query that matches nothing. `slow` and `error` are explicit triggers, since the data can't produce those conditions on its own.
- **All trending movies have details and a matching entry in `videos.json`**, so every trending card leads to a complete detail page with a trailer. Some movies might not contain their details or videos.
- **Posters are available** for almost every movie, so most cards show their posters and there is a "No poster" fallback as well incase if a poster is not available.

## Data layer

All network access goes through `lib/api.ts`, which starts with `import "server-only"`. If a client component imports it, the build fails.

```
apiFetch<T>()           generic transport: fetch, check status, parse JSON
getTrendingMovies()     apiFetch + moviesSchema
searchMovies()          apiFetch + searchResponseSchema
getMovieDetails()       apiFetch + movieDetailSchema
getMovieVideos()        apiFetch + videosSchema
```

`apiFetch` is the starter's generic transport and I left it as it was. Each exported function owns its schema: it calls `apiFetch`, runs `safeParse` on the body, and throws a descriptive error if the shape doesn't match the contract.

### Schemas

`lib/schemas.ts` defines each schema against the hand-written interface in `types/movie.ts` (for example `z.ZodType<Movie>`), so the compiler fails if a schema and its interface drift apart.

There are two schemas for search input, on purpose:

| Schema                | Used by        | Behavior                                                                                           |
| --------------------- | -------------- | -------------------------------------------------------------------------------------------------- |
| `searchRequestSchema` | The mock API   | Strict. Rejects a blank `query` and a `page` outside 1 to 500.                                     |
| `searchParamsSchema`  | `app/page.tsx` | Lenient. A bad URL value such as `?page=abc` falls back to a default instead of crashing the page. |

Users can edit the URL by hand, so the page must handle any value, while the contract needs strict validation.
