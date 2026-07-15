/** Centralized site-wide configuration and personal information. */
export const siteConfig = {
  name: "Rodrigo Santos",
  title: "Frontend & Webflow Developer",
  tagline:
    "Designing and engineering high-fidelity Webflow websites with clean custom code, smooth interactions, and absolute precision.",
  email: "rod.santos122@gmail.com",
  location: "Sintra, Portugal",
} as const;

/** External profile and social links. */
export const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Upwork", href: "https://www.upwork.com/" },
  { label: "GitHub", href: "https://github.com/Rodsantos1337" },
] as const;

/** Primary navigation items — used by both desktop and mobile navigation. */
export const navItems = [] as const;

/** Stable lowercase IDs for navigation tracking. */
export const navIds = navItems.map((item) => item.toLowerCase());

