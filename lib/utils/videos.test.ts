import { describe, expect, it } from "vitest";

import type { Video } from "~/types/movie";

import { pickTrailer } from "./videos";

function video(overrides: Partial<Video>): Video {
  return {
    key: "abc",
    name: "Video",
    site: "YouTube",
    type: "Trailer",
    ...overrides,
  };
}

describe("pickTrailer", () => {
  it("returns null for no videos", () => {
    expect(pickTrailer([])).toBeNull();
  });

  it("prefers a YouTube video of type Trailer", () => {
    const teaser = video({ key: "teaser", type: "Teaser" });
    const trailer = video({ key: "trailer", type: "Trailer" });

    expect(pickTrailer([teaser, trailer])).toBe(trailer);
  });

  it("ignores sites other than YouTube, even for a Trailer", () => {
    const vimeoTrailer = video({ key: "v", site: "Vimeo", type: "Trailer" });
    const youtubeTeaser = video({ key: "y", type: "Teaser" });

    expect(pickTrailer([vimeoTrailer, youtubeTeaser])).toBe(youtubeTeaser);
  });

  it("falls back to the first YouTube video when there is no Trailer", () => {
    const featurette = video({ key: "first", type: "Featurette" });
    const teaser = video({ key: "second", type: "Teaser" });

    expect(pickTrailer([featurette, teaser])).toBe(featurette);
  });

  it("returns null when nothing is embeddable", () => {
    expect(pickTrailer([video({ site: "Vimeo" })])).toBeNull();
  });
});
