export interface ProjectMeta {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  url: string;
  meta: ProjectMeta[];
}

export const projects: Project[] = [
  {
    id: "tworks",
    title: "t'works",
    description:
      "Global language services corporate site. Implemented a robust multi-language CMS architecture and structured a comprehensive, easily searchable service catalog.",
    image:
      "/tworks.png",
    imageAlt: "t'works global language services network",
    url: "https://www.t-works.eu/",
    meta: [
      { label: "Role", value: "Lead Developer" },
      { label: "Stack", value: "Webflow, CMS, Multi-language" },
    ],
  },
  {
    id: "comparador",
    title: "Comparador",
    description:
      "Next.js and TypeScript app comparing real-time grocery prices across retailers, with Vitest-tested parsers, debounced search, autocomplete, and a dark responsive UI.",
    image:
      "/comparador.png",
    imageAlt: "Comparador grocery price comparison app",
    url: "https://comparador-fawn.vercel.app/",
    meta: [
      { label: "Role", value: "Developer" },
      { label: "Stack", value: "Next.js, TypeScript, Vitest" },
    ],
  },
  {
    id: "book-buddy",
    title: "BookBuddy",
    description:
      "React and TypeScript full-stack app using LLM tool calling against the Google Books API for conversational discovery. Hono backend on Cloudflare Workers, tested with Vitest.",
    image:
      "/book-buddy.png",
    imageAlt: "BookBuddy book discovery app",
    url: "https://book-buddy.rod-santos122.workers.dev/",
    meta: [
      { label: "Role", value: "Developer" },
      { label: "Stack", value: "React, TypeScript, Google Books API, Hono" },
    ],
  },
];
