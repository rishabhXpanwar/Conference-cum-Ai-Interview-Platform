# PAGE-09 — Resume Upload Page

## Task
Redesign `src/pages/ResumeUpload.jsx` + `src/styles/ResumeUpload.css`.
- Background: add a nice dark atmospheric background
- "Start Interview" button: replace with StarButton
- Everything else: leave as-is — logic, layout, structure all good

---

## ABSOLUTE RULE — Logic Preservation
Do NOT touch any of this:
- `useParams`, `useNavigate`, `useLocation` hooks
- `handleUpload()` — all API call, loading, uploaded state, alert() calls
- `startInterview()` — navigate logic
- File input `onChange` — PDF validation, size check, setFile, setUploaded
- `disabled={loading}` on upload button
- `disabled={!uploaded}` on start interview button
- `file && <div className="file-preview">` conditional
- `selectedInterview` / `interviewId` from location.state
- All existing className strings EXCEPT `"start-interview-btn"` (renamed below)

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables — no hardcoded hex
- StarButton already exists at `src/components/StarButton.jsx` — import from there, do NOT recreate
- `lucide-react` available
- Relative imports only

---

## Output Contract
**Modify:** `src/pages/ResumeUpload.jsx`, `src/styles/ResumeUpload.css`
**Reuse:** `src/components/StarButton.jsx` (already exists — do NOT recreate)
**Never touch:** `src/api/axios.js`, any backend file

---

## JSX Changes

### 1. Import StarButton
```jsx
import StarButton from "../components/StarButton";
```

### 2. Background wrapper
Wrap the entire return in a new outer div:
```jsx
<div className="ru-bg">
  {/* existing resume-page content */}
</div>
```
Or rename `"resume-page"` → `"ru-page"` and add `"ru-bg"` as inner wrapper for the centered card.

Class rename map:
- `"resume-page"` → `"ru-page"`
- `"resume-box"` → `"ru-box"`
- `"file-input-label"` → `"ru-file-label"`
- `"file-preview"` → `"ru-file-preview"`
- `"file-icon"` → `"ru-file-icon"`
- `"file-name"` → `"ru-file-name"`
- `"start-interview-btn"` → remove this className — StarButton handles its own styling

### 3. Replace Start Interview button
Replace:
```jsx
<button
  className="start-interview-btn"
  disabled={!uploaded}
  onClick={startInterview}
>
  Start Interview
</button>
```
With:
```jsx
<StarButton
  onClick={startInterview}
  disabled={!uploaded}
  variant="primary"
>
  Start Interview
</StarButton>
```
`disabled={!uploaded}` must stay — StarButton already handles `disabled:opacity-50 disabled:pointer-events-none` via its CSS.

---

## Prompt — Background

> **Usage rule: Design idea only — take the atmospheric dark background concept with floating orbs/glows. Do NOT use any Tailwind, cn(), or next-themes. Implement as pure CSS on `.ru-page`.**

This page has no Navbar — it's a standalone focused page (candidate joins via link).
Background should feel immersive and AI-themed.

Implement as pure CSS:

```css
/* Two large radial glow orbs — violet + cyan, slow float animation */
.ru-page {
  position: relative;
  overflow: hidden;
}

.ru-page::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
  opacity: 0.08;
  top: -200px;
  left: -200px;
  animation: ruOrb1 12s ease-in-out infinite alternate;
  pointer-events: none;
}

.ru-page::after {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-accent, #06b6d4) 0%, transparent 70%);
  opacity: 0.06;
  bottom: -150px;
  right: -150px;
  animation: ruOrb2 15s ease-in-out infinite alternate;
  pointer-events: none;
}

@keyframes ruOrb1 {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(60px, 40px) scale(1.1); }
}

@keyframes ruOrb2 {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-50px, -30px) scale(1.08); }
}
```

---

## Full CSS Spec

### Page
```css
.ru-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-bg);
  position: relative;
  overflow: hidden;
}
/* + ::before and ::after orbs above */
```

### Card
```css
.ru-box {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  width: 420px;
  max-width: 90vw;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ru-box h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.ru-box p {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 0;
}
```

### File Input Label
```css
.ru-file-label {
  display: inline-block;
  padding: 0.625rem 1.25rem;
  background: rgba(124, 58, 237, 0.08);
  color: var(--color-primary);
  border: 2px dashed var(--color-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: background 200ms, border-color 200ms;
}

.ru-file-label:hover {
  background: rgba(124, 58, 237, 0.15);
}

.ru-file-label input {
  display: none;
}
```

### File Preview
```css
.ru-file-preview {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: var(--radius-md);
  padding: 0.625rem 0.875rem;
  word-break: break-all;
}

.ru-file-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.ru-file-name {
  font-size: 0.875rem;
  color: #4ade80;
  font-weight: 500;
  text-align: left;
}
```

### Upload Button (the default `<button>`)
```css
.ru-box button:not(.star-btn) {
  padding: 0.75rem;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 200ms, opacity 200ms;
  width: 100%;
}

.ru-box button:not(.star-btn):disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### StarButton override — make it full width
```css
.ru-box .star-btn {
  width: 100%;
  justify-content: center;
}
```
*(StarButton renders with className `"star-btn"` — confirm from existing StarButton.jsx and adjust selector if needed)*

---

## Responsive
- Card already `max-width: 90vw` — handles mobile
- `480px` — padding 1.5rem, gap reduced

---

## Completion
1. List every modified file with one-line summary
2. Mark `PAGE-09` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP