import { useState, useEffect } from "react";

/**
 * Evaluates a CSS media query and returns whether it currently matches.
 * Returns `false` during SSR to avoid hydration mismatches.
 *
 * @param query - A valid CSS media query string (e.g. `"(min-width: 768px)"`).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
