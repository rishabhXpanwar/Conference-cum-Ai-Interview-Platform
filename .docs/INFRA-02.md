# INFRA-02 — Global CSS (`global.css`)

## Task
Rewrite `src/styles/global.css` with the confirmed design token system and global reset.

## Output Contract
- **Modify:** `src/styles/global.css`
- **Do NOT touch:** anything else

---

## Requirements

Replace the entire file with the following:

```css
/* ========================================
   DESIGN TOKENS — MeetPro
   ======================================== */

:root {

  /* ---- Base ---- */
  --color-base: #080808;

  /* ---- Primary Violet ---- */
  --color-primary:       #7C3AED;
  --color-primary-bright:#8B5CF6;
  --color-primary-glow:  #A78BFA;

  /* ---- Accent ---- */
  --color-accent-pink:   #EC4899;
  --color-accent-blue:   #6366F1;
  --color-accent-cyan:   #38BDF8;

  /* ---- Background Layers ---- */
  --color-bg-deep:      #080808;
  --color-bg-primary:   #0d0d0d;
  --color-bg-secondary: #111111;
  --color-bg-elevated:  #161616;
  --color-bg-surface:   #1a1a1a;

  /* ---- Text ---- */
  --color-text-primary:   rgba(255, 255, 255, 0.95);
  --color-text-secondary: rgba(255, 255, 255, 0.65);
  --color-text-muted:     rgba(255, 255, 255, 0.35);

  /* ---- Borders ---- */
  --color-border:       rgba(255, 255, 255, 0.06);
  --color-border-hover: rgba(255, 255, 255, 0.12);

  /* ---- Glow Values ---- */
  --glow-violet: rgba(124, 58, 237, 0.35);
  --glow-pink:   rgba(236, 72, 153, 0.25);
  --glow-blue:   rgba(99, 102, 241, 0.30);
  --glow-soft:   rgba(139, 92, 246, 0.12);

  /* ---- Shadows ---- */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.30);
  --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.40), 0 2px 4px rgba(0, 0, 0, 0.30);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.45), 0 4px 8px rgba(0, 0, 0, 0.35);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.55), 0 8px 16px rgba(0, 0, 0, 0.40), 0 2px 4px rgba(0, 0, 0, 0.25);

  --shadow-glow-violet: 0 0 30px rgba(124, 58, 237, 0.22), 0 0 60px rgba(124, 58, 237, 0.10);
  --shadow-glow-pink:   0 0 30px rgba(236, 72, 153, 0.18), 0 0 60px rgba(236, 72, 153, 0.08);

  /* ---- Blur ---- */
  --blur-sm: 8px;
  --blur-md: 16px;
  --blur-lg: 24px;
  --blur-xl: 40px;

  /* ---- Border Radius ---- */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   14px;
  --radius-xl:   18px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  /* ---- Spacing ---- */
  --space-1:   4px;
  --space-2:   8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* ---- Typography ---- */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;
  --text-3xl:  1.875rem;
  --text-4xl:  2.25rem;
  --text-5xl:  3rem;

  --leading-tight:   1.2;
  --leading-normal:  1.5;
  --leading-relaxed: 1.7;

  --weight-normal:   400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;
  --weight-extrabold:800;

  /* ---- Transitions ---- */
  --ease-smooth:    cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-cinematic: cubic-bezier(0.65, 0, 0.35, 1);

  --duration-fast:   150ms;
  --duration-base:   250ms;
  --duration-slow:   400ms;
  --duration-slower: 600ms;

  /* ---- Z-Index ---- */
  --z-background: -1;
  --z-base:        0;
  --z-elevated:   10;
  --z-overlay:   100;
  --z-modal:     200;
  --z-toast:     300;
  --z-max:      9999;
}

/* ========================================
   GLOBAL RESET
   ======================================== */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

html,
body {
  font-family: var(--font-sans);
  background-color: var(--color-bg-deep);
  color: var(--color-text-primary);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
  min-height: 100vh;
  min-width: 320px;
}

/* ========================================
   TYPOGRAPHY
   ======================================== */

h1, h2, h3, h4, h5, h6 {
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
}

p {
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

a {
  color: var(--color-primary-bright);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-smooth);
}

a:hover {
  color: var(--color-primary-glow);
}

/* ========================================
   APP SHELL
   ======================================== */

#root {
  min-height: 100vh;
  position: relative;
  isolation: isolate;
}

/* ========================================
   GLOBAL FALLBACK BUTTON — .btn
   Used when page instruction does NOT
   define its own button style.
   ======================================== */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-blue));
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  box-shadow: 0 4px 18px var(--glow-violet);
  transition:
    transform var(--duration-fast) var(--ease-smooth),
    box-shadow var(--duration-fast) var(--ease-smooth),
    filter var(--duration-fast) var(--ease-smooth);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px var(--glow-violet);
  filter: brightness(1.08);
}

.btn:active {
  transform: translateY(0) scale(0.98);
  filter: brightness(0.96);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

/* ========================================
   GLOBAL FALLBACK INPUT — .input-field
   Pill shape, neumorphic on dark surface.
   ======================================== */

.input-field {
  width: 100%;
  padding: 13px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  font-size: var(--text-base);
  font-family: var(--font-sans);
  outline: none;
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.35),
    inset 0 1px 2px rgba(0, 0, 0, 0.20);
  transition:
    border-color var(--duration-fast) var(--ease-smooth),
    box-shadow var(--duration-fast) var(--ease-smooth);
  box-sizing: border-box;
}

.input-field::placeholder {
  color: var(--color-text-muted);
}

.input-field:hover {
  border-color: rgba(255, 255, 255, 0.13);
}

.input-field:focus {
  border-color: rgba(139, 92, 246, 0.50);
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.35),
    0 0 0 3px rgba(139, 92, 246, 0.10),
    0 0 14px rgba(139, 92, 246, 0.07);
}

/* ========================================
   SCROLLBAR
   ======================================== */

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.14);
}
```

---

## Completion
1. List modified file with one-line summary
2. Mark `INFRA-02` as `[x]` in ROADMAP.md
3. Write: `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP