import { describe, expect, it } from "vitest";

import { getPageItems } from "./pagination";

describe("getPageItems", () => {
  it("returns nothing when there are no pages", () => {
    expect(getPageItems(1, 0)).toEqual([]);
  });

  it("returns a single page", () => {
    expect(getPageItems(1, 1)).toEqual([1]);
  });

  it("shows every page when they all fit in the window", () => {
    expect(getPageItems(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("collapses a long gap into an ellipsis", () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, "ellipsis", 5]);
  });

  it("keeps first, last and the current page's neighbours", () => {
    expect(getPageItems(10, 20)).toEqual([
      1,
      "ellipsis",
      9,
      10,
      11,
      "ellipsis",
      20,
    ]);
  });

  it("shows the page number instead of an ellipsis that would hide one page", () => {
    expect(getPageItems(4, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
  });

  it("handles the last page", () => {
    expect(getPageItems(500, 500)).toEqual([1, "ellipsis", 499, 500]);
  });

  it("handles a current page past the end without inventing pages", () => {
    expect(getPageItems(10, 3)).toEqual([1, 2, 3]);
  });

  it("supports a custom sibling count", () => {
    expect(getPageItems(5, 10, 0)).toEqual([1, "ellipsis", 5, "ellipsis", 10]);
  });
});
