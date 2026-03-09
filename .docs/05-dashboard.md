# 05 — Dashboard Page

## Current State
File: `src/pages/Dashboard.jsx`
The navbar (`<nav>`) block inside `Dashboard.jsx` has already been removed and replaced with the global `<Navbar />` component. Do not add any navbar here.

## Preserved Logic — Do NOT Touch
All handlers and state are working. Do NOT modify:
- `handlecreateMeeting()` — calls `POST /api/meetings/create`, sets `meetingCode`, opens modal
- `handlejoinMeeting()` — calls `GET /api/meetings/verify/:code`, navigates to `/meeting/:code`
- `handlecopy()` — copies `meetingCode` to clipboard
- `handleshare()` — copies full meeting link to clipboard
- `showModal` state — controls modal visibility
- `meetingCode`, `joincode`, `error`, `loading` state
- All `useContext`, `useNavigate`, `useLocation` imports

**Replace `handlecopy` and `handleshare`**: Currently both call `alert(...)`. Replace these with toast calls — `toasts.success("Meeting code copied!")` and `toasts.success("Meeting link copied!")`. No other logic change.

## Output Contract
**Modify:**
- `src/pages/Dashboard.jsx`

**Create:**
- `src/styles/Dashboard.css` — page-specific styles
- `src/components/StarButton.jsx` — reusable star-trail button (see spec below)
- `src/styles/star-button.css` — styles for StarButton
- `src/components/MeetingCreatedModal.jsx` — success modal after meeting created
- `src/styles/meeting-created-modal.css`

**Install:**
- `framer-motion` (if not already installed)
- `lucide-react` (if not already installed)

**Do NOT touch:**
- `src/components/Navbar.jsx`
- `src/context/AuthContext.jsx`
- `src/api/axios.js`
- Any backend files

---

## Toast Integration
Import `useToasts` from the global toast utility:
```
import { useToasts } from "../components/Toast";
```
Call `const toasts = useToasts();` inside the component.
Replace both `alert(...)` calls in `handlecopy` and `handleshare` with:
- `toasts.success("Meeting code copied!")`
- `toasts.success("Meeting link copied!")`

**Create `src/components/Toast.jsx`** — a self-mounting, imperative toast system using `createRoot`. No external toast library. Spec:

### Toast System Spec
- Triggered via `useToasts()` hook — returns `{ success, error, warning, message }` methods
- Mounts its own container div into `document.body` on first call
- Toast pill: fixed bottom-right, blurred dark background, violet left-border accent for success, red for error, amber for warning, neutral for message
- Stack behavior: new toasts stack above old ones with slight scale/offset — max 3 visible
- Auto-dismiss after 3 seconds with smooth fade-out
- Manual close button (X icon from lucide-react)
- Hover pauses the dismiss timer
- Framer-motion for enter/exit animation — slide up from bottom + fade in
- Class names: `.toast-container`, `.toast-pill`, `.toast-pill--success`, `.toast-pill--error`, `.toast-pill--warning`, `.toast-pill--message`, `.toast-close-btn`
- `Toast.css` — plain CSS, all colors from CSS variables

---

## StarButton Component Spec
File: `src/components/StarButton.jsx`

This is adapted from the 21st.dev star-trail button. Core concept:
- Button has 6 small star SVGs positioned around/inside it
- On hover, stars fly outward in different directions with staggered timing and cubic-bezier easing
- Stars have a drop-shadow glow on hover
- Button itself: on hover — background becomes transparent, text takes on the button's accent color, adds a soft glow shadow

**Adaptation rules (our codebase):**
- TypeScript → JSX
- Tailwind classes → plain CSS classes in `star-button.css`
- No `cn()`, no `clsx()` — plain className strings
- The star SVG path stays exactly as-is:
  ```
  M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z
  ```
- viewBox stays: `0 0 784.11 815.53`

**Props:**
- `children` — button label text
- `onClick` — click handler
- `disabled` — boolean
- `variant` — `"primary"` (violet) | `"join"` (cyan/teal)

**CSS classes to create in `star-button.css`:**
- `.star-btn` — base button: pill shape, bold, cursor pointer, smooth transitions, `position: relative`, `overflow: visible`
- `.star-btn--primary` — violet background `var(--color-primary)`, white text; hover: transparent background, violet text, violet glow shadow
- `.star-btn--join` — cyan/teal background; hover: transparent background, cyan text, cyan glow shadow
- `.star-btn--disabled` — reduced opacity, no pointer events
- `.star-btn__star` — each star wrapper: `position: absolute`, `z-index: -1`, width varies per star (25px / 15px / 5px / 8px / 15px / 5px)
- On `.star-btn:hover .star-btn__star` — each star moves to its hover position with matching transition timing from original:
  - Star 1: `top: -80%`, `left: -30%`, 1000ms, cubic-bezier(0.05,0.83,0.43,0.96)
  - Star 2: `top: -25%`, `left: 10%`, 1000ms, cubic-bezier(0,0.4,0,1.01)
  - Star 3: `top: 55%`, `left: 25%`, 1000ms, cubic-bezier(0,0.4,0,1.01)
  - Star 4: `top: 30%`, `left: 80%`, 800ms, cubic-bezier(0,0.4,0,1.01)
  - Star 5: `top: 25%`, `left: 115%`, 600ms, cubic-bezier(0,0.4,0,1.01)
  - Star 6: `top: 5%`, `left: 60%`, 800ms, ease-in-out
- Star fill color matches button variant — violet for primary, cyan for join
- Glow `drop-shadow` on `.star-btn:hover .star-btn__star` — matching fill color

**Usage in Dashboard.jsx:**
```jsx
<StarButton variant="primary" onClick={handlecreateMeeting} disabled={loading}>
  {loading ? "Creating…" : "Create Meeting"}
</StarButton>

<StarButton variant="join" onClick={handlejoinMeeting}>
  Join Meeting
</StarButton>
```

---

## MeetingCreatedModal Component Spec
File: `src/components/MeetingCreatedModal.jsx`

Inspired by the 21st.dev mission-success-dialog concept — a polished, animated modal with a success feel. NOT a copy — adapted for meeting context.

**Design concept to take from the reference:**
- Centered dialog on blurred dark overlay
- Framer-motion scale+fade entrance animation: `initial={{ opacity: 0, scale: 0.9, y: 20 }}` → `animate={{ opacity: 1, scale: 1, y: 0 }}`
- AnimatePresence for smooth exit
- Prominent visual element at top (icon or illustration area)
- Clean centered text layout — title, subtitle
- Action buttons at bottom

**Our content (different from reference):**
- Top icon area: large `Zap` icon from lucide-react in violet, with a soft violet glow behind it — no image
- Badge top-left: pill saying `"Meeting Ready"` with a `CheckCircle` icon — violet tinted
- Close button top-right: `X` icon, ghost style
- Title: `"Meeting Created!"` — bold, white
- Subtitle: `"Share the code with your participants"`
- Meeting code display: large monospace styled code pill — dark background, violet border, copyable
- Three action buttons (stacked):
  1. `"Copy Code"` — ghost style, calls `onCopy`
  2. `"Share Link"` — ghost style, calls `onShare`
  3. `"Join the Meeting"` — primary violet filled, calls `onJoin`
- Dismiss link at bottom — muted text, `onClick={onClose}`

**Props:**
```
{ isOpen, onClose, meetingCode, onCopy, onShare, onJoin }
```

**Usage in Dashboard.jsx:**
```jsx
<MeetingCreatedModal
  isOpen={showModal}
  onClose={() => setshowModal(false)}
  meetingCode={meetingCode}
  onCopy={handlecopy}
  onShare={handleshare}
  onJoin={() => navigate(`/meeting/${meetingCode}`)}
/>
```
Remove the old inline modal JSX block entirely.

**CSS classes in `meeting-created-modal.css`:**
- `.mcm-overlay` — fixed fullscreen, dark semi-transparent, `backdrop-filter: blur(8px)`, `z-index: var(--z-modal)`
- `.mcm-card` — centered, max-width 420px, dark card background `var(--color-surface)`, violet border, `border-radius: var(--radius-xl)`, `padding: 2rem`
- `.mcm-badge` — top-left absolute pill, violet tinted
- `.mcm-close` — top-right absolute icon button, ghost
- `.mcm-icon-area` — centered icon with soft radial violet glow behind
- `.mcm-title` — large bold white text
- `.mcm-subtitle` — muted smaller text
- `.mcm-code-pill` — monospace, dark bg, violet border, letter-spacing, large font
- `.mcm-actions` — flex column, gap, full width
- `.mcm-btn--ghost` — transparent, violet border, violet text, hover: slight violet bg
- `.mcm-btn--primary` — violet gradient fill, white text, glow shadow
- `.mcm-dismiss` — muted text, underline on hover, cursor pointer

All colors from CSS variables. No hardcoded hex.

---

## Dashboard Page Layout Spec
File: `src/pages/Dashboard.jsx` + `src/styles/Dashboard.css`

### Page Structure
```
.dash-page
  └── <Navbar /> (already imported — do not re-add)
  └── .dash-main
        ├── .dash-section-header
        │     ├── .dash-greeting
        │     └── .dash-greeting-sub
        ├── .dash-error (conditional)
        └── .dash-cards
              ├── .dash-card.dash-card--create
              └── .dash-card.dash-card--join
```

### Cards Design
Cards are the hero of this page. Make them visually striking:
- Dark glass-morphism card: `background: rgba(255,255,255,0.03)`, `backdrop-filter: blur(12px)`, violet border `var(--color-border)`, `border-radius: var(--radius-xl)`
- Hover: border brightens to `var(--color-primary)`, subtle violet glow shadow, slight upward translate
- Card icon area: large emoji in a glowing pill/circle — `.dash-card-icon--blue` gets violet glow, `.dash-card-icon--cyan` gets cyan/teal glow
- Card title: white, bold
- Card desc: muted, small
- Create card: `<StarButton variant="primary">` replaces old `dash-btn--primary`
- Join card: `<input class="dash-input">` stays, then `<StarButton variant="join">` replaces `dash-btn--join`

### `.dash-input` styles
- Full width, dark background `var(--color-surface)`, violet border on focus
- `border-radius: var(--radius-md)`, padding comfortable
- Text white, placeholder muted

### Section header
- `.dash-greeting`: large, bold, white — something warm and welcoming
- `.dash-greeting-sub`: muted, smaller

### Error state
- `.dash-error`: red-tinted pill, centered

---

## Responsive Requirements
- **1200px**: cards slightly smaller padding
- **992px**: cards stack vertically (flex-direction: column), cards become full width, centered
- **768px**: section header text smaller, `.dash-cards` full width
- **576px**: reduced horizontal padding, card padding tighter
- **480px**: StarButton full width, input full width, `.mcm-card` width 95vw
- Minimum tap target 44px for all buttons
- Modal always centered regardless of screen size

---

## Completion
1. List every created, modified, and deleted file with one-line summary
2. Mark `05-DASHBOARD` as `[x]` in `.docs/ROADMAP.md`
3. Write: `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP