# Project-Specific Agent Rules & Guidelines

A personal portfolio site for **Rodrigo Santos** (Interaction Designer & Developer, based in Sintra, Portugal). Built with **Astro** as a static shell and a single **React 19** root that owns the entire DOM tree.

---

## Development

Node engine: `>=22.12.0`. Package manager: **pnpm** (with `node-linker=hoisted`).

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Available scripts (from `package.json`):

| Script           | Purpose                       |
| ---------------- | ----------------------------- |
| `pnpm dev`       | Start local dev server        |
| `pnpm build`     | Build production to `./dist/` |
| `pnpm preview`   | Preview production build      |
| `pnpm astro ...` | Astro CLI passthrough         |

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

---

## Tech Stack & Versions (from `package.json`)

- **Astro 7** (`^7.0.9`) — static meta-framework, HTML pre-rendering, page entrypoints.
- **@astrojs/react 6** (`^6.0.1`) — React integration.
- **React 19** (`^19.2.7`) — owns the entire UI inside `App.tsx`. Hydrated via `client:load`.
- **Tailwind CSS v4** (`^4.3.2`) via `@tailwindcss/vite`. Theme tokens declared in the `@theme` block inside `src/styles/globals.css` (NOT a `tailwind.config.js`).
- **GSAP 3.15** (`^3.15.0`) — character/word/line timeline animations and scroll-synced ticker. Plugins used: `ScrollTrigger`, `SplitText`.
- **Lenis 1.3.25** (`^1.3.25`) — smooth scroll, integrated at the React root in `App.tsx` and synced with `gsap.ticker`.
- **clsx** (`^2.1.1`) + **tailwind-merge** (`^3.6.0`) — merged via the `cn()` helper in `src/lib/utils.ts`.
- **No Framer Motion** — despite mentions in some prior docs, animation is handled by GSAP only.

> Note: the package list in `AGENTS.md` previously mentioned "Framer Motion" but the codebase no longer uses it. All motion work is GSAP.

## TypeScript & Path Aliases

- Extends `astro/tsconfigs/strict` (`tsconfig.json`).
- Path alias: `@/*` → `src/*`. Use this in `import` paths when convenient.
- Strict mode is on — explicit types are required; **no `any`**.

## Astro Config (`astro.config.mjs`)

```js
integrations: [react()],
vite: { plugins: [tailwindcss()] },
```

No SSR adapter is configured — the site is fully static.

---

## Codebase Architecture (React-First Approach)

This portfolio uses Astro as a static meta-framework, but delegates all UI presentation and interactivity to a single React application root. This approach optimizes for search engine visibility, initial page load speed, and clean React-based component engineering suitable for showcasing React skills to recruiters.

### Top-Level Structure

```
/
├── public/                  Static assets served as-is
│   ├── favicon.svg / .ico
│   ├── hero-bg.mp4          Background video used in Hero + About/Footer
│   ├── rodrigo-santos.jpeg  Avatar (used in Hero "O" letter, About card)
│   ├── gbuilder.png
│   ├── tworks.png
│   ├── waymark.png
│   └── xethub.png           Project preview thumbnails
├── src/
│   ├── components/react/
│   │   ├── App.tsx              Root React component (rendered by Layout.astro)
│   │   ├── layout/              Global layout features
│   │   ├── sections/            Full page sections
│   │   └── ui/                  Reusable primitive components
│   ├── data/                    Centralized site content (site, projects, skills)
│   ├── hooks/                   Reusable React hooks
│   ├── layouts/Layout.astro     Astro shell — sets <html>, fonts, SEO, hydrates App
│   ├── lib/utils.ts             cn() helper (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── index.astro          Renders <Layout page="home" />
│   │   └── contact.astro        Renders <Layout page="contact" title="..." />
│   └── styles/globals.css       Tailwind v4 entry, @theme tokens, base styles
├── scripts/extract-copy.py      One-off helper script (not part of build)
├── skills/                      Local skill manifests
├── .kilo/plans/                 Internal planning notes
├── .vscode/                     Editor recommendations (astro extension)
├── astro.config.mjs
├── tsconfig.json
├── pnpm-workspace.yaml          onlyReleaseAgeExclude for esbuild/sharp
└── package.json
```

### `src/components/react/`

- **`App.tsx`** — Root component. Owns the Lenis instance, GSAP ticker, and all `.reveal` / `.reveal-fade` / `.marquee-fade` / `.parallax-img-container` initializations via a single `useEffect` (depends on `page`). Branches its render tree on the `page` prop (`"home"` vs `"contact"`). Also wires the toast state, the email-copy handler, and the Lenis-powered `handleScrollTo` helper.
- **`layout/`** — global, always-on features:
  - `Navigation.tsx` — fixed top nav, hamburger menu on mobile (with GSAP-animated lines), desktop GitHub + "Let's Connect" buttons, active-section underline via `useActiveSection`.
  - `Footer.tsx` — bottom CTA + email-copy button + social links + back-to-top link. Used on both `home` and `contact` pages.
  - `ScrollProgress.tsx` — fixed 2px green bar at the very top, scaled by `useScrollProgress`.
  - `GrainOverlay.tsx` — fixed full-screen SVG `feTurbulence` noise at `opacity-[0.035]`. Memoized.
  - `Toast.tsx` — bottom-center toast for "email copied" feedback. GSAP-animated in/out, `prefers-reduced-motion` aware.
- **`sections/`** — full page sections:
  - `Hero.tsx` — name title ("RODRIGO" / "SANTOS") with per-character GSAP slide-up. The final "O" of RODRIGO is a circular image of the avatar. Below: a single `<RevealText>` subtitle.
  - `Marquee.tsx` — two duplicated copies of an items array inside a flex row; CSS keyframe (`animate-marquee` / `animate-marquee-reverse`) provides the seamless ticker. Has a left/right mask-image fade.
  - `Work.tsx` — `<SectionLabel>` + heading + `projects.map(ProjectCard)`. Alternates `reverse` per odd index.
  - `About.tsx` — sticky left "info card" (avatar with hover-to-initials animation, dl/dt/dd rows) and a right column of three `<RevealText>` paragraphs that support `**bold**` markdown.
  - `Contact.tsx` — full-page contact section with an email copy button and a list of social profile buttons.
- **`ui/`** — reusable primitives:
  - `Button.tsx` — polymorphic (`href` → `<a>`, otherwise `<button>`) with `variant: "primary" | "secondary" | "light"` and optional `slide` (slide-up green fill on hover, primary only).
  - `RevealText.tsx` — wraps text in a `SplitText`-driven word/char/line mask reveal. Supports `as` (tag), `mode` ("char" | "word" | "line"), `stagger`, `delay`, `duration`. Sets `overflow: hidden` on the container.
  - `ProjectCard.tsx` — image + meta layout. Uses `.reveal-fade` for entrance, `.parallax-img-container` / `.parallax-img` for the GSAP scrubbed parallax, and a line-mask "Explore Project" button that slides up on group hover.
  - `SectionLabel.tsx` — small green uppercase label that wraps its children in `<RevealText mode="word">`.
  - `LazyVideo.tsx` — `<video>` with `IntersectionObserver` play/pause (1% threshold). `preload="none"`, `muted`, `loop`, `playsInline`.

### `src/data/`

- **`site.ts`** — exports `siteConfig` (name, title, tagline, email, location), `socialLinks[]` (LinkedIn, Upwork, GitHub), `navItems` (currently just `["Work"]`), and `navIds` (lowercased ids used by `useActiveSection`).
- **`projects.ts`** — exports `Project` and `ProjectMeta` interfaces, then a `projects: Project[]` array (4 entries: t'works, Waymark, Old XetHub, GBuilder). Each has `id`, `title`, `description`, `image`, `imageAlt`, `url`, `meta[]` (label/value pairs).
- **`skills.ts`** — exports `topMarqueeItems` (tools/craft: Interaction Design, React, TypeScript, Webflow, GSAP Animation, Astro, Component Architecture, Motion Design) and `bottomMarqueeItems` (philosophy: Detail-Driven Interfaces, Scroll-Synced Animations, Semantic HTML Structure, Performance-First Mindset, Pixel-Precise Layouts, Clean Component Design).

### `src/hooks/`

- **`useScrollProgress.ts`** — returns a 0–100 number based on `window.scrollY` / (document height − viewport height). Passive scroll listener.
- **`useActiveSection.ts`** — `IntersectionObserver` with `rootMargin: "-40% 0px -55% 0px"` that returns the id of whichever observed section is currently intersecting.
- **`useCopyToClipboard.ts`** — `useCopyToClipboard(resetDelay = 3000): [copy, copied]`. Uses `navigator.clipboard.writeText` with a `document.execCommand("copy")` textarea fallback. Auto-resets `copied` after the delay.
- **`useMediaQuery.ts`** — returns `false` during SSR (avoids hydration mismatches), then matches the query and subscribes to changes.

### `src/lib/utils.ts`

```ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

### `src/styles/globals.css`

- `@import "tailwindcss";`
- `@custom-variant dark (&:where(.dark, .dark *));` — enables the `.dark` variant even though the app is single-theme.
- `@theme` block — defines color tokens (`--color-bgDark`, `--color-bgSurface`, `--color-bgBorder`, `--color-brandGreen`, `--color-brandMuted`, `--color-brandText`, `--color-brandTextMuted`), font tokens (`--font-clash`, `--font-sans`), and animation tokens (`--animate-marquee`, `--animate-marquee-reverse`, `--animate-ping-slow`, `--animate-accordion-down/up`).
- `@theme inline` block — secondary shadcn-style tokens mapped through CSS vars for the default and `.dark` schemes.
- Keyframes (`marqueeScroll`, `accordion-down`, `accordion-up`) are defined inside `@theme`.
- `:root` declares `--marquee-h: 56px` (used by `Hero` to size itself so the first marquee is visible above the fold).
- Base layer: `*` gets `border-border outline-outline/50`; `body` gets `bg-background text-foreground`; `button` gets `cursor-pointer`.
- Class utilities used throughout the app:
  - `.hero-char`, `.hero-char-filled` — per-character hover lift + green color transition (defined in CSS, not Tailwind).
  - `.reveal` (initial `opacity: 0`, animated by GSAP in `App.tsx`).
  - `.reveal-fade` (same idea, opacity-only — used by `ProjectCard`).
  - `.reveal-word`, `.reveal-char`, `.reveal-word-mask`, `.reveal-char-mask` — classes assigned by `SplitText` inside `RevealText`.
  - `.marquee-fade` — initial `opacity: 0`, faded in by GSAP in `App.tsx`.
  - `.parallax-img-container`, `.parallax-img` — picked up by the GSAP parallax in `App.tsx`. The image's `--parallax-scale` custom property is read to derive the start scale.
  - `.custom-radius-max` — `border-radius: 14px !important;` (used on info cards, project image wrappers, etc.).

---

## Design System & Theme Tokens

Do NOT use hardcoded colors. Always use the theme design tokens defined in the theme CSS variables:

| Token                   | Tailwind class             | Hex        |
| ----------------------- | -------------------------- | ---------- |
| Background              | `bg-bgDark`                | `#0E1112`  |
| Surface                 | `bg-bgSurface`             | `#161A1C`  |
| Border                  | `border-bgBorder`          | `#23292C`  |
| Brand Highlight         | `text-brandGreen`          | `#A7C080`  |
| Brand Muted             | `text-brandMuted`          | `#7D8C83`  |
| Brand Text              | `text-brandText`           | `#E6E9E7`  |
| Brand Text Muted        | `text-brandTextMuted`      | `#96A39B`  |

The only legitimate places to use raw hex values are:

- Inside `globals.css` itself (theme keyframes, `.hero-char` hover, selection color).
- Inside `Layout.astro` (body background gradient + selection color) — these mirror the tokens.

## Typography

Fonts are loaded from Fontshare in `Layout.astro`:

- **Clash Display** (`--font-clash`) — used for headings, hero characters, marquee text, big CTAs.
- **General Sans** (`--font-sans`) — used as the body default (and `font-sans` Tailwind utility).

Mono font is the browser default (`font-mono`) — used for small labels and the email address.

## Naming & Style Conventions

1. **TypeScript First**: Explicit types or interfaces for all component props. No `any` types. (One `@ts-ignore` exists in `ProjectCard.tsx` for a CSS custom property on an `<img>` — that pattern is acceptable for inline `--parallax-scale`.)
2. **Component Structure**: PascalCase for all components and directories (e.g. `ProjectCard.tsx`).
3. **Hooks**: prefix custom hooks with `use` (e.g., `useScrollProgress.ts`).
4. **Data Isolation**: Static strings (descriptions, bios, links, nav items) must live in `src/data/` rather than being hardcoded in components.
5. **No inline styles** for static values. Use Tailwind classes. Inline `style` is acceptable only for:
   - Dynamic transforms driven by React state (mouse-glow position, `transform: scaleX(...)` on the scroll bar).
   - Web-specific properties not expressible in Tailwind (`maskImage` in `Marquee.tsx`).
   - CSS custom properties consumed by GSAP (`--parallax-scale` on `.parallax-img`).
6. **Page Routing**: Pages (`index.astro`, `contact.astro`) are minimal wrapper entrypoints that load `Layout.astro` with the corresponding `page="home" | "contact"` prop. The layout hydrates a single root `App` component (`App.tsx`) on the client. The branching of what to render happens inside `App.tsx`, not at the page level.
7. **Word Masking Reveal**: Use the `<RevealText>` component for slide-up reveal animations on paragraph elements and headings. `RevealText` supports inline bold text styling via simple double-asterisk markdown syntax in the text source (e.g. `**text**`); the current consumers pass plain strings and rely on the wrapping element for any emphasis.
8. **Initial State (FOUC)**: All revealable components must be assigned the `.reveal` class. The `.reveal` class initiates elements as `opacity: 0` in `globals.css` to prevent flash of unstyled content (FOUC) before GSAP initializes. Use `.reveal-fade` when only opacity (no Y translate) is desired (e.g. `ProjectCard`).
9. **Reduced motion**: Every component that animates with GSAP checks `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and short-circuits to `gsap.set(..., { opacity: 1, y: 0 })` when reduced motion is requested. Mirror that pattern when adding new motion.
10. **`cn()` for class composition**: Always compose Tailwind classes with `cn()` from `src/lib/utils.ts` so duplicates are merged cleanly.

---

## Motion & Scroll System

- **Lenis** is constructed in `App.tsx` and `lenisRef.current` is used for `lenis.scrollTo(href, { offset: -100 })`. Its `raf` callback is wired to `gsap.ticker.add`; `gsap.ticker.lagSmoothing(0)` is set globally. On unmount, `lenis.destroy()`, the ticker callback is removed, and every `ScrollTrigger` is killed.
- **GSAP registrations** happen once at module top of `App.tsx`: `gsap.registerPlugin(ScrollTrigger, SplitText)`.
- **Per-page teardown**: the `useEffect` in `App.tsx` depends on `page` so navigating between `/` and `/contact` re-creates Lenis and re-binds ScrollTriggers.
- **`.reveal`**: `gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" } })`.
- **`.reveal-fade`**: same idea but opacity-only, `duration: 0.8`, `start: "top 90%"`.
- **`.marquee-fade`**: simple opacity 0 → 1 with `duration: 0.6` (no scroll trigger; runs on mount).
- **`.parallax-img-container` / `.parallax-img`**: `gsap.fromTo(img, { y: -50, scale: fromScale }, { y: 50, scale: 1.15, ease: "none", scrollTrigger: { trigger: container, start: "top bottom", end: "bottom top", scrub: 1 } })`. `fromScale` is read from `--parallax-scale` (default `1.12`).

## Email Copy Flow

- `useCopyToClipboard` is called in `App.tsx`, which owns the toast state.
- `handleCopyEmail` (in `App.tsx`) calls `copy(siteConfig.email)` and shows the toast with the message `"Address copied beautifully to your clipboard!"` for 4500 ms.
- The button that triggers it is rendered in `Contact.tsx` and `Footer.tsx` (with class `email-copy-trigger` — a hook left over from earlier styling, not currently used for selection).

## `useActiveSection` Wiring

- `Navigation.tsx` calls `useActiveSection(navIds)` (where `navIds = navItems.map(i => i.toLowerCase())`).
- The watched ids are: `["work"]`. The `#work` section is the `<section id="work">` rendered by `Work.tsx`.
- The active state underlines nav links in the desktop nav and colors them green in the mobile drawer.

---

## Section IDs (for in-page anchors and Lenis scroll targets)

- `#hero` — `<section id="hero">` in `Hero.tsx`. Used by Footer's "Back to top" link.
- `#work` — `<section id="work">` in `Work.tsx`. Tracked by `useActiveSection` and used by Hero's "see work" CTA.
- `#about` — `<section id="about">` in `About.tsx`.
- `#contact` — `<footer id="contact">` in `Footer.tsx` (note: lives on the footer, not on a dedicated contact section).
- `#mainNav` — fixed `<nav id="mainNav">` in `Navigation.tsx`.

---

## Public Assets

| Path                     | Used by                                              |
| ------------------------ | ---------------------------------------------------- |
| `/favicon.svg`, `/favicon.ico` | `Layout.astro`                                |
| `/hero-bg.mp4`           | `Hero.tsx`, `App.tsx` (About/Footer section)         |
| `/rodrigo-santos.jpeg`   | `Hero.tsx` (last "O" of RODRIGO), `About.tsx` avatar |
| `/tworks.png`            | `projects.ts` → `tworks`                             |
| `/waymark.png`           | `projects.ts` → `waymark`                            |
| `/xethub.png`            | `projects.ts` → `xethub`                             |
| `/gbuilder.png`          | `projects.ts` → `gbuilder`                           |

Add new project thumbnails to `public/` and reference them by leading-slash path in `src/data/projects.ts`.

---

## Quick "where do I add X?" map

- **A new page route** → add `src/pages/<name>.astro` that renders `<Layout page="<key>" />`, then branch on `page` inside `App.tsx` (or add a new `page` value to the `AppProps` union).
- **A new nav item** → add the label to `navItems` in `src/data/site.ts`; the `navIds` derivation handles lowercase ids. Make sure the corresponding `<section id="...">` exists.
- **A new project** → add an entry to `projects` in `src/data/projects.ts` and drop its image into `public/`. The `Work` section renders the list automatically.
- **A new revealable heading/paragraph** → use `<RevealText text="..." as="h2" mode="word" />` or apply `.reveal` to a wrapper and let `App.tsx` animate it.
- **A new scroll-synced parallax image** → wrap the `<img class="parallax-img">` in a `.parallax-img-container` and optionally set `style={{ "--parallax-scale": "1.12" }}` on the image to override the start scale.
- **A new theme color** → add a `--color-<name>: <hex>;` entry to the `@theme` block in `globals.css`; it becomes available as `bg-<name>` / `text-<name>` / `border-<name>` automatically.
- **A new hook** → drop it in `src/hooks/use<Name>.ts`, prefix the filename and export with `use`.
