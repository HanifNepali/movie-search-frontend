import { describe, expect, it } from "vitest";

import { formatRuntime } from "./format";

describe("formatRuntime", () => {
  it.each([
    [0, "0m"],
    [45, "45m"],
    [60, "1h"],
    [120, "2h"],
    [126, "2h 6m"],
  ])("formats %i minutes as %s", (minutes, expected) => {
    expect(formatRuntime(minutes)).toBe(expected);
  });
});
