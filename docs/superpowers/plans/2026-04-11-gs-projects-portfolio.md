# GS-Projects Portfolio Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium personal brand portfolio for Giovanni Sizino that showcases live digital products, positions him as a high-caliber digital craftsman, and serves as an expandable product catalogue — deployed free on Vercel.

**Architecture:** Next.js 14+ App Router with TypeScript, Tailwind CSS v4, anime.js for scroll/reveal animations, and Aceternity/Magic UI inspired components (hand-built, not library-dependent). Single-page design with smooth scroll sections. Data-driven project catalogue (JSON config) for easy expansion. No backend needed initially.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS v4, anime.js, Framer Motion, Lucide React icons, Vercel deployment

---

## Design System (Uncodixfy-Compliant)

**Typography:** Archivo (headings) / Space Grotesk (body)
**Colors:**
- Background: `#0A0A0B` (near-black)
- Surface: `#141415` (cards/panels)
- Border: `#232326` (subtle dividers)
- Text Primary: `#FAFAFA` (white)
- Text Secondary: `#A1A1AA` (zinc-400)
- Accent: `#2563EB` (blue-600)
- CTA Accent: `#F97316` (orange-500, used sparingly)
- Hover: `#3B82F6` (blue-500)

**Spacing:** 4/8/12/16/24/32/48/64px scale
**Radius:** 8px cards, 6px buttons, 4px inputs — NO oversized rounds
**Shadows:** `0 1px 3px rgba(0,0,0,0.3)` max — NO dramatic box-shadows
**Transitions:** 150-200ms ease — NO bouncy/transform animations
**Icons:** Lucide React — NO emojis

**Anti-patterns (BANNED per Uncodixfy):**
- No glassmorphism shells
- No gradient text or gradient borders
- No eyebrow labels with uppercase + letter-spacing
- No decorative copy headers
- No KPI card grids
- No oversized rounded corners
- No dramatic shadows or glows
- No generic dark SaaS composition

**Permitted premium effects (purposeful, not decorative):**
- anime.js staggered text reveal on scroll
- Subtle spotlight/cursor-follow on project cards
- Smooth parallax on hero background
- Staggered card entrance animations (30-50ms per item)
- Hover: subtle border-color shift + shadow increase (no scale/transform)

---

## File Structure

```
GS-Projects/
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── public/
│   ├── fonts/
│   │   ├── Archivo-Variable.woff2
│   │   └── SpaceGrotesk-Variable.woff2
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with fonts, metadata, theme
│   │   ├── page.tsx                # Main page composing all sections
│   │   └── globals.css             # Tailwind imports + CSS variables
│   ├── components/
│   │   ├── Hero.tsx                # Name, title, animated intro
│   │   ├── ProjectGrid.tsx         # Masonry-style project catalogue
│   │   ├── ProjectCard.tsx         # Individual project card with preview
│   │   ├── ProjectDetail.tsx       # Expanded project modal/overlay
│   │   ├── About.tsx               # Philosophy & approach section
│   │   ├── Contact.tsx             # Subtle CTA section
│   │   ├── Navigation.tsx          # Minimal sticky nav
│   │   ├── Footer.tsx              # Simple footer
│   │   ├── SectionReveal.tsx       # Scroll-triggered reveal wrapper
│   │   ├── SpotlightCard.tsx       # Cursor-follow spotlight effect
│   │   └── TextReveal.tsx          # anime.js text animation component
│   ├── data/
│   │   └── projects.ts             # Project catalogue data
│   ├── hooks/
│   │   ├── useScrollReveal.ts      # Intersection Observer hook
│   │   └── useMousePosition.ts     # Cursor tracking hook
│   └── lib/
│       └── animations.ts           # anime.js animation configs
├── docs/
│   └── superpowers/
│       └── plans/
│           └── 2026-04-11-gs-projects-portfolio.md
└── CLAUDE.md
```

---

## Chunk 1: Project Scaffolding & Design Tokens

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Scaffold Next.js with TypeScript + Tailwind**

```bash
cd "C:/Cloaude Logic/GS-Projects"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Install dependencies**

```bash
npm install animejs@3.2.2 framer-motion lucide-react
npm install -D @types/animejs
```

- [ ] **Step 3: Verify project runs**

```bash
npm run dev
```
Expected: Dev server on localhost:3000

- [ ] **Step 4: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js project with TypeScript + Tailwind"
```

