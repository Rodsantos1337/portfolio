import { memo } from "react";

/**
 * A static overlay that applies a subtle film grain effect across the site.
 * Memoized to prevent unnecessary re-renders.
 */
export const GrainOverlay = memo(function GrainOverlay() {
  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none opacity-[0.035]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="grainNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grainNoise)" />
      </svg>
    </div>
  );
});
