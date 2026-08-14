/** Centralized site-wide configuration and personal information. */
export const siteConfig = {
  name: "Rodrigo Santos",
  title: "Frontend Developer · Design-to-Code · Webflow, React & TypeScript",
  tagline:
    "Turning Figma designs into accessible, production-ready code across Webflow, React, and TypeScript.",
  email: "rod.santos122@gmail.com",
  location: "Sintra, Portugal",
} as const;

/** External profile and social links. */
export const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/rodrigo-santos122" },
  { label: "Upwork", href: "https://www.upwork.com/freelancers/~01b802e94f9ecf3654" },
  { label: "GitHub", href: "https://github.com/Rodsantos1337" },
] as const;

/** Primary navigation items — used by both desktop and mobile navigation. */
export const navItems = [] as const;

/** Stable lowercase IDs for navigation tracking. */
export const navIds = navItems.map((item) => item.toLowerCase());

