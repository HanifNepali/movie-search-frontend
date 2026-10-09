import { useEffect, useState } from "react";

/**
 * Returns `value` after it has stopped changing for `delay`ed ms.
 *
 * Note: React's `useDeferredValue()` could be used instead. It defers
 * re-rendering rather than waiting a fixed time, so it keeps the UI
 * responsive, but it does not reduce the number of network requests on its
 * own.
 *
 * A timed debounce provides more control over when the value is updated,
 * which is why it's used here.
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}
