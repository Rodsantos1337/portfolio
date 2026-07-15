/**
 * Marquee content — two ticker bands.
 *
 * Top band: craft + tools Rodrigo actively works with.
 * Bottom band: the working philosophy and process values behind the work.
 *
 * Framing: honest about the toolset (Webflow, GSAP, React, Astro, TypeScript)
 * without overclaiming seniority or a role pivot. The language stays in the
 * territory of "what I build" rather than "what I am".
 */

/** Top marquee band — tools and craft areas. */
export const topMarqueeItems = [
  "Webflow Development",
  "Custom JavaScript",
  "React",
  "TypeScript",
  "GSAP Animation",
  "Astro CMS",
  "Component Architecture",
  "Responsive Design",
] as const;

/** Bottom marquee band — working philosophy and values. */
export const bottomMarqueeItems = [
  "Finsweet Client-First",
  "Scroll-Synced Interactions",
  "Semantic HTML Structure",
  "Performance Optimization",
  "Pixel-Precise Layouts",
  "Clean, Maintainable Code",
] as const;
