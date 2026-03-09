# PAGE-01B — Home Page: Features, AI Section & Footer

## Task
- Create `src/components/FeatureBento.jsx`
- Create `src/components/HomeFooter.jsx`
- Create `src/styles/home-footer.css`
- Modify `src/pages/Home.jsx` — features + AI section + footer only
- Modify `src/styles/Home.css` — bento + AI step styles only

## Prerequisite
PAGE-01A must be complete before running this task.

---

## ABSOLUTE RULE — Logic Preservation
Do NOT touch any of these:

**All useEffect blocks — completely untouched**

**GSAP querySelector strings — two updates ONLY (these are the only allowed logic changes):**
- `".feature-card"` → `".home-feat-card"` in both useEffects
- `".ai-step"` → `".home-ai-step"` in both useEffects

**Hero section — DO NOT TOUCH (completed in PAGE-01A)**

**All Link/navigate/href values — untouched**

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables — no hardcoded hex
- No `cn()`, `clsx()`, `@/` alias, `next-themes`, `"use client"`, `dark:` prefix
- `framer-motion` available
- `lucide-react` available
- `cobe` — install: `npm install cobe`
- Relative imports only
- No `Image` from next/image — use `<img>`
- No `Link` from next/link — use React Router `<Link>` or `<a>`

---

## Output Contract
**Create:**
- `src/components/FeatureBento.jsx`
- `src/components/HomeFooter.jsx`
- `src/styles/home-footer.css`

**Modify:**
- `src/pages/Home.jsx` — features + AI section + footer only
- `src/styles/Home.css` — add new classes only

**Never touch:**
- `src/components/HeroScene.jsx`
- `src/components/ShaderBackground.jsx` (from PAGE-01A)
- `src/components/MagnetizeButton.jsx` (from PAGE-01A)
- `src/components/Navbar.jsx`
- Hero section JSX (from PAGE-01A)

---

## PART A — FeatureBento Component

> **Usage rule: Take design idea only — bento grid layout with 6-column grid, feature cards, Globe in last card. Do NOT copy component structure or Tailwind classes. Content comes from existing Home.jsx feature cards. Globe (cobe) — convert exactly.**

```tsx
// FULL PROMPT — feature-section-with-bento-grid.tsx:
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import Link from "next/link";

export function FeaturesSectionWithBentoGrid() {
  const features = [
    {
      title: "Track issues effectively",
      description: "Track and manage your project issues with ease.",
      skeleton: <SkeletonOne />,
      className: "col-span-1 md:col-span-4 lg:col-span-4 border-b md:border-r dark:border-neutral-800",
    },
    {
      title: "Capture pictures with AI",
      description: "Capture stunning photos effortlessly using our advanced AI.",
      skeleton: <SkeletonTwo />,
      className: "col-span-1 md:col-span-2 lg:col-span-2 border-b dark:border-neutral-800",
    },
    {
      title: "Watch our AI on YouTube",
      description: "Get to know about our product on YouTube",
      skeleton: <SkeletonThree />,
      className: "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-r dark:border-neutral-800",
    },
    {
      title: "Deploy in seconds",
      description: "With our blazing fast cloud services - deploy your model in seconds.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 md:col-span-3 lg:col-span-3 border-b md:border-none",
    },
  ];

  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
        {features.map((feature) => (
          <FeatureCard key={feature.title} className={feature.className}>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
            <div className="h-full w-full">{feature.skeleton}</div>
          </FeatureCard>
        ))}
      </div>
    </div>
  );
}

// Globe — convert exactly:
export const Globe = ({ className }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => { state.phi = phi; phi += 0.01; },
    });
    return () => { globe.destroy(); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: "1" }}
      className={className}
    />
  );
};
```

**Our FeatureBento content mapping:**

| Card | col-span | Title | Description | Skeleton |
|------|----------|-------|-------------|---------|
| 1 | 4 | HD Video Conferencing | WebRTC peer-to-peer, adaptive bitrate. No plugins. No latency. | Animated pulse rings (CSS @keyframes) mimicking a video call signal |
| 2 | 2 | Real-time Messaging | Socket.io powered in-session chat, syncs instantly. | 3 mock chat bubbles using motion.div stagger fade-in |
| 3 | 3 | Secure by Design | JWT + OTP-verified email. Access-controlled sessions. | Shield icon (lucide-react ShieldCheck) + glowing ring animation |
| 4 | 3 | Global Infrastructure | Low-latency WebRTC across regions. Built for scale. | `<Globe />` component from cobe (convert exactly) |

GSAP compatibility: every card must have className `"feat-bento-card home-feat-card"` so GSAP querySelectorAll(".home-feat-card") works.

CSS (add to Home.css):
```css
.feat-bento-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-top: 3rem;
}

.feat-bento-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
  position: relative;
  transition: background 300ms;
  /* GSAP will set initial opacity: 0 */
}

.feat-bento-card:hover {
  background: rgba(255, 255, 255, 0.04);
}

.feat-bento-card--wide   { grid-column: span 4; }
.feat-bento-card--half   { grid-column: span 3; }
.feat-bento-card--narrow { grid-column: span 2; }

.feat-bento-card h3 {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.feat-bento-card p {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
}

@media (max-width: 768px) {
  .feat-bento-grid { grid-template-columns: 1fr; }
  .feat-bento-card--wide,
  .feat-bento-card--half,
  .feat-bento-card--narrow { grid-column: span 1; }
}
```

Placement in Home.jsx — replace existing `.feature-grid` div:
```jsx
import FeatureBento from "../components/FeatureBento";

// Replace:
// <div className="feature-grid" ref={featCardsRef}>
//   <div className="feature-card glass-panel ambient-glow">...</div>
//   ...
// </div>

// With:
<div ref={featCardsRef}>
  <FeatureBento />
</div>
```

---

## PART B — AI Section Extra Steps

In existing `.ai-steps` div (ref={aiStepsRef}), after the 4 existing steps, add 2 more:

```jsx
<div className="home-ai-step">
  <div className="home-ai-step__number">05</div>
  <div className="home-ai-step__content">
    <h4>Face Attention Detection</h4>
    <p>FaceAPI monitors candidate presence in real time — ensuring integrity throughout the session.</p>
  </div>
</div>

<div className="home-ai-step">
  <div className="home-ai-step__number">06</div>
  <div className="home-ai-step__content">
    <h4>Score & Feedback Report</h4>
    <p>Technical, communication and overall scores — delivered as a structured report the moment the interview ends.</p>
  </div>
</div>
```

## PART B — Class Renames (AI Section)

| Old class | New class |
|---|---|
| `"ai-step glass-panel"` | `"home-ai-step"` |
| `"ai-step__number"` | `"home-ai-step__number"` |
| `"ai-step__content"` | `"home-ai-step__content"` |

CSS (add to Home.css — rename from existing `.ai-step` styles):
```css
.home-ai-step {
  /* same layout as existing .ai-step */
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  transition: transform 300ms, border-color 300ms;
  /* GSAP sets opacity: 0 initially */
}

.home-ai-step:hover {
  transform: translateY(-3px);
  border-color: rgba(124, 58, 237, 0.25);
}

.home-ai-step__number {
  font-size: 2rem;
  font-weight: var(--weight-bold);
  color: rgba(124, 58, 237, 0.4);
  line-height: 1;
  flex-shrink: 0;
}

.home-ai-step__content h4 {
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
  margin-bottom: 0.4rem;
}

.home-ai-step__content p {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
}
```

Also rename CTA box class:
- `"cta-section__inner glass-panel glass-panel--strong"` → `"cta-section__inner home-cta-box"`

---

## PART C — HomeFooter Component

> **Usage rule: Take design idea only — centered minimal footer, links row, icons row, copyright. Do NOT use next/link. Use React Router `<Link>` for internal routes, `<a>` for external.**

```tsx
// FULL PROMPT — footer.tsx:
import Link from 'next/link'
import { Globe, Share2, MessageCircle, Link as LinkIcon, Send, Feather } from 'lucide-react'

const links = [
  { title: 'Features', href: '#' },
  { title: 'Solution', href: '#' },
  { title: 'Customers', href: '#' },
  { title: 'Pricing', href: '#' },
  { title: 'Help', href: '#' },
  { title: 'About', href: '#' },
]

export default function FooterSection() {
  return (
    <footer className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link, index) => (
            <Link key={index} href={link.href}
              className="text-muted-foreground hover:text-primary block duration-150">
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
        <div className="my-8 flex flex-wrap justify-center gap-6">
          <Link href="#"><Share2 className="size-6" /></Link>
          <Link href="#"><MessageCircle className="size-6" /></Link>
          <Link href="#"><Globe className="size-6" /></Link>
          <Link href="#"><Send className="size-6" /></Link>
          <Link href="#"><Feather className="size-6" /></Link>
        </div>
        <span className="block text-center text-sm">
          © {new Date().getFullYear()} Tailark, All rights reserved
        </span>
      </div>
    </footer>
  )
}
```

Our footer content:
- Links: `Video Meetings → /signup`, `AI Interview → /signup`, `Pricing → /pricing`, `Activity → /activity`, `Help → #`, `About → #`
- Icons (lucide-react): Github, Linkedin, Twitter, Globe, Mail
- Copyright: `© {new Date().getFullYear()} MeetPro. All rights reserved.`

CSS in `src/styles/home-footer.css`:
```css
.home-footer {
  padding: 3rem 8%;
  position: relative;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.home-footer::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
}

.home-footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.home-footer-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color 150ms;
}

.home-footer-link:hover { color: var(--color-text); }

.home-footer-icons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.home-footer-icon {
  color: var(--color-text-muted);
  transition: color 150ms;
  display: flex;
  align-items: center;
}

.home-footer-icon:hover { color: var(--color-primary); }

.home-footer-copy {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
```

Import in Home.jsx:
```jsx
import HomeFooter from "../components/HomeFooter";
import "../styles/home-footer.css";

// Replace:
// <footer className="footer">
//   © {new Date().getFullYear()} MeetPro. All rights reserved.
// </footer>

// With:
<HomeFooter />
```

---

## Smooth Scroll
`href="#ai-section"` already works. Ensure `html { scroll-behavior: smooth; }` exists in `global.css` — add if missing.

---

## Completion
1. List every created/modified file with one-line summary
2. Mark `PAGE-01B` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP