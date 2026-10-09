# Accessibility

Native and semantic elements are used wherever possible (`<a>`, `<button>`, `<input>`, `<form>`, `<nav>`, `<ul>`, `<section>`), so most behavior comes from the element itself

## Structure and landmarks

- Every route has one `<main>`, and the heading order is `h1`, then `h2`, then card titles as `h3`.
- The search form has `role="search"`.
- Pagination is a `<nav aria-label="Pagination">` containing a list.
- Movie grids are lists of cards with role of a `list`.

## Search

- The input has a label (`Search for a movie`), visually hidden but available to assistive technology. Its type is `search`.
- A hidden hint ("Results update as you type. Press Enter to search immediately.") is linked to the input with `aria-describedby`, since results change without a submit.
- `autoComplete="off"` prevents the browser's suggestion list from covering the results.
- A `role="status"` region announces "Searching…" while a navigation is pending.
- Enter submits the form with the input value, and the button works with Enter and Space.

## Pagination

- Page controls are real links, so they work with the keyboard, middle-click and "open in new tab".
- The current page is marked with `aria-current="page"`.
- Links have descriptive names (`Page 3`, `Previous page`, `Next page`) and use `rel="prev"` and `rel="next"`.
- Ellipses are decorative and hidden from assistive technology.

## Movie cards and detail page

- Each card has a single link (the title) that is stretched over the whole card. The poster is clickable, but keyboard and screen reader users get one stop per card.
- The rating has a text alternative: `Rated 8.1 out of 10`.
- The detail page poster has alt text, and the decorative backdrop has an empty `alt`.
- The trailer `<iframe>` has a `title` naming the movie and the video.

## Focus

- Links and buttons show a visible outline when focused by keyboard (`focus-visible`).
- A card shows its focus ring around the whole card, not only the title text.
- The search input shows a border colour change when focused.

## Errors

- The search results and trailer error messages use `role="alert"`, so they are announced when they appear.

## Animation

- Using `motion-safe:animate-pulse` ensures the animation only plays if the user hasn't enabled prefers-reduced-motion
