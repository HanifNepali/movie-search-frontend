import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SearchBar } from "./SearchBar";

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => router }));

const getInput = () =>
  screen.getByRole("searchbox", { name: "Search for a movie" });

const getButton = () => screen.getByRole("button", { name: "Search" });

function type(value: string) {
  fireEvent.change(getInput(), { target: { value } });
}

describe("SearchBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });
  afterEach(() => vi.useRealTimers());

  it("disables Search while the input is empty or only spaces", () => {
    render(<SearchBar initialQuery="" />);
    expect(getButton()).toHaveAttribute("aria-disabled", "true");

    type("   ");
    expect(getButton()).toHaveAttribute("aria-disabled", "true");

    type("batman");
    expect(getButton()).toHaveAttribute("aria-disabled", "false");
  });

  it("does not navigate when submitting an empty input", () => {
    render(<SearchBar initialQuery="" />);

    fireEvent.submit(screen.getByRole("search"));
    act(() => vi.advanceTimersByTime(400));

    expect(router.push).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("replaces the URL once, after the user stops typing", () => {
    render(<SearchBar initialQuery="" />);

    type("batman");
    act(() => vi.advanceTimersByTime(399));
    expect(router.replace).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith("/?query=batman");
  });

  it("returns to the base route when the input is cleared", () => {
    render(<SearchBar initialQuery="batman" />);

    type("");
    act(() => vi.advanceTimersByTime(400));

    expect(router.replace).toHaveBeenCalledWith("/");
  });

  it("follows the URL on Back and Forward", () => {
    const { rerender } = render(<SearchBar initialQuery="batman" />);

    rerender(<SearchBar initialQuery="alien" />);

    expect(getInput()).toHaveValue("alien");
  });
});
