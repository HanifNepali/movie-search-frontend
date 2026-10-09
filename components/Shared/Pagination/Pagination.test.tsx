import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders the pagination with correct links", () => {
    render(
      <Pagination query="the" page={2} totalPages={3} totalResults={27} />,
    );

    expect(
      screen.getByRole("navigation", { name: "Pagination" }),
    ).toBeVisible();
    expect(screen.getByText("2")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Previous page" })).toHaveAttribute(
      "href",
      "/?query=the",
    );
    expect(screen.getByRole("link", { name: "Next page" })).toHaveAttribute(
      "href",
      "/?query=the&page=3",
    );
    expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute(
      "href",
      "/?query=the&page=3",
    );
  });

  it("has no Previous link on the first page", () => {
    render(
      <Pagination query="the" page={1} totalPages={3} totalResults={27} />,
    );

    expect(screen.queryByRole("link", { name: "Previous page" })).toBeNull();
    expect(screen.getByRole("link", { name: "Next page" })).toBeVisible();
  });

  it("has no Next link on the last page", () => {
    render(
      <Pagination query="batman" page={3} totalPages={3} totalResults={41} />,
    );

    expect(screen.queryByRole("link", { name: "Next page" })).toBeNull();
    expect(screen.getByRole("link", { name: "Previous page" })).toBeVisible();
  });

  it("encodes the query in links", () => {
    render(
      <Pagination
        query="spider man & co"
        page={1}
        totalPages={2}
        totalResults={30}
      />,
    );

    expect(screen.getByRole("link", { name: "Next page" })).toHaveAttribute(
      "href",
      "/?query=spider+man+%26+co&page=2",
    );
  });

  it("never links past the 500-page ceiling", () => {
    render(
      <Pagination query="a" page={500} totalPages={900} totalResults={18000} />,
    );

    expect(screen.getByText(/Page 500 of 500/)).toBeVisible();
    expect(screen.queryByRole("link", { name: "Next page" })).toBeNull();
  });

  it("renders nothing when there are no results", () => {
    const { container } = render(
      <Pagination query="a" page={1} totalPages={0} totalResults={0} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for a single page", () => {
    const { container } = render(
      <Pagination query="zzz" page={1} totalPages={1} totalResults={5} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
