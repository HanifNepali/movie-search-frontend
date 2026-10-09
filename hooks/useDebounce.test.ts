import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns the initial value immediately", () => {
    // initializes the hook in a simulated testing environment
    // with an initial value of "a" and a debounce delay of 400ms
    const { result } = renderHook(() => useDebounce("a", 400));

    expect(result.current).toBe("a");
  });

  it("updates only after the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: "a" } },
    );

    // Change the value to "ab" and rerender the hook
    rerender({ value: "ab" });

    // Skip forward in time by 400ms to simulate the debounce delay
    act(() => {
      vi.advanceTimersByTime(400);
    });

    // Expects the result to match the new value "ab" after the delay
    expect(result.current).toBe("ab");
  });

  it("restarts the delay on every change", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: "a" } },
    );

    // Change the value to "b", rerender the hook and advance time by 300ms
    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(300));

    // Change the value to "c", rerender the hook and advance time by 200ms
    // The value should still be "a"
    // because the debounce delay has not completed from the first pass
    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("a");

    // Advance time by 200ms more to complete the debounce delay
    // The value should now be "c" because the debounce delay has completed
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("c");
  });
});
