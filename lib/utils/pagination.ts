import type { PageItem } from "~/types/pagination";

/**
 * Returns the page numbers to render: first, last, and the current page with
 * `siblings` neighbors on each side. Gaps become an ellipsis, except a gap of
 * a single page, which is shown as the number (an ellipsis would hide nothing).
 *
 * Example 1: getPageItems(10, 20) -> [1, "ellipsis", 9, 10, 11, "ellipsis", 20]
 */
export function getPageItems(
  current: number,
  total: number,
  siblings = 1,
): PageItem[] {
  // 1. Guard clause: No pages at all, so there is nothing to render.
  if (total <= 0) return [];

  // 2. Always include the first and last pages as anchors.
  // Using a Set prevents duplicate page numbers.
  const pages = new Set([1, total]);

  // 3. Collect page numbers directly surrounding the current active page.
  for (let p = current - siblings; p <= current + siblings; p++) {
    // Only include pages that fall within the valid 1-to-total range.
    if (p >= 1 && p <= total) pages.add(p);
  }

  // 4. Sort the unique pages chronologically for sequential rendering.
  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];

  // 5. Build the final array, filling in gaps with page numbers or an ellipsis.
  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];

    // Check the gap between this page and the previous one if it exists.
    if (previous !== undefined) {
      // Case A: Exactly one page is missing (e.g., [1, 3] -> adds 2).
      if (page - previous === 2) items.push(previous + 1);

      // Case B: Multiple pages are missing (e.g., [1, 5] -> adds "ellipsis").
      else if (page - previous > 2) items.push("ellipsis");
    }
    // Always add the current page number itself.
    items.push(page);
  });

  return items;
}
