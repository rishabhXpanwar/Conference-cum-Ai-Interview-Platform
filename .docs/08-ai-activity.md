# PAGE-08 — AI Activity Page

## Task
Redesign `src/pages/AIActivity.jsx` + `src/styles/AIActivity.css`.
Current CSS is basically unstyled (grey cards, no theme). Full redesign needed.

---

## ABSOLUTE RULE — Logic Preservation
JSX mein sirf yeh allowed hai:
1. `import` statements add karna
2. New wrapper `<div className="...">` add karna
3. Existing elements ki `className` change karna

Do NOT touch:
- `fetchActivity()`, `useEffect`, `useState`
- `user.role` conditional rendering — `interviewer`/`admin` vs candidate logic
- `API.get(url)` — both url branches preserved
- `setSelectedInterview(i)` onClick
- `closeModal()` — `onClick={closeModal}` on overlay, `e.stopPropagation()` on modal
- `selectedInterview.score === "-"` conditional
- All `item.*` and `selectedInterview.*` data fields
- `window.addEventListener("focus", handleFocus)` logic
- `<Navbar />` — already present

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables — no hardcoded hex
- No `cn()`, no `clsx()`, no `@/` alias, no `@base-ui-components`, no `class-variance-authority`
- `lucide-react` available
- `three` already installed
- Relative imports only

---

## Output Contract
**Modify:** `src/pages/AIActivity.jsx`, `src/styles/AIActivity.css`
**Reuse:** `src/components/DottedSurface.jsx` (already created in AIDashboard task — do NOT recreate)
**Never touch:** `src/api/axios.js`, `src/context/AuthContext.jsx`, `src/components/Navbar.jsx`, any backend file

---

## JSX Changes

Add DottedSurface:
```jsx
import DottedSurface from "../components/DottedSurface";
// add <DottedSurface /> as first child inside the fragment
```

Rename classNames old → new:
- `"ai-activity"` → `"aia-page"`
- `"ai-card-container"` → `"aia-grid"`
- `"ai-card"` → `"aia-card aia-card--${i.status}"` (dynamic status class)
- `"score-btn"` → `"aia-score-btn"`
- `"ai-modal-overlay"` → `"aia-modal-overlay"`
- `"ai-modal"` → `"aia-modal"`
- `"score-section"` → `"aia-score-section"`

Add close button inside modal as first child:
```jsx
<button className="aia-modal-close" onClick={closeModal}>✕</button>
```

---

## Prompt 1 — Background (DottedSurface)

> **Reuse `src/components/DottedSurface.jsx` already created in PAGE-05 (AIDashboard). Just import and place it. Do NOT recreate.**

```tsx
// Already exists at src/components/DottedSurface.jsx
// Usage:
import DottedSurface from "../components/DottedSurface";
<DottedSurface />
```

---

## Prompt 2 — Cards Design

> **Usage rule: Take design idea only — glassmorphism card, dot pattern on hover, status badge, tags, gradient border effect. Do NOT copy component structure, props, or any TS. Content comes entirely from existing AIActivity.jsx data.**

```tsx
// bento-grid.tsx — FULL PROMPT:
"use client";

import { cn } from "@/lib/utils";
import {
    CheckCircle,
    Clock,
    Star,
    TrendingUp,
    Video,
    Globe,
} from "lucide-react";

export interface BentoItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: string;
    tags?: string[];
    meta?: string;
    cta?: string;
    colSpan?: number;
    hasPersistentHover?: boolean;
}

interface BentoGridProps {
    items: BentoItem[];
}

function BentoGrid({ items = itemsSample }: BentoGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 max-w-7xl mx-auto">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={cn(
                        "group relative p-4 rounded-xl overflow-hidden transition-all duration-300",
                        "border border-gray-100/80 dark:border-white/10 bg-white dark:bg-black",
                        "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
                        "hover:-translate-y-0.5 will-change-transform",
                        item.colSpan === 2 ? "md:col-span-2" : "",
                        {
                            "shadow-[0_2px_12px_rgba(0,0,0,0.03)] -translate-y-0.5": item.hasPersistentHover,
                        }
                    )}
                >
                    <div className={`absolute inset-0 ${item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
                    </div>

                    <div className="relative flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/10">
                                {item.icon}
                            </div>
                            <span className="text-xs font-medium px-2 py-1 rounded-lg bg-white/10 text-gray-300">
                                {item.status || "Active"}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-medium text-gray-100 text-[15px]">
                                {item.title}
                                <span className="ml-2 text-xs text-gray-400 font-normal">{item.meta}</span>
                            </h3>
                            <p className="text-sm text-gray-300 leading-snug">{item.description}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                {item.tags?.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 rounded-md bg-white/10">#{tag}</span>
                                ))}
                            </div>
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.cta || "Explore →"}
                            </span>
                        </div>
                    </div>

                    <div className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-white/10 to-transparent ${item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`} />
                </div>
            ))}
        </div>
    );
}
```

Our card data mapping:
- `i.jobRole` → card title
- `i.note` → description
- `i.candidate` / `i.interviewer` → meta (keep existing role conditional)
- `i.status` → status badge + dynamic class `aia-card--completed`, `aia-card--pending`, `aia-card--active`
- "View Score →" text on hover instead of "Explore →"

Status badge colors:
- `aia-card--completed` → green tinted badge
- `aia-card--pending` → amber tinted badge
- `aia-card--active` → violet tinted badge

---

## Prompt 3 — Score Modal

> **Usage rule: Take design idea only — animated entrance (scale+fade), clean layout, score grid, feedback block. Do NOT use `@base-ui-components/react` — it is not in our project. Existing `closeModal` onClick logic stays exactly as-is.**

```tsx
// base-popover.tsx — DESIGN CONCEPT:
import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui-components/react/popover';
import { cn } from '@/lib/utils';

function PopoverContent({ className, children, ...props }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner>
        <PopoverPrimitive.Popup
          className={cn(
            `w-72 z-50 bg-popover text-popover-foreground rounded-md border p-4 shadow-md
            data-[open]:animate-in data-[closed]:animate-out 
            data-[closed]:fade-out-0 data-[open]:fade-in-0 
            data-[closed]:zoom-out-95 data-[open]:zoom-in-95`,
            className,
          )}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}
```

Key design concepts to implement in our existing modal:
- Entrance animation: `@keyframes aiaModalIn` — `from { opacity:0; transform: scale(0.92) translateY(12px) }` → `to { opacity:1; transform: scale(1) translateY(0) }`
- Modal card: dark glass, violet border, `border-radius: var(--radius-xl)`, shadow
- Score section: 3-column grid — Technical / Communication / Overall — each as a pill with label + value
- Feedback: full-width block below scores, distinct bg, italic text
- Close button top-right (already added in JSX section above)
- Outside click closes — existing `onClick={closeModal}` on overlay preserved

---

## AIActivity.CSS

### Page + Grid
- `.aia-page` — `min-height: 100vh`, `padding: 0 8% 4rem`, `position: relative`, dark bg fallback
- `.aia-page h1` — large bold gradient violet text
- `.aia-grid` — `display: grid`, `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`, `gap: 1.5rem`

### Cards
- `.aia-card` — `backdrop-filter: blur(12px)`, `background: rgba(255,255,255,0.03)`, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: var(--radius-xl)`, `padding: 1.5rem`, `position: relative`, `overflow: hidden`
- `.aia-card:hover` — `transform: translateY(-4px)`, border brightens to `var(--color-primary)` low opacity, violet glow shadow
- `.aia-card::before` — dot pattern `radial-gradient` background, `opacity: 0` → `1` on hover
- `.aia-card::after` — gradient border glow `from transparent via var(--color-primary)/10 to transparent`, opacity 0 → 1 on hover
- `.aia-status-badge` — small pill top-right, status-based color
- `.aia-score-btn` — violet gradient, white text, pill, full width, `margin-top: auto`
- `.aia-score-btn:disabled` — opacity 0.4, cursor not-allowed

### Modal
- `.aia-modal-overlay` — `position: fixed`, `inset: 0`, `background: rgba(0,0,0,0.65)`, `backdrop-filter: blur(4px)`, `z-index: var(--z-modal)`, flex center
- `.aia-modal` — dark glass, `max-width: 480px`, `width: 90%`, `border-radius: var(--radius-xl)`, `border: 1px solid var(--color-primary)` low opacity, `animation: aiaModalIn 0.25s ease`
- `.aia-modal-close` — absolute top-right, ghost button, muted color
- `.aia-score-section` — `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 1rem`, `margin: 1.5rem 0`
- `.aia-score-card` — dark pill, centered, label muted small + value large bold violet
- `.aia-feedback-block` — full width, `border-top: 1px solid var(--color-border)`, padding-top, italic muted text

---

## Responsive
- **768px** — grid single column, modal `width: 95vw`
- **480px** — score grid stacks to single column, modal padding reduced
- Min tap target 44px

---

## Completion
1. List every modified/created file with one-line summary
2. Mark `PAGE-08` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP