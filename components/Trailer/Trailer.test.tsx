import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMovieVideos } from "~/lib/api";

import Trailer from "./Trailer";

vi.mock("~/lib/api", () => ({ getMovieVideos: vi.fn() }));

describe("Trailer", () => {
  beforeEach(() => vi.clearAllMocks());

  it("embeds the YouTube trailer with an accessible title", async () => {
    vi.mocked(getMovieVideos).mockResolvedValue([
      {
        key: "bLvqoHBptjg",
        name: "Official Trailer",
        site: "YouTube",
        type: "Trailer",
      },
    ]);

    render(await Trailer({ movieId: 1, title: "The Lord of the Rings" }));

    expect(
      screen.getByTitle("The Lord of the Rings: Official Trailer"),
    ).toHaveAttribute("src", "https://www.youtube.com/embed/bLvqoHBptjg");
  });

  it("renders nothing when no video site is non YouTube", async () => {
    vi.mocked(getMovieVideos).mockResolvedValue([
      {
        key: "76979871",
        name: "Official Trailer",
        site: "Vimeo",
        type: "Trailer",
      },
    ]);

    const { container } = render(
      await Trailer({ movieId: 1, title: "The Lord of the Rings" }),
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when the movie has no videos", async () => {
    vi.mocked(getMovieVideos).mockResolvedValue([]);

    const { container } = render(
      await Trailer({ movieId: 1, title: "The Lord of the Rings" }),
    );

    expect(container).toBeEmptyDOMElement();
  });
});