### Task 2: Design Tokens & Global Styles

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Set up CSS variables and font imports in globals.css**

Custom properties for the color system, font-face declarations for Archivo + Space Grotesk (via Google Fonts CDN initially, self-hosted later).

- [ ] **Step 2: Configure Tailwind theme extensions**

Map CSS variables to Tailwind tokens: colors (background, surface, border, text-primary, text-secondary, accent, cta), fontFamily (heading: Archivo, body: Space Grotesk).

- [ ] **Step 3: Update root layout with fonts, metadata, theme class**

Add metadata (title: "Giovanni Sizino — Digital Products", description, OG tags). Apply dark class to html. Set up font loading.

- [ ] **Step 4: Verify tokens render correctly**

```bash
npm run dev
```
Check: background color, font rendering, no FOUT.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx tailwind.config.ts
git commit -m "feat: add design system tokens — colors, typography, spacing"
```

---

## Chunk 2: Core Layout & Navigation

### Task 3: Navigation Component

**Files:**
- Create: `src/components/Navigation.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build Navigation**

Minimal sticky nav: logo/name left, section links right (Projects, About, Contact). Scroll-aware: transparent at top, solid surface on scroll. No hamburger needed for MVP (responsive later). Simple border-bottom, no shadow.

- [ ] **Step 2: Add smooth scroll behavior**

Anchor links with `scroll-behavior: smooth` and `scroll-margin-top` for nav offset.

- [ ] **Step 3: Wire into page.tsx**

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation.tsx src/app/page.tsx
git commit -m "feat: add minimal sticky navigation"
```

### Task 4: Footer Component

**Files:**
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Build Footer**

Simple footer: name, email link, year. No social icons unless real profiles exist. Subtle border-top, text-secondary color.

- [ ] **Step 2: Commit**

---

## Chunk 3: Hero Section

### Task 5: Hero with anime.js Text Animation

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/components/TextReveal.tsx`
- Create: `src/lib/animations.ts`

- [ ] **Step 1: Create animation configs in lib/animations.ts**

Define anime.js configs: staggered letter reveal, fade-up for subtitle, smooth opacity transitions. Duration 600-800ms, easeOutExpo easing, stagger 30ms per character.

- [ ] **Step 2: Build TextReveal component**

Wrapper that splits text into spans, applies anime.js stagger on mount. Respects `prefers-reduced-motion`. Uses IntersectionObserver to trigger only when visible.

- [ ] **Step 3: Build Hero section**

Layout: Full viewport height. Name "Giovanni Sizino" with TextReveal animation. Subtitle: "Building digital products that solve real problems" — fade up after name reveals. Minimal — no decorative elements, no background effects. Just strong typography and whitespace.

- [ ] **Step 4: Verify animation plays correctly**

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx src/components/TextReveal.tsx src/lib/animations.ts
git commit -m "feat: add hero section with anime.js text reveal"
```

---

## Chunk 4: Project Data & Card Components

### Task 6: Project Data Structure

**Files:**
- Create: `src/data/projects.ts`

- [ ] **Step 1: Define TypeScript types and project data**

```typescript
type Project = {
  id: string
  name: string
  tagline: string
  description: string
  problem: string
  url: string
  status: 'live' | 'beta' | 'development'
  tags: string[]
  color: string // accent color per project
  year: number
}
```

Populate with Foresay Labs, StagPlanner, Vantage data (from research agent findings).

- [ ] **Step 2: Commit**

### Task 7: ProjectCard Component

**Files:**
- Create: `src/components/ProjectCard.tsx`
- Create: `src/components/SpotlightCard.tsx`
- Create: `src/hooks/useMousePosition.ts`

- [ ] **Step 1: Build useMousePosition hook**

Track cursor position relative to card for spotlight effect.

- [ ] **Step 2: Build SpotlightCard wrapper**

Subtle radial gradient that follows cursor on hover. Light blue/white gradient at low opacity (0.05-0.08). Border color shifts subtly toward accent on hover. NO glow, NO glassmorphism — just a soft light-follow.

- [ ] **Step 3: Build ProjectCard**

Card shows: project name (Archivo bold), tagline, status badge (small, 6px radius, simple border), tech tags, and a "View Project" link. On hover: spotlight effect + border brightens. Card dimensions: consistent height, 8px radius, 1px border.

Includes a live preview area — an iframe thumbnail (scaled down) or screenshot of the live site, with a subtle border. This is the visual hook.

- [ ] **Step 4: Commit**

### Task 8: ProjectGrid Section

**Files:**
- Create: `src/components/ProjectGrid.tsx`
- Create: `src/components/SectionReveal.tsx`
- Create: `src/hooks/useScrollReveal.ts`

- [ ] **Step 1: Build useScrollReveal hook**

IntersectionObserver with threshold 0.1. Returns ref and isVisible boolean.

- [ ] **Step 2: Build SectionReveal wrapper**

Fade-up animation when section enters viewport. Uses anime.js for smooth translateY(20px) → translateY(0) + opacity 0 → 1. Duration 500ms, easeOutCubic. Respects reduced-motion.

- [ ] **Step 3: Build ProjectGrid**

Section header: "Projects" (simple h2, no eyebrow label). Grid layout: 1 col mobile, 2 col tablet, 3 col desktop. Cards enter with stagger (40ms apart) via SectionReveal. Gap: 24px.

- [ ] **Step 4: Commit**

---

## Chunk 5: Project Detail & About/Contact

### Task 9: ProjectDetail Overlay

**Files:**
- Create: `src/components/ProjectDetail.tsx`

- [ ] **Step 1: Build detail overlay**

Click project card → overlay slides up with full project info. Contains: larger live preview iframe, full description, problem/solution narrative, tech stack, link to live site. Simple backdrop (rgba(0,0,0,0.8)), centered panel, close button top-right. Smooth enter/exit with Framer Motion.

- [ ] **Step 2: Commit**

### Task 10: About Section

**Files:**
- Create: `src/components/About.tsx`

- [ ] **Step 1: Build About section**

Heading: "About". Brief, human copy — Giovanni as a builder/maker of digital products. Focus on craft, problem-solving, and real-world impact. NOT a resume. NOT a pitch. Just honest positioning. 3-4 sentences max. Clean typography, generous whitespace.

- [ ] **Step 2: Commit**

### Task 11: Contact Section

**Files:**
- Create: `src/components/Contact.tsx`

- [ ] **Step 1: Build Contact section**

Heading: "Let's talk". One line: "Interested in working together, or want to learn more about any of these projects?" Email link: giovanni.sizino.ennes@hotmail.co.uk styled as a clean text link, not a button. Subtle — an invitation, not a pitch. The quality of the work above should do the selling.

- [ ] **Step 2: Commit**

---

## Chunk 6: Polish, Responsive, Deploy

### Task 12: Scroll Animations & Micro-interactions

- [ ] **Step 1: Add section-level scroll reveals to all sections**
- [ ] **Step 2: Add nav active-state based on scroll position**
- [ ] **Step 3: Test all animations with prefers-reduced-motion**
- [ ] **Step 4: Commit**

### Task 13: Responsive Design

- [ ] **Step 1: Test and fix at 375px, 768px, 1024px, 1440px**
- [ ] **Step 2: Adjust grid columns, font sizes, spacing per breakpoint**
- [ ] **Step 3: Ensure nav works on mobile (simple — stack links or minimal)**
- [ ] **Step 4: Commit**

### Task 14: Metadata & OG Tags

- [ ] **Step 1: Add proper meta tags, OG image, favicon**
- [ ] **Step 2: Commit**

### Task 15: Vercel Deployment

- [ ] **Step 1: Initialize git repo and push to GitHub**

```bash
cd "C:/Cloaude Logic/GS-Projects"
gh repo create gs-projects --public --source=. --push
```

- [ ] **Step 2: Connect to Vercel and deploy**

```bash
npx vercel --prod
```

- [ ] **Step 3: Verify live site**

---

## Execution Notes

- All project data lives in `src/data/projects.ts` — adding new projects = adding entries to this array
- Live preview iframes may need CORS consideration — fallback to screenshots if blocked
- anime.js v3.2.2 (not v4 alpha) for stability
- Framer Motion only for the detail overlay transition — anime.js for everything else
- Every animation respects `prefers-reduced-motion`
- Color palette is dark-first but structured for light mode addition later
