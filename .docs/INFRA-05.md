# INFRA-05 — Alert Component

## Task
Create `src/components/Alert.jsx` and `src/styles/alert.css`. This is the global notification/toast component used across all pages for success, error, warning, and info messages.

## Output Contract
- **Create:** `src/components/Alert.jsx`
- **Create:** `src/styles/alert.css`
- **Do NOT touch:** any other file

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables from `global.css` — no hardcoded hex
- `framer-motion` is already installed — import `motion` and `AnimatePresence` from `"framer-motion"`
- No `transition: all`

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | string | required | Text to display |
| `type` | `"success"` \| `"error"` \| `"warning"` \| `"info"` | `"info"` | Controls color scheme |
| `onClose` | function | required | Called when alert should close |

## Behavior
- Auto-dismisses after **4 seconds** — use `useEffect` with `setTimeout(onClose, 4000)`, clear on cleanup
- Has a manual close button (`✕`) that calls `onClose` immediately
- Renders a small icon/glyph on the left matching the type (agent chooses appropriate symbol or emoji — `✓` for success, `✕` for error, `⚠` for warning, `ℹ` for info is acceptable)
- Wrap in `AnimatePresence` for exit animation support

## Animation (framer-motion)
- Mount: fades in + slides down slightly + unblurs (`opacity: 0→1`, `y: -16→0`, `filter: blur(8px)→blur(0px)`)
- Unmount: reverses (`opacity: 1→0`, `y: 0→-12`, `filter: blur(0px)→blur(6px)`)
- Duration: approximately 0.35s with smooth easing

## Visual Spec
- Shape: pill (`border-radius: var(--radius-full)`)
- Position: `fixed`, top-center of viewport, high `z-index` (`var(--z-toast)`)
- Centered horizontally via `left: 50%`, `transform: translateX(-50%)`
- Each type has its own semi-transparent tinted background + matching border + matching text color:
  - **success** — green tones
  - **error** — red tones
  - **warning** — yellow/amber tones
  - **info** — indigo/blue tones
- Agent decides exact rgba values — aim for subtle, not loud
- Box shadow for depth
- `max-width: 90vw` to prevent overflow on mobile

## Usage Pattern (for reference — do not modify other files)
```
// In any page:
const [alert, setAlert] = useState(null);
// show: setAlert({ message: "Done!", type: "success" })
// hide: setAlert(null)

{alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
```

---

## Completion
1. List created files with one-line summary each
2. Mark `INFRA-05` as `[x]` in ROADMAP.md
3. Write: `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP