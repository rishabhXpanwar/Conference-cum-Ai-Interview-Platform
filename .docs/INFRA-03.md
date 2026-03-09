# INFRA-03 — Background Component

## Task
Rewrite `src/components/Background.jsx` and `src/styles/background.css` as the global animated fallback background. This component is rendered once in `App.jsx` and sits behind all pages.

## Output Contract
- **Modify:** `src/components/Background.jsx`
- **Modify:** `src/styles/background.css`
- **Do NOT touch:** `src/App.jsx` or any other file

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables from `global.css` — no hardcoded hex
- No `transition: all`
- No `backdrop-filter` — this is a background layer, not a glass panel
- GSAP is already installed — do not npm install anything

---

## Visual Spec

Two large soft blurred orbs floating slowly on a pure black base:

- **Orb 1:** Violet tone using `--color-primary` family — positioned bottom-left quadrant
- **Orb 2:** Pink/accent tone using `--color-accent-pink` — positioned top-right quadrant
- Both orbs animate with a slow floating yoyo using GSAP (`repeat: -1`, `yoyo: true`, `ease: "sine.inOut"`). The two orbs should have slightly different durations and delays so they feel organic, not synced.
- Base background color: `var(--color-bg-deep)`
- A subtle vignette overlay at the edges — radial gradient, transparent at center, dark at edges — implemented as a separate `.bg-vignette` div, not a CSS pseudo-element, so it stacks cleanly above the orbs
- The component root must be `position: fixed`, `inset: 0`, `z-index: var(--z-background)`, `pointer-events: none`, `overflow: hidden`

## Performance Requirements
- `will-change: transform` on both orb elements
- `contain: strict` on the root div
- Wrap GSAP animations in `gsap.context()` and return `ctx.revert()` in the useEffect cleanup
- Pass `aria-hidden="true"` on the root div

## Class Names to Use
`.bg-root`, `.bg-orb`, `.bg-orb--violet`, `.bg-orb--pink`, `.bg-vignette`

Agent decides all sizing, blur, opacity, and position values — aim for cinematic and subtle, not loud.

---

## Completion
1. List modified files with one-line summary each
2. Mark `INFRA-03` as `[x]` in ROADMAP.md
3. Write: `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP