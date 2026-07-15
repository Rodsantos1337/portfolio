import { cn } from "../../../lib/utils";

interface MarqueeProps {
  items: readonly string[];
  reverse?: boolean;
  /** Delay (in seconds) before the mount fade-in starts. Read by App.tsx. */
  mountDelay?: number;
}

/**
 * Seamless infinite ticker.
 *
 * Uses GSAP for fade-in on mount (handled in App.tsx).
 * The CSS marquee animation handles continuous scrolling.
 */
export default function Marquee({ items, reverse = false, mountDelay = 0 }: MarqueeProps) {
  const animClass = reverse ? "animate-marquee-reverse" : "animate-marquee";

  return (
    <div
      className="w-full bg-bgSurface/40 py-5 border-y border-bgBorder overflow-hidden relative z-20 select-none marquee-fade"
      data-marquee-delay={mountDelay}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
      }}
    >
      <div
        className={cn(
          "flex items-center whitespace-nowrap w-max",
          "font-clash uppercase font-semibold text-xs tracking-wider text-brandTextMuted/50",
          animClass
        )}
      >
        {/* First copy */}
        {items.map((item, idx) => (
          <span
            key={`a-${idx}`}
            className="pr-12 shrink-0"
          >
            {item}
          </span>
        ))}

        {/* Duplicate — aria-hidden so screen readers skip the repetition */}
        {items.map((item, idx) => (
          <span
            key={`b-${idx}`}
            className="pr-12 shrink-0"
            aria-hidden="true"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
