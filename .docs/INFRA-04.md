# INFRA-04 — Navbar Styling

## Current State (Already Done — Do NOT change logic)
The `Navbar.jsx` logic is already complete and working. It handles:
- `user` conditional rendering — logged out shows Login/Signup, logged in shows toggle + activity + logout
- `isAIMode` detection via `location.pathname.startsWith("/ai")` — routes My Activity correctly
- Mode toggle pill — active state via `location.pathname`
- Already imported in `Dashboard.jsx`, `Home.jsx`, `AIDashboard.jsx`

**Do NOT touch any of this logic. Do NOT restructure the JSX. Do NOT change any `onClick`, `navigate()`, `logout()`, or conditional rendering.**

---

## Task
Create `src/styles/navbar.css` and update the import in `Navbar.jsx` to use it.

## Output Contract
**Create:**
- `src/styles/navbar.css`

**Modify:**
- `src/components/Navbar.jsx` — two allowed changes only:
  1. Replace the two CSS imports (`AINavbar.css` and `Dashboard.css`) with a single `import "../styles/navbar.css"`
  2. Add scroll detection `useEffect` + hamburger `useState` (see below)

**Delete:**
- `src/styles/AINavbar.css` — no longer needed after this task

**Do NOT touch:**
- Any other JSX or logic in `Navbar.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/Home.jsx`
- `src/pages/AIDashboard.jsx`
- `src/styles/Dashboard.css` — Dashboard page still needs its own styles

---

## Codebase Rules
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables from `global.css` — no hardcoded hex
- No `transition: all`
- `backdrop-filter` allowed — only on `.dash-nav--scrolled` state
- No `!important`
- `framer-motion` and `lucide-react` available
- No `cn()`, no `clsx()`, no `@/` alias paths, no `"use client"`
- No `@radix-ui/*`, no `class-variance-authority`

---

## PART A — Scroll Detection (add to Navbar.jsx)

> **Usage rule: Take design idea only — scroll threshold logic + body overflow lock for mobile menu. Convert TS→JSX, remove all Tailwind classes, remove cn()/useScroll()/buttonVariants imports, implement directly inline.**

```tsx
// FULL PROMPT — header-2.tsx scroll + mobile logic:
'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { useScroll } from '@/components/ui/use-scroll';

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);   // threshold: 10px

  // Disable body scroll when mobile menu open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={cn(
      'sticky top-0 z-50',
      { 'backdrop-blur-lg bg-background/50 border-b border-border': scrolled && !open }
    )}>
      <nav className="flex h-14 items-center justify-between px-4">
        {/* logo + links */}
        <Button size="icon" onClick={() => setOpen(!open)} className="md:hidden">
          <MenuToggleIcon open={open} duration={300} />
        </Button>
      </nav>
      {/* mobile dropdown */}
      <div className={open ? 'block' : 'hidden'}>...</div>
    </header>
  );
}

// useScroll hook — source:
export function useScroll(threshold) {
  const [scrolled, setScrolled] = React.useState(false);
  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);
  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);
  React.useEffect(() => { onScroll(); }, [onScroll]);
  return scrolled;
}
```

**What to add to Navbar.jsx (two additions only):**

1. Scroll state (at top of component, near other useState):
```jsx
const [scrolled, setScrolled] = useState(false);
const [mobileOpen, setMobileOpen] = useState(false);

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // check on mount
  return () => window.removeEventListener("scroll", onScroll);
}, []);

useEffect(() => {
  document.body.style.overflow = mobileOpen ? "hidden" : "";
  return () => { document.body.style.overflow = ""; };
}, [mobileOpen]);
```

2. On the `<nav>` element — add the scrolled class dynamically:
```jsx
// Change className from:
className="dash-nav"
// To:
className={"dash-nav" + (scrolled ? " dash-nav--scrolled" : "")}
```

---

## PART B — Animated Hamburger Icon (MenuToggleIcon)

> **Usage rule: Convert exactly — TS→JSX, remove cn()/clsx(), keep all SVG path values + animation logic identical. No Tailwind → plain CSS class `.dash-hamburger-icon`.**

```tsx
// FULL PROMPT — menu-toggle-icon.tsx:
'use client';
import React from 'react';
import { cn } from '@/lib/utils';

type MenuToggleProps = React.ComponentProps<'svg'> & {
  open: boolean;
  duration?: number;
};

export function MenuToggleIcon({
  open,
  className,
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = 2.5,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  duration = 500,
  ...props
}: MenuToggleProps) {
  return (
    <svg
      strokeWidth={strokeWidth}
      fill={fill}
      stroke={stroke}
      viewBox="0 0 32 32"
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      className={cn(
        'transition-transform ease-in-out',
        open && '-rotate-45',  // rotates entire SVG when open
        className,
      )}
      style={{ transitionDuration: `${duration}ms` }}
      {...props}
    >
      <path
        className={cn(
          'transition-all ease-in-out',
          open
            ? '[stroke-dasharray:20_300] [stroke-dashoffset:-32.42px]'  // morphs to X
            : '[stroke-dasharray:12_63]',                               // burger lines
        )}
        style={{ transitionDuration: `${duration}ms` }}
        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
      />
      <path d="M7 16 27 16" />
    </svg>
  );
}
```

**Converted JSX — create `src/components/MenuToggleIcon.jsx`:**
```jsx
export default function MenuToggleIcon({ open, duration = 300, className = "" }) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 32 32"
      className={"dash-hamburger-icon " + className + (open ? " dash-hamburger-icon--open" : "")}
      style={{ transitionDuration: `${duration}ms` }}
    >
      <path
        className={"dash-hamburger-path" + (open ? " dash-hamburger-path--open" : "")}
        style={{ transitionDuration: `${duration}ms` }}
        d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
      />
      <path d="M7 16 27 16" />
    </svg>
  );
}
```

CSS for MenuToggleIcon (add to `navbar.css`):
```css
.dash-hamburger-icon {
  width: 20px;
  height: 20px;
  transition-property: transform;
  transition-timing-function: ease-in-out;
}

.dash-hamburger-icon--open {
  transform: rotate(-45deg);
}

.dash-hamburger-path {
  transition-property: stroke-dasharray, stroke-dashoffset;
  transition-timing-function: ease-in-out;
  stroke-dasharray: 12 63;
}

.dash-hamburger-path--open {
  stroke-dasharray: 20 300;
  stroke-dashoffset: -32.42px;
}
```

**Usage in Navbar.jsx — add hamburger button to the JSX (mobile only):**
```jsx
import MenuToggleIcon from "./MenuToggleIcon";

// Add inside <nav className="dash-nav ..."> alongside existing content:
<button
  className="dash-nav-hamburger"
  onClick={() => setMobileOpen(!mobileOpen)}
  aria-label="Toggle menu"
>
  <MenuToggleIcon open={mobileOpen} duration={300} />
</button>

// Add mobile dropdown after closing </nav> but inside the root wrapper:
{mobileOpen && (
  <div className="dash-nav-mobile-menu">
    {/* If user is logged out: */}
    {!user && (
      <>
        <button className="dash-mobile-btn" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Sign In</button>
        <button className="dash-mobile-btn dash-mobile-btn--primary" onClick={() => { navigate("/signup"); setMobileOpen(false); }}>Sign Up</button>
      </>
    )}
    {/* If user is logged in: */}
    {user && (
      <>
        <button className="dash-mobile-btn" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>Meet Mode</button>
        <button className="dash-mobile-btn" onClick={() => { navigate("/ai-dashboard"); setMobileOpen(false); }}>AI Mode</button>
        <button className="dash-mobile-btn" onClick={() => { navigate(isAIMode ? "/ai-activity" : "/activity"); setMobileOpen(false); }}>My Activity</button>
        <button className="dash-mobile-btn dash-mobile-btn--danger" onClick={() => { logout(); setMobileOpen(false); }}>Logout</button>
      </>
    )}
  </div>
)}
```

Note: `navigate`, `user`, `logout`, `isAIMode` are all already available in `Navbar.jsx` — just use them.

---

## PART C — navbar.css — Full Spec

Style all existing class names (already in JSX) + new mobile classes.

```css
/* ============================================
   NAVBAR
   ============================================ */

.dash-nav {
  height: 64px;
  position: sticky;
  top: 0;
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 8%;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition:
    background 250ms ease,
    border-color 250ms ease,
    backdrop-filter 250ms ease;
}

.dash-nav--scrolled {
  background: rgba(8, 8, 8, 0.75);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom-color: var(--color-border);
}

/* ---- Logo ---- */
.dash-nav-logo {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-decoration: none;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: default;
  flex-shrink: 0;
}

/* ---- Mode Toggle Pill ---- */
.dash-toggle-pill {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
}

.dash-toggle-option {
  padding: 0.35rem 0.9rem;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
  font-family: var(--font-sans);
  transition:
    color 200ms ease,
    background 200ms ease,
    border-color 200ms ease;
}

.dash-toggle-option:hover {
  color: var(--color-text);
}

.dash-toggle-option--active {
  background: linear-gradient(135deg, var(--color-primary), rgba(109, 40, 217, 0.8));
  border-color: rgba(124, 58, 237, 0.5);
  color: #fff;
  font-weight: var(--weight-semibold);
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.25);
}

/* ---- Right side ---- */
.dash-nav-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.625rem;
}

.dash-welcome-pill {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.dash-welcome-pill span {
  color: var(--color-text);
  font-weight: var(--weight-medium);
}

/* ---- Nav buttons ---- */
.dash-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.45rem 1rem;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  font-family: var(--font-sans);
  cursor: pointer;
  min-height: 36px;
  white-space: nowrap;
  transition:
    color 200ms ease,
    background 200ms ease,
    border-color 200ms ease,
    box-shadow 200ms ease,
    transform 150ms ease;
}

.dash-nav-btn--ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--color-text-muted);
}

.dash-nav-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text);
  border-color: rgba(255, 255, 255, 0.2);
}

.dash-nav-btn--danger {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: rgba(239, 68, 68, 0.8);
}

.dash-nav-btn--danger:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.45);
  color: #f87171;
}

.dash-nav-btn--primary {
  background: linear-gradient(135deg, var(--color-primary), rgba(109, 40, 217, 0.8));
  border: 1px solid rgba(124, 58, 237, 0.4);
  color: #fff;
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
}

.dash-nav-btn--primary:hover {
  opacity: 0.88;
  transform: translateY(-1px);
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.35);
}

/* ============================================
   HAMBURGER (mobile only)
   ============================================ */

.dash-nav-hamburger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text);
  flex-shrink: 0;
}

.dash-hamburger-icon {
  width: 20px;
  height: 20px;
  transition-property: transform;
  transition-timing-function: ease-in-out;
}

.dash-hamburger-icon--open {
  transform: rotate(-45deg);
}

.dash-hamburger-path {
  transition-property: stroke-dasharray, stroke-dashoffset;
  transition-timing-function: ease-in-out;
  stroke-dasharray: 12 63;
}

.dash-hamburger-path--open {
  stroke-dasharray: 20 300;
  stroke-dashoffset: -32.42px;
}

/* ============================================
   MOBILE DROPDOWN MENU
   ============================================ */

.dash-nav-mobile-menu {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: calc(var(--z-overlay) - 1);
  background: rgba(8, 8, 8, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 1.25rem;
  animation: mobileMenuIn 250ms ease forwards;
}

@keyframes mobileMenuIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dash-mobile-btn {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-text);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  font-family: var(--font-sans);
  cursor: pointer;
  text-align: left;
  transition: background 150ms ease;
  min-height: 48px;
}

.dash-mobile-btn:hover {
  background: rgba(255, 255, 255, 0.07);
}

.dash-mobile-btn--primary {
  background: linear-gradient(135deg, var(--color-primary), rgba(109, 40, 217, 0.8));
  border-color: rgba(124, 58, 237, 0.4);
  color: #fff;
}

.dash-mobile-btn--primary:hover {
  opacity: 0.88;
}

.dash-mobile-btn--danger {
  background: transparent;
  border-color: rgba(239, 68, 68, 0.2);
  color: rgba(239, 68, 68, 0.8);
}

.dash-mobile-btn--danger:hover {
  background: rgba(239, 68, 68, 0.07);
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .dash-nav {
    padding: 0 5%;
  }

  .dash-toggle-pill,
  .dash-nav-right {
    display: none;
  }

  .dash-nav-hamburger {
    display: flex;
  }
}

@media (max-width: 480px) {
  .dash-nav { padding: 0 4%; }
}
```

---

## Completion
1. List every created, modified, and deleted file with one-line summary
2. Mark `INFRA-04` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP