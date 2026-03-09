# 00 — Design Tokens
# MeetPro — Global CSS Variables Reference

All variables go in `src/styles/global.css` under `:root {}`.
Page-specific styles live in their own CSS files — these are shared fallbacks only.

---

## Colors

```css
:root {
  /* Backgrounds */
  --color-bg:           #080808;
  --color-surface:      rgba(255, 255, 255, 0.03);
  --color-surface-hover:rgba(255, 255, 255, 0.05);

  /* Brand — Violet */
  --color-primary:        #7C3AED;
  --color-primary-bright: #8B5CF6;
  --color-accent-cyan:    #06B6D4;
  --color-accent-blue:    #6366F1;

  /* Text */
  --color-text:           rgba(255, 255, 255, 0.95);
  --color-text-secondary: rgba(255, 255, 255, 0.60);
  --color-text-muted:     rgba(255, 255, 255, 0.32);

  /* Borders */
  --color-border:        rgba(255, 255, 255, 0.07);
  --color-border-active: rgba(124, 58, 237, 0.55);
}
```

---

## Typography

Font import in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
:root {
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.25rem;
  --text-2xl:  1.5rem;

  --weight-normal:   400;
  --weight-medium:   500;
  --weight-semibold: 600;
  --weight-bold:     700;

  --leading-relaxed: 1.65;
}
```

---

## Spacing, Radius, Z-index

```css
:root {
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-6: 24px;  --space-8: 32px;
  --space-10: 40px; --space-12: 48px; --space-16: 64px;

  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-2xl:  24px;
  --radius-full: 9999px;

  --z-background: -1;
  --z-base:        0;
  --z-elevated:   10;
  --z-overlay:   100;
  --z-modal:     200;
  --z-toast:     300;
}
```

---

## Global Reset + Base

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

a { color: inherit; }
button { font-family: var(--font-sans); }
img { display: block; max-width: 100%; }
```

---

## Installed Packages — Do NOT reinstall

```
framer-motion  gsap  @react-three/fiber  @react-three/drei
socket.io-client  axios  react-router-dom  lucide-react
face-api.js  @tensorflow/tfjs
```

To install (needed by specific pages):
```
cobe          → PAGE-01B (FeatureBento globe)
@splinetool/react-spline  → task 05-ai-dashboard
three         → task 05-ai-dashboard (DottedSurface)
```

---

## Hard Rules — Every Page, Every File

```
✗ No Tailwind classes anywhere
✗ No inline style={{}} — all styles in .css files
✗ No hardcoded hex — always CSS variables
✗ No transition: all — list explicit properties
✗ No !important
✗ No TypeScript / .tsx files
✗ No cn(), clsx(), @/ alias, next-themes, "use client"
✗ Never touch: main.jsx, App.jsx, AuthContext.jsx, socket.js, socketAI.js, axios.js, /backend/**
```

---

## Protected Files (Agent Must Never Touch)

```
/backend/**
src/main.jsx
src/App.jsx
src/context/AuthContext.jsx
src/socket.js
src/socketAI.js
src/api/axios.js
src/api/auth.js
src/components/protectedRoutes.jsx
src/components/MicWaveForm.jsx     (logic only)
src/components/AiWaveForm.jsx      (logic only)
src/components/HeroScene.jsx       (logic only)
src/components/HeroParticles.jsx   (logic only)
```