# Rodrigo Santos — Portfolio (Full Content Dump)

> Generated from all source files in `rodrigo-portfolio/`

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Task / Goals](#2-task--goals)
3. [Tech Stack & Config](#3-tech-stack--config)
4. [Architecture](#4-architecture)
5. [Site Configuration (site.ts)](#5-site-configuration-sitets)
6. [Skills / Marquee Data (skills.ts)](#6-skills--marquee-data-skillsts)
7. [Projects Data (projects.ts)](#7-projects-data-projectsts)
8. [Pages](#8-pages)
9. [Layout (Layout.astro)](#9-layout-layoutastro)
10. [App.tsx — Main React Root](#10-apptsx--main-react-root)
11. [Navigation Component](#11-navigation-component)
12. [Hero Section](#12-hero-section)
13. [Marquee Section](#13-marquee-section)
14. [Work Section (Projects)](#14-work-section-projects)
15. [About Section](#15-about-section)
16. [Contact Section](#16-contact-section)
17. [Footer](#17-footer)
18. [UI Components](#18-ui-components)
    - [Button](#181-button)
    - [ProjectCard](#182-projectcard)
    - [RevealText](#183-revealtext-gsap-splittext)
    - [SectionLabel](#184-sectionlabel)
    - [LazyVideo](#185-lazyvideo)
19. [Layout Components](#19-layout-components)
    - [ScrollProgress](#191-scrollprogress)
    - [GrainOverlay](#192-grainoverlay)
    - [Toast](#193-toast)
20. [Hooks](#20-hooks)
    - [useActiveSection](#201-useactivesection)
    - [useCopyToClipboard](#202-usecopytoclipboard)
    - [useMediaQuery](#203-usemediaquery)
    - [useScrollProgress](#204-usescrollprogress)
21. [Styles / Tailwind](#21-styles--tailwind)
22. [Utility Functions](#22-utility-functions)
23. [Scripts (Copy Management)](#23-scripts-copy-management)
24. [Skill Files (Installed Agent Skills)](#24-skill-files-installed-agent-skills)

---

## 1. Project Overview

**Rodrigo Santos** is a **Frontend & Webflow Developer** based in **Sintra, Portugal**. This is his portfolio website, built with React 19 inside an Astro 7 static shell.

The site showcases 4 selected projects (t'works, Waymark, XetHub, GBuilder) with GSAP-powered animations, Lenis smooth scrolling, SplitText reveals, and a dark, minimal aesthetic with a green accent (`#A7C080`).

**Live at**: [rodrigosantos.dev](https://rodrigosantos.dev)

---

## 2. Task / Goals

From `task.md`:

> - Standardize the paragraph and hero reveal animation (use GSAP SplitText text reveal component)
> - Optimize animations so the website feels leaner to navigate (currently a little laggy at times)

The `RevealText` component already exists and uses GSAP SplitText. The remaining concern is **performance optimization**.

---

## 3. Tech Stack & Config

### package.json

```json
{
  "name": "rodrigo-portfolio",
  "type": "module",
  "version": "0.0.1",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/react": "^6.0.1",
    "@tailwindcss/vite": "^4.3.2",
    "astro": "^7.0.9",
    "clsx": "^2.1.1",
    "gsap": "^3.15.0",
    "lenis": "^1.3.25",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "tailwind-merge": "^3.6.0",
    "tailwindcss": "^4.3.2"
  }
}
```

### tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

### .npmrc

```
auto-install-peers=true
node-linker=hoisted
lockfile=true
```

### pnpm-workspace.yaml

```yaml
allowBuilds:
  esbuild: true
  sharp: true
minimumReleaseAgeExclude:
  - '@astrojs/markdown-satteri@0.3.4'
  - astro@7.0.9
```

---

## 4. Architecture

- **Astro 7** pre-renders the HTML shell (meta tags, fonts, routing)
- **React 19** is hydrated via `client:load` as a single root (`App.tsx`)
- `App.tsx` receives a `page` prop (`"home"` | `"contact"`) and branches the render tree
- **Lenis** handles smooth scrolling, synced with GSAP ticker
- **GSAP 3.15** handles all animations: ScrollTrigger parallax, SplitText reveals, timeline orchestration
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin

### Route Structure

| Path | Astro Page | Layout | page prop |
|------|-----------|--------|-----------|
| `/` | `src/pages/index.astro` | `Layout.astro` | `"home"` |
| `/contact` | `src/pages/contact.astro` | `Layout.astro` | `"contact"` |

### Component Tree

```
App.tsx
├── ScrollProgress      ← reading scroll %, renders top bar
├── Navigation          ← fixed top nav with mobile hamburger
├── GrainOverlay        ← SVG film grain overlay (fixed)
├── <main>
│   ├── (if home)
│   │   ├── Hero       ← name animation, subtitle
│   │   ├── Marquee    ← top skills ticker
│   │   ├── Work       ← 4 project cards
│   │   ├── Marquee    ← bottom philosophy ticker
│   │   ├── LazyVideo  ← bg video
│   │   ├── About      ← bio, values, narrative
│   │   └── Footer     ← CTA, links, back to top
│   └── (if contact)
│       ├── Contact    ← email copy, social links
│       └── Footer
└── Toast              ← email copy notification
```

---

## 5. Site Configuration (site.ts)

```typescript
export const siteConfig = {
  name: "Rodrigo Santos",
  title: "Frontend & Webflow Developer",
  tagline:
    "Designing and engineering high-fidelity Webflow websites with clean custom code, smooth interactions, and absolute precision.",
  email: "rod.santos122@gmail.com",
  location: "Sintra, Portugal",
} as const;

export const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Upwork", href: "https://www.upwork.com/" },
  { label: "GitHub", href: "https://github.com/Rodsantos1337" },
] as const;

export const navItems = [] as const;        // empty — no section-based nav links
export const navIds = navItems.map((item) => item.toLowerCase());
```

---

## 6. Skills / Marquee Data (skills.ts)

### Top Band — Tools & Craft

```
Webflow Development
Custom JavaScript
React
TypeScript
GSAP Animation
Astro CMS
Component Architecture
Responsive Design
```

### Bottom Band — Philosophy & Values

```
Finsweet Client-First
Scroll-Synced Interactions
Semantic HTML Structure
Performance Optimization
Pixel-Precise Layouts
Clean, Maintainable Code
```

---

## 7. Projects Data (projects.ts)

### Project 1: t'works

| Field | Value |
|-------|-------|
| **Title** | t'works |
| **Description** | Global language services corporate site. Implemented a robust multi-language CMS architecture and structured a comprehensive, easily searchable service catalog. |
| **Image** | `/tworks.png` |
| **URL** | https://www.t-works.eu/ |
| **Role** | Lead Developer |
| **Stack** | Webflow, CMS, Multi-language |

### Project 2: Waymark

| Field | Value |
|-------|-------|
| **Title** | Waymark |
| **Description** | A data-rich annual report landing page for healthcare transformation. Built interactive charts and custom UI layouts to present complex healthcare statistics cleanly. |
| **Image** | `/waymark.png` |
| **URL** | https://www.waymarkcare.com/medicaid-transformation-report |
| **Role** | Interactive Developer |
| **Stack** | Webflow, Custom CSS, JS |

### Project 3: Old XetHub website

| Field | Value |
|-------|-------|
| **Title** | Old XetHub website |
| **Description** | Landing page for a developer-focused ML versioning platform. Built clean, responsive product layouts, interactive feature grids, and custom integrations. |
| **Image** | `/xethub.png` |
| **URL** | https://xethub-staging.webflow.io/ |
| **Role** | Frontend Developer |
| **Stack** | Webflow, Custom Interactions |

### Project 4: GBuilder

| Field | Value |
|-------|-------|
| **Title** | GBuilder |
| **Description** | SaaS marketing website for a real estate BIM platform. Engineered custom scroll-triggered animations and responsive layout structures to showcase complex technical tools. |
| **Image** | `/gbuilder.png` |
| **URL** | https://www.gbuilder.com/ |
| **Role** | Frontend Developer |
| **Stack** | Webflow, GSAP, JavaScript |

---

## 8. Pages

### index.astro

```astro
---
import Layout from "../layouts/Layout.astro";
---
<Layout page="home" />
```

### contact.astro

```astro
---
import Layout from "../layouts/Layout.astro";
---
<Layout page="contact" title="Contact | Rodrigo Santos" />
```

---

## 9. Layout (Layout.astro)

**File**: `src/layouts/Layout.astro`

- Sets `<html lang="en">`
- Loads fonts: **Clash Display** (display) + **General Sans** (body) via Fontshare
- SEO meta tags (Open Graph, Twitter Card)
- Body classes: `bg-bgDark text-brandText font-sans antialiased overflow-x-hidden selection:bg-brandGreen/25`
- Hydrates `<App client:load page={page} />`

**Global overrides**:
- `html { scroll-padding-top: 100px }`
- `body { background-color: #0e1112; }` with a subtle radial gradient accent
- `::selection` styled to brand green
- `.custom-radius-max { border-radius: 14px !important; }`

---

## 10. App.tsx — Main React Root

**File**: `src/components/react/App.tsx`

### Props
- `page?: "home" | "contact"` (default: `"home"`)

### State
- `toastMessage: string | null` — controls toast visibility
- `copy` / `copied` — from `useCopyToClipboard` hook

### Handlers
- `handleCopyEmail()` — copies `siteConfig.email`, shows toast
- `handleScrollTo(href)` — uses Lenis to scroll to section (offset: -100)

### useEffect (initialization)

On mount (keyed by `page`):
1. Creates a **Lenis** smooth scroll instance (duration: 0.8, custom easing)
2. Syncs Lenis with GSAP ticker
3. Registers GSAP ScrollTriggers (if not reduced motion):
   - `.reveal` — scroll-triggered slide-up (opacity 0→1, y 40→0, start: "top 88%", once)
   - `.reveal-fade` — scroll-triggered fade-in (opacity 0→1, start: "top 90%", once)
   - `.marquee-fade` — mount fade-in with configurable delay
   - `.parallax-img-container` — parallax effect on project images (scrub: 0.5)
4. Cleanup: destroys Lenis, removes GSAP ticker, kills all ScrollTriggers

### Render Tree

```
<ScrollProgress />
<Navigation onScrollTo={handleScrollTo} />
<GrainOverlay />
<main>
  {page === "home" ? (
    <>
      <Hero />
      <Marquee items={topMarqueeItems} mountDelay={2} />
      <Work />
      <Marquee items={bottomMarqueeItems} reverse />
      <section>  ← with video bg
        <LazyVideo src="/hero-bg.mp4" />
        <About />
        <Footer />
      </section>
    </>
  ) : (
    <>
      <Contact onCopyEmail={handleCopyEmail} />
      <Footer />
    </>
  )}
</main>
<Toast message={toastMessage} />
```

---

## 11. Navigation Component

**File**: `src/components/react/layout/Navigation.tsx`

### Behavior
- Fixed top nav (`h-16 md:h-20`), backdrop blur
- Left: name link with green pulsing dot
- Right:
  - GitHub button (desktop)
  - "Let's Connect" CTA button (desktop, links to `/contact`)
  - Hamburger menu button (mobile)

### Mobile Drawer
- Full-screen overlay with backdrop blur
- Animates in/out with GSAP (`fromTo` opacity/y for menu, stagger for items)
- Links: "Let's Connect" button, GitHub, LinkedIn

### Hamburger Animation
- 3 span lines, animates to X shape on open (GSAP rotation/y/opacity)
- Respects `prefers-reduced-motion`

---

## 12. Hero Section

**File**: `src/components/react/sections/Hero.tsx`

### Layout
- Full viewport height minus marquee height: `h-[calc(100vh-var(--marquee-h))]`
- Background: lazy-loaded video (`/hero-bg.mp4`, 15% opacity)
- Content centered

### Name Animation
- **Row 1**: "RODRIG" (individual chars with hover → green) + avatar "O" (circular image)
- **Row 2**: "SANTOS" (individual chars with hover → green)
- Both rows slide up from `yPercent: 115` to `0` using a GSAP timeline
  - Row 1: duration 1.2, ease power4.out
  - Row 2: duration 1.2, ease power4.out, offset -0.8s
- Container fades in (opacity 0→1, 0.4s)

### Subtitle
- Uses `<RevealText>` in `line` mode, playOnMount, delay 1.3s
- Text: *"I design and build high-fidelity marketing sites and interactive digital experiences, combining the speed of Webflow with the power of clean custom code."*

---

## 13. Marquee Section

**File**: `src/components/react/sections/Marquee.tsx`

### Props
- `items: readonly string[]`
- `reverse?: boolean` — flips direction
- `mountDelay?: number` — delay before fade-in (handled by App.tsx)

### Behavior
- Seamless infinite scroll ticker using CSS `animate-marquee` / `animate-marquee-reverse`
- Content duplicated for seamless loop
- Mask image: gradient fade on both edges (transparent → white 10% → white 90% → transparent)
- Mount fade-in via `.marquee-fade` class (handled by App.tsx's GSAP)
- Font: Clash Display, uppercase, semibold, tracking-wider, muted text

### CSS Animation (from globals.css)

```css
@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

Duration: 40s linear infinite.

---

## 14. Work Section (Projects)

**File**: `src/components/react/sections/Work.tsx`

### Layout
- Max width 7xl, py-24, px-6/12
- Header: "Selected Projects" label + heading *"Web experiences built with code and care."*
- Maps over `projects` array, rendering `<ProjectCard>` for each
- Alternating layout: `reverse={index % 2 === 1}`
- Section heading uses `<RevealText>` in word mode

### ProjectCard Component

**File**: `src/components/react/ui/ProjectCard.tsx`

**Layout**: 12-column grid split:
- **7 cols** — project image (clickable link, opens in new tab)
  - Image with parallax effect (handled by App.tsx GSAP)
  - "Explore Project" button slides up from bottom on hover (CSS translate-y)
  - Custom border-radius (14px)
- **5 cols** — project info:
  - Title (RevealText, word mode, hover→green)
  - Description (RevealText, word mode)
  - Meta grid (2x2): Role, Stack values (RevealText, char mode for labels, word mode for values)

---

## 15. About Section

**File**: `src/components/react/sections/About.tsx`

### Layout
- 12-column grid: sidebar (4 cols) + narrative (8 cols)
- Sidebar is sticky on large screens (`lg:sticky lg:top-28`)

### Sidebar
- Avatar with hover flip effect (image → "RS" initials on green bg)
- Name (RevealText, word mode)
- Info list (RevealText throughout):
  - **Location**: Sintra, Portugal
  - **Core Focus**: Webflow Development, Custom JS & GSAP, Component Design
  - **Current Pursuit**: Merging modern frontend workflows with visual website development
  - **Availability**: Open to freelance projects and full-time roles (with green pulsing dot)

### Narrative
1. **Quote**: *"I bridge the gap between static design and interactive code, turning layout blueprints into fast, engaging, and polished web realities."*
2. **Bio 1**: About 3 years experience, worked at Better Mistakes agency, currently delivering custom frontend solutions for global companies.
3. **Bio 2**: Development style influenced by React + TypeScript, bringing structured mindset to Webflow.
4. **Bio 3**: Completed degree in Audiovisual and Multimedia at ESCS, 2 years motion graphics at Bright Lisbon Agency.

---

## 16. Contact Section

**File**: `src/components/react/sections/Contact.tsx`

### Layout
- Full viewport height (`min-h-screen`), centered vertically
- Max width 5xl

### Content
- Section label: "Contact"
- Heading: *"Let's build something great."* (RevealText, word mode)
- Description: *"Whether you have a detailed design specification ready or simply want to discuss a potential project, feel free to reach out."*
- Email box: interactive button that copies email, shows copy icon
- Profiles box: LinkedIn, Upwork, GitHub buttons

---

## 17. Footer

**File**: `src/components/react/layout/Footer.tsx`

### Content
- **CTA section**:
  - Label: "Start a Conversation" (RevealText, word mode)
  - Heading: *"Let's build something great."* (RevealText, word mode)
  - Email copy button with hint text
  - Location note: "Based in Portugal, working worldwide."
  - Social links: LinkedIn, Upwork, GitHub
- **Bottom bar**:
  - Copyright: `© {year} Rodrigo Santos. All Rights Reserved.`
  - "Built with clean structure and custom code."
  - "Back to top" link (scrolls to `#hero`)

---

## 18. UI Components

### 18.1 Button

**File**: `src/components/react/ui/Button.tsx`

### Variants

| Variant | Style | Use Case |
|---------|-------|----------|
| `primary` | Dark surface + border, green slide-up hover fill, icon slot | Main CTAs (email copy, "Let's Connect") |
| `secondary` | Same surface/border, compact pill | Nav links, social links |
| `light` | White bg, dark text, no border | Overlaid on dark images ("Explore Project" badge) |

### Features
- `slide` prop (primary only): renders a slide-up green fill layer on hover
- Supports both `<a>` (with href) and `<button>` rendering
- Rounded-full, transition-all, overflow-hidden

### 18.2 ProjectCard

*(See Section 14.2 above)*

### 18.3 RevealText (GSAP SplitText)

**File**: `src/components/react/ui/RevealText.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | required | The text to animate |
| `as` | element type | `"span"` | HTML tag to render |
| `mode` | `"char" \| "word" \| "line"` | `"char"` | SplitText mode |
| `stagger` | number | `0.05` | Stagger delay between elements |
| `delay` | number | `0` | Initial delay |
| `duration` | number | `1.2` | Animation duration |
| `className` | string | `""` | Container class |
| `charsClassName` / `wordsClassName` / `linesClassName` | string | `""` | Classes for individual elements |
| `playOnMount` | boolean | `false` | If true, plays immediately. If false, uses ScrollTrigger ("top 88%", once) |

### Behavior
1. Creates GSAP SplitText on the container
2. Elements start at `yPercent: 115` (below mask)
3. Animates to `yPercent: 0` with power3.out easing + stagger
4. If `playOnMount` is false (default), animation is triggered by ScrollTrigger
5. Respects `prefers-reduced-motion: reduce` (sets yPercent: 0 instantly)
6. Cleanup: calls `splitRef.current.revert()` on unmount

### Used everywhere:
- Hero subtitle (line mode, playOnMount)
- SectionLabel (word mode)
- Work heading (word mode)
- ProjectCard title, description, meta labels (word/char mode)
- About name, values, bios, quote (word/char mode)
- Contact heading, description (word mode)
- Footer labels, headings, hints (word mode)

### 18.4 SectionLabel

**File**: `src/components/react/ui/SectionLabel.tsx`

Simple wrapper: renders a `<span>` with uppercase mono green text containing a `<RevealText>` in word mode. Used in Work, About, and Contact sections.

### 18.5 LazyVideo

**File**: `src/components/react/ui/LazyVideo.tsx`

- Uses `IntersectionObserver` to play/pause video based on viewport visibility
- `preload="none"` to prevent downloading until component mounts
- `muted`, `loop`, `playsInline`
- Error handling: `.catch()` on play (browser autoplay policies)

---

## 19. Layout Components

### 19.1 ScrollProgress

**File**: `src/components/react/layout/ScrollProgress.tsx`

- Fixed bar at top of page (2px height, brand green)
- Uses `useScrollProgress` hook
- Transform: `scaleX(${progress / 100})` with `origin-left`

### 19.2 GrainOverlay

**File**: `src/components/react/layout/GrainOverlay.tsx`

- Memoized component
- Fixed overlay (`z-[9998]`, pointer-events-none, 3.5% opacity)
- SVG filter: `feTurbulence` (fractalNoise, baseFrequency 0.75) + `feColorMatrix` (saturate 0)
- Applied to a full-screen `<rect>`

### 19.3 Toast

**File**: `src/components/react/layout/Toast.tsx`

- Fixed at bottom center, appears when `message` is set
- GSAP enter animation: opacity 0→1, y 20→0 (0.3s)
- GSAP exit animation: opacity 1→0, y 0→10 (0.3s)
- Respects reduced motion
- Green pulsing dot indicator
- 14px border-radius container
- Auto-clears after 4.5s (set in App.tsx)

---

## 20. Hooks

### 20.1 useActiveSection

**File**: `src/hooks/useActiveSection.ts`

- Observes sections via IntersectionObserver
- Returns the ID of the currently visible section
- RootMargin: `-40% 0px -55% 0px`
- **Not currently used** in any component (navItems is empty)

### 20.2 useCopyToClipboard

**File**: `src/hooks/useCopyToClipboard.ts`

- Returns `[copy, copied]` tuple
- Uses `navigator.clipboard.writeText` with textarea fallback
- Auto-resets after 3 seconds
- Used by App.tsx for email copy

### 20.3 useMediaQuery

**File**: `src/hooks/useMediaQuery.ts`

- Evaluates a CSS media query, returns boolean
- Returns `false` during SSR
- **Not currently used** in any component

### 20.4 useScrollProgress

**File**: `src/hooks/useScrollProgress.ts`

- Tracks scroll percentage (0-100)
- Passive scroll listener
- Used by ScrollProgress component

---

## 21. Styles / Tailwind

**File**: `src/styles/globals.css`

### Custom Theme Tokens (Tailwind v4 `@theme`)

**Colors**:
| Token | Value | Usage |
|-------|-------|-------|
| `bgDark` | `#0E1112` | Page background |
| `bgSurface` | `#161A1C` | Card/surface background |
| `bgBorder` | `#23292C` | Borders |
| `brandGreen` | `#A7C080` | Accent (green) |
| `brandMuted` | `#7D8C83` | Muted accent |
| `brandText` | `#E6E9E7` | Primary text |
| `brandTextMuted` | `#96A39B` | Secondary text |

**Fonts**:
- `--font-clash`: "Clash Display", sans-serif
- `--font-sans`: "General Sans", sans-serif

**Animations**:
- `marquee`: 40s linear infinite scroll
- `marquee-reverse`: 40s linear infinite reverse scroll
- `ping-slow`: 3s ping animation
- `accordion-down` / `accordion-up` (unused?)

### Animation Classes
- `.reveal` — hidden initially, GSAP reveals on scroll
- `.reveal-fade` — hidden initially, GSAP fades in on scroll
- `.marquee-fade` — hidden initially, GSAP fades in on mount
- `.hero-fade` — hidden initially, GSAP fades in hero container
- `.reveal-word`, `.reveal-char`, `.reveal-line` — inline-block for SplitText elements
- `.reveal-word-mask`, `.reveal-char-mask`, `.reveal-line-mask` — overflow clip masks

---

## 22. Utility Functions

**File**: `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Simple class name merger using `clsx` + `tailwind-merge`.

---

## 23. Scripts (Copy Management)

### extract-copy.py

**File**: `scripts/extract-copy.py`

Extracts all copy text from React components and TypeScript data files into a `COPY.md` file. Parses:
- `site.ts` — name, title, tagline, email, location, social links
- `projects.ts` — project titles, descriptions, meta
- `skills.ts` — marquee items
- React components — RevealText text props, section labels, navigation text, footer text

### update-copy.py

**File**: `scripts/update-copy.py`

The reverse: reads a `COPY-REVISED.md` file and applies copy changes back to the source files. Supports updating:
- `site.ts` — title, tagline, email, location
- `skills.ts` — marquee items
- `projects.ts` — descriptions, role, stack
- `Hero.tsx` — subtitle
- `About.tsx` — quote, labels, values, bios
- `Work.tsx` — heading
- `Contact.tsx` — heading, description
- `Footer.tsx` — labels, headings, hints

---

## 24. Skill Files (Installed Agent Skills)

Two agent skill files are present (used by the pi coding agent):

### skills/frontend-design/SKILL.md
Guidance for distinctive, intentional visual design. Covers:
- Grounding design in the subject matter
- Design principles (hero as thesis, typography carries personality, structure is information)
- Process: brainstorm, explore, plan, critique, build, critique again
- Writing for design

### skills/design-taste-frontend/SKILL.md
"Anti-Slop Frontend Skill" — comprehensive design system with:
- Three Dials: DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY
- Design system mapping (when to use Fluent, Carbon, Shadcn, etc.)
- Color calibration (THE LILA RULE, premium-consumer palette ban)
- Layout diversification, AI tells to avoid
- Performance & accessibility guardrails
- Pre-flight checklist (50+ checks)
- GSAP canonical skeletons (sticky-stack, horizontal-pan)
- Block library schema, redesign protocol

---

## 💡 Key Observations

### Performance Concerns (matching task.md goals)

1. **App.tsx runs all GSAP animations globally** via `document.querySelectorAll` — this means every page mount scans the entire DOM for `.reveal`, `.reveal-fade`, `.marquee-fade`, and `.parallax-img-container` classes and creates separate ScrollTriggers for each. This is redundant since RevealText already handles its own animations per-component.

2. **RevealText creates a new SplitText instance and GSAP timeline for every instance** — since there are ~20+ RevealText usages across the page, this creates many ScrollTriggers that could add up.

3. **GSAP registered twice** — once in `App.tsx` (`gsap.registerPlugin(ScrollTrigger, SplitText)`) and once in `RevealText.tsx` (`gsap.registerPlugin(SplitText)`). This is harmless but redundant.

4. **The duplicate GSAP ScrollTriggers** — App.tsx creates `.reveal` and `.reveal-fade` ScrollTriggers for elements, but many of those same elements also have RevealText children that create their own ScrollTriggers. This means some elements get animated twice.

5. **Lenis + GSAP ticker** is generally good for performance, but with 20+ ScrollTriggers, the `scrub` animations on parallax could cause jank.

### Architecture Notes

- `navItems` is empty, so `useActiveSection` and `navIds` are unused
- `useMediaQuery` is defined but not used anywhere
- The contact page shares the same footer but doesn't show About/Hero/Marquee/Work
- The video background (`/hero-bg.mp4`) is used both in Hero and in a section wrapping About+Footer
- All components use `function` declarations or `export default function` — consistent style
