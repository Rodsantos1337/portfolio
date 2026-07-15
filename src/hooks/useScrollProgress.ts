import { useState, useEffect } from "react";

/**
 * Tracks the vertical scroll progress of the page.
 * @returns A number between 0 and 100 representing the scroll percentage.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      setProgress((window.scrollY / totalHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}
