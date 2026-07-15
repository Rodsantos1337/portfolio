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
    id: "waymark",
    title: "Waymark",
    description:
      "A data-rich annual report landing page for healthcare transformation. Built interactive charts and custom UI layouts to present complex healthcare statistics cleanly.",
    image:
      "/waymark.png",
    imageAlt: "Waymark healthcare data analytics dashboard",
    url: "https://www.waymarkcare.com/medicaid-transformation-report",
    meta: [
      { label: "Role", value: "Interactive Developer" },
      { label: "Stack", value: "Webflow, Custom CSS, JS" },
    ],
  },
  {
    id: "xethub",
    title: "Old XetHub website",
    description:
      "Landing page for a developer-focused ML versioning platform. Built clean, responsive product layouts, interactive feature grids, and custom integrations.",
    image:
      "/xethub.png",
    imageAlt: "XetHub ML versioning platform code interface",
    url: "https://xethub-staging.webflow.io/",
    meta: [
      { label: "Role", value: "Frontend Developer" },
      { label: "Stack", value: "Webflow, Custom Interactions" },
    ],
  },
  {
    id: "gbuilder",
    title: "GBuilder",
    description:
      "SaaS marketing website for a real estate BIM platform. Engineered custom scroll-triggered animations and responsive layout structures to showcase complex technical tools.",
    image:
      "/gbuilder.png",
    imageAlt: "GBuilder modern architecture BIM platform",
    url: "https://www.gbuilder.com/",
    meta: [
      { label: "Role", value: "Frontend Developer" },
      { label: "Stack", value: "Webflow, GSAP, JavaScript" },
    ],
  },
];
