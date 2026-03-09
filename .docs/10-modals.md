# PAGE-10 — AI Interview Modals

## Task
Redesign `src/components/CreateAIInterviewModal.jsx` + `src/styles/AIModal.css`
Minimal update to `src/components/JoinAIInterviewModal.jsx`

---

## ABSOLUTE RULE — Logic Preservation
Do NOT touch any of this in either file:
- All API calls, useState, useEffect, useContext, useNavigate
- `isAuthorized` check + redirect to `/pricing`
- `createInterview()`, `copyCode()`, `shareCode()`, `handleJoin()`
- `navigate()` calls — all routes preserved
- `disabled={loading}` on Join button
- `setCreatedCode`, `createdCode &&` conditional rendering
- `close?.()` prop usage
- All `alert()` calls

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables — no hardcoded hex
- No `cn()`, `clsx()`, `@/` alias, `@base-ui-components`
- `lucide-react` available
- `framer-motion` available for overlay + modal entrance only
- Relative imports only

---

## Output Contract
**Modify:** `src/components/CreateAIInterviewModal.jsx`, `src/components/JoinAIInterviewModal.jsx`, `src/styles/AIModal.css`
**Delete:** `src/styles/JoinAIInterviewModal.css` — merge everything into `AIModal.css`
**Update import in JoinAIInterviewModal.jsx:** change `import "../styles/JoinAIInterviewModal.css"` → `import "../styles/AIModal.css"`
**Never touch:** `src/api/axios.js`, `src/context/AuthContext.jsx`, any backend file

---

## PART A — CreateAIInterviewModal

### Design Concept
Inspired by Dashboard task's `MeetingCreatedModal` (mission-success-dialog style):
- Overlay: full screen, dark blurred backdrop
- Modal card: glassmorphism, violet border, scale+fade entrance
- Two views: **Form view** (before creation) and **Success view** (after `createdCode` is set)
- Outside click on overlay → `close()`

### JSX Changes

**1. Wrap overlay with AnimatePresence + motion.div:**
```jsx
import { motion, AnimatePresence } from "framer-motion";

// overlay becomes:
<motion.div
  className="aim-overlay"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={close}
>
  <motion.div
    className="aim-modal"
    initial={{ opacity: 0, scale: 0.92, y: 16 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.92, y: 16 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    onClick={(e) => e.stopPropagation()}
  >
    {/* modal content */}
  </motion.div>
</motion.div>
```

**2. Class rename map:**
- `"ai-modal-overlay"` → `"aim-overlay"`
- `"ai-modal"` → `"aim-modal"`
- `"ai-modal-actions"` → `"aim-actions"`
- `"ai-btn"` → `"aim-btn"`
- `"ai-btn-secondary"` → `"aim-btn-secondary"`
- `"ai-code-section"` → `"aim-success"`
- `"ai-code-box"` → `"aim-code-pill"`
- `"ai-code-actions"` → `"aim-code-actions"`

**3. Form view — add icons to inputs (lucide-react):**
```jsx
import { Briefcase, FileText, Copy, Share2, X } from "lucide-react";

// Wrap each input in a .aim-input-group:
<div className="aim-input-group">
  <Briefcase size={16} className="aim-input-icon" />
  <input type="text" placeholder="Job Role" ... />
</div>

<div className="aim-input-group aim-input-group--textarea">
  <FileText size={16} className="aim-input-icon" />
  <textarea placeholder="Notes" ... />
</div>
```

**4. Success view — replace plain text code with styled pill + icon buttons:**
```jsx
{createdCode && (
  <div className="aim-success">
    <div className="aim-success-icon">
      {/* Zap icon, violet glow */}
    </div>
    <h3 className="aim-success-title">Interview Created!</h3>
    <p className="aim-success-sub">Share this code with the candidate</p>

    <div className="aim-code-pill">
      <span className="aim-code-text">{createdCode}</span>
    </div>

    <div className="aim-code-actions">
      <button className="aim-btn" onClick={copyCode}>
        <Copy size={15} /> Copy Code
      </button>
      <button className="aim-btn" onClick={shareCode}>
        <Share2 size={15} /> Share Link
      </button>
      <button className="aim-btn-secondary" onClick={close}>
        <X size={15} /> Close
      </button>
    </div>
  </div>
)}
```

---

## PART B — JoinAIInterviewModal

**Only one change** — add outside click close. All else untouched.

```jsx
// overlay div gets onClick={close}
// modal inner div gets onClick={(e) => e.stopPropagation()}
```

Optionally wrap with `motion.div` for same entrance animation as CreateAIInterviewModal (scale+fade) — this is allowed since it's purely decorative wrapper.

Class rename map (optional, for CSS unification):
- `"ai-modal-overlay"` → `"aim-overlay"`
- `"ai-modal"` → `"aim-modal"`
- `"ai-input"` → `"aim-input"`
- `"ai-modal-buttons"` → `"aim-actions"`
- `"ai-btn-primary"` → `"aim-btn"`
- `"ai-btn-secondary"` → `"aim-btn-secondary"`

---

## AIModal.CSS — Full Spec

### Overlay
```css
.aim-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal, 1000);
}
```

### Modal Card
```css
.aim-modal {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(124, 58, 237, 0.25);
  border-radius: var(--radius-xl);
  padding: 2rem;
  width: 440px;
  max-width: 92vw;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.aim-modal h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}
```

### Inputs
```css
.aim-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.aim-input-icon {
  position: absolute;
  left: 0.875rem;
  color: var(--color-text-muted);
  pointer-events: none;
  flex-shrink: 0;
}

.aim-input-group input,
.aim-input-group textarea,
.aim-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 0.75rem 0.875rem 0.75rem 2.5rem;
  color: var(--color-text);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 200ms, box-shadow 200ms;
  resize: none;
  font-family: inherit;
}

/* JoinModal input has no icon, no left padding override needed */
.aim-input {
  padding: 0.75rem 0.875rem;
}

.aim-input-group input:focus,
.aim-input-group textarea:focus,
.aim-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
}

.aim-input-group textarea {
  min-height: 90px;
}

.aim-input-group--textarea {
  align-items: flex-start;
}

.aim-input-group--textarea .aim-input-icon {
  top: 0.875rem;
}
```

### Buttons
```css
.aim-actions {
  display: flex;
  gap: 0.75rem;
}

.aim-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 200ms, opacity 200ms;
}

.aim-btn:hover {
  background: var(--color-primary-hover, #6d28d9);
}

.aim-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.aim-btn-secondary {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 200ms, color 200ms, background 200ms;
}

.aim-btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.25);
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.04);
}
```

### Success View
```css
.aim-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.aim-success-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.aim-success-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.aim-success-sub {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}

.aim-code-pill {
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: var(--radius-full, 9999px);
  padding: 0.5rem 1.5rem;
}

.aim-code-text {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.1em;
}

.aim-code-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  flex-wrap: wrap;
}

.aim-code-actions .aim-btn,
.aim-code-actions .aim-btn-secondary {
  flex: 1;
  min-width: 100px;
}
```

### Responsive
```css
@media (max-width: 480px) {
  .aim-modal {
    padding: 1.5rem;
  }

  .aim-code-actions {
    flex-direction: column;
  }

  .aim-actions {
    flex-direction: column;
  }
}
```

---

## Completion
1. List every modified/created/deleted file with one-line summary
2. Mark `PAGE-10` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP