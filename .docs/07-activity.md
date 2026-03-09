# PAGE-07 — Activity Page

## Task
Enhance `src/pages/Activity.jsx` + `src/styles/Activity.css`.
Current styling is already good — do NOT redesign from scratch. Only enhance.

---

## ABSOLUTE RULE — Logic Preservation
JSX mein sirf yeh allowed hai:
1. `import` statements add karna
2. New wrapper `<div className="...">` add karna  
3. Existing elements ki `className` change karna

Do NOT touch:
- `fetchActivity()`, `useEffect`, `useState`
- `API.post("/api/activity/myactivity")`
- `formatDuration()` helper function
- `activity.slice(0, 5).map(...)` 
- `item.meetingCode`, `item.duration`, `item.joinedAt`
- `Link to="/dashboard"`
- Any conditional rendering

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables — no hardcoded hex
- No `cn()`, no `clsx()`, no `@/` alias
- `framer-motion` available if needed
- Relative imports only

---

## Output Contract
**Modify only:** `src/pages/Activity.jsx`, `src/styles/Activity.css`
**Never touch:** `src/api/axios.js`, any backend file

---

## What to Enhance

### 1. Add Navbar
Activity page mein `<Navbar />` missing hai — add karo:
```jsx
import Navbar from "../components/Navbar";
// add <Navbar /> as first child inside .act-page
```

### 2. Background Enhancement
Current background sirf plain radial gradients hain. Enhance karo:
- Global `<Background />` component already INFRA-03 mein banega — use karo agar available hai, otherwise `.act-page` background mein yeh add karo:
- Existing radial gradients rakhni hain — unke upar violet/purple tinge add karo using `var(--color-primary)` at very low opacity (0.04–0.06) — teal/cyan ke saath violet ka mix
- `.act-page::before` — subtle animated gradient orb, violet, top-right corner, `@keyframes` slow float (`translateY` 0 → -20px → 0), 8s infinite — `pointer-events: none`
- `.act-page::after` — second orb, teal/cyan, bottom-left, same animation but longer delay

### 3. Timeline Dot Enhancement  
Current `.act-item-dot` is plain teal circle. Enhance:
- Add a soft pulsing ring around it — `::after` pseudo element, same color, `@keyframes actDotPulse` (scale 1→1.8, opacity 0.4→0), 2s infinite
- Keep existing dot styles exactly, only add the pulse ring

### 4. Card Enhancement
Current cards are good. Small additions only:
- `.act-card::before` shimmer line already exists — shift color from teal to match global violet theme using `var(--color-primary)` mixed with existing cyan
- Add `::after` pseudo element — subtle violet glow in bottom-right corner of card, very low opacity, `pointer-events: none`
- Hover state already good — just ensure border-color uses `var(--color-primary)` instead of hardcoded teal rgba

### 5. Empty State Enhancement
- `.act-empty-cta` button — replace hardcoded teal gradient with `var(--color-primary)` to `var(--color-primary-bright)` violet gradient
- Add violet glow box-shadow on hover instead of teal

### 6. Timeline Connector Line
Current line is teal gradient. Update:
- Keep the gradient direction, shift colors to violet → cyan (top to bottom) using `var(--color-primary)` → `var(--color-primary-glow)`

### 7. Scroll Animation (optional, framer-motion)
If framer-motion is available — wrap each `.act-item` in a `motion.li` with:
- `initial={{ opacity: 0, x: -20 }}`
- `animate={{ opacity: 1, x: 0 }}`
- `transition={{ delay: index * 0.1 }}`
This is the only JSX logic addition allowed — purely visual, no data logic.

---

## What NOT to Change
- Overall layout structure — centered column, max-width 680px — keep exactly
- Typography sizes, weights, letter-spacing — keep exactly
- Card padding, border-radius values — keep exactly  
- All responsive breakpoints — keep exactly as-is, only update colors within them
- `.act-code-badge` font-family mono — keep exactly

---

## Responsive
All existing breakpoints already well defined — keep them. Only ensure new pseudo-element orbs are `display:none` or reduced on mobile (below 768px) for performance.

---

## Completion
1. List every modified file with one-line summary
2. Mark `PAGE-07` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP