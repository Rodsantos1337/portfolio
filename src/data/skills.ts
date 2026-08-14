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
  "Webflow",
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "GSAP",
  "Accessibility",
  "Vitest",
] as const;

/** Bottom marquee band — working philosophy and values. */
export const bottomMarqueeItems = [
  "Design Systems",
  "Figma to Code",
  "Component Architecture",
  "Performance Tuning",
  "Semantic HTML Structure",
  "Clean, Maintainable Code",
] as const;
