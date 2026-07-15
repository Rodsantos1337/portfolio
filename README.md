# Rodrigo Santos — Portfolio

A high-fidelity interaction design portfolio built with **React 19** inside an **Astro 7** static shell. Every pixel is animated, every scroll is smooth, and the entire UI is driven by a single React root component.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | All UI, state, and interactivity |
| **Astro 7** | Static HTML shell, SEO, routing |
| **TypeScript** | Strict mode, no `any` |
| **GSAP 3.15** | ScrollTrigger parallax, SplitText line-mask reveals, timeline orchestration |
| **Lenis** | Smooth scroll, synced with GSAP ticker |
| **Tailwind CSS v4** | Utility-first styling via `@tailwindcss/vite` |
| **pnpm** | Fast, disk-efficient package manager |

## Architecture

Astro pre-renders the HTML shell and hydrates a single React root (`App.tsx`) via `client:load`. This gives you:

- **Fast initial paint** — static HTML loads immediately, no JS required for first render
- **React-first engineering** — all DOM manipulation, animation, and state lives in React components
- **Clean separation** — Astro handles meta tags, fonts, and routing; React owns the entire `<body>`

The `App.tsx` component receives a `page` prop (`"home"` | `"contact"`) and branches its render tree accordingly. Lenis and all GSAP ScrollTriggers are initialized in a single `useEffect` keyed on `page`, ensuring clean teardown when navigating between routes.

## Features

- **Line-mask reveal** — Text splits into lines via GSAP SplitText, each line slides up from behind an `overflow: hidden` mask wrapper
- **Scroll-synced parallax** — Project card images parallax at different speeds using ScrollTrigger scrub
- **SplitText word/char reveals** — Section headings, project descriptions, and metadata animate with staggered word and character reveals
- **Smooth scroll** — Lenis with custom easing curve, synced to GSAP ticker
- **Reduced motion** — Every animation respects `prefers-reduced-motion: reduce`
- **Fully responsive** — Mobile navigation with GSAP-animated hamburger menu
- **Toast notifications** — Email copy feedback with GSAP entrance/exit animation

## Projects

- **t'works** — Design and product development agency
- **Waymark** — Video creation platform (React components)
- **XetHub** — Collaborative data science platform (Design & React)
- **GBuilder** — No-code platform builder (Interaction Design)

## Getting Started

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # static output → dist/
pnpm preview   # preview production build
```

Node engine: `>=22.12.0`. Uses pnpm with `node-linker=hoisted`.

## Links

- [rodrigosantos.dev](https://rodrigosantos.dev) — live site
- [GitHub](https://github.com/Rodsantos1337)
- [LinkedIn](https://www.linkedin.com/)
