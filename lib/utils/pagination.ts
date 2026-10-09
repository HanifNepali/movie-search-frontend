import type { PageItem } from "~/types/pagination";

/**
 * Returns the page numbers to render: first, last, and the current page with
 * `siblings` neighbors on each side. Gaps become an ellipsis, except a gap of
 * a single page, which is shown as the number (an ellipsis would hide nothing).
 *
 * Example: getPageItems(10, 20) -> [1, "ellipsis", 9, 10, 11, "ellipsis", 20]
 */
export function getPageItems(
  current: number,
  total: number,
  siblings = 1,
): PageItem[] {
  if (total <= 0) return [];

  const pages = new Set([1, total]);
  for (let p = current - siblings; p <= current + siblings; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined) {
      if (page - previous === 2) items.push(previous + 1);
      else if (page - previous > 2) items.push("ellipsis");
    }
    items.push(page);
  });

  return items;
}
