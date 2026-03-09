# PAGE-10 — AI Interview Modals

## Task
Redesign styling only — `src/styles/AIModal.css`
Minimal structural changes to JSX — details below per file.

---

## ABSOLUTE RULE — DO THIS FIRST

Before touching anything, read the **EXACT ORIGINAL JSX** pinned below for both files.
The originals are the source of truth. Only change what is explicitly listed.
If something is not in the change list → leave it exactly as it is.

**NEVER touch in either file:**
- Any `useState`, `useEffect`, `useContext`, `useNavigate`, `useParams` call
- Any function body: `createInterview()`, `copyCode()`, `shareCode()`, `handleJoin()`
- Any `onChange` handler
- Any `onClick` handler — these stay as-is, only the element wrapping them may change
- Any `navigate()` call or route string
- Any `disabled={...}` prop
- Any `alert()` call
- Any `API.post(...)` call
- The `isAuthorized` check and `close?.()` calls
- The `createdCode &&` / `!createdCode &&` conditional rendering logic
- Any import that already exists

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables — no hardcoded hex
- No `cn()`, `clsx()`, `@/` alias
- `lucide-react` available
- `framer-motion` available for overlay + modal entrance ONLY
- Relative imports only

---

## Output Contract
**Modify:** `src/components/CreateAIInterviewModal.jsx`
**Modify:** `src/components/JoinAIInterviewModal.jsx`
**Create/Overwrite:** `src/styles/AIModal.css`
**In JoinAIInterviewModal.jsx:** change CSS import line only:
  `import "../styles/JoinAIInterviewModal.css"` → `import "../styles/AIModal.css"`
**Never touch:** `src/api/axios.js`, `src/context/AuthContext.jsx`, any backend file

---

## PART A — CreateAIInterviewModal

### Pinned Original JSX (READ THIS — do not deviate from logic)

```jsx
import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/AIModal.css";

export default function CreateAIInterviewModal({ close }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAuthorized = user?.role === "interviewer" || user?.role === "admin";
  const [jobRole, setJobRole] = useState("");
  const [note, setNote] = useState("");
  const [createdCode, setCreatedCode] = useState("");

  useEffect(() => {
    if (!user) return;
    if (!isAuthorized) { close?.(); navigate("/pricing"); }
  }, [close, isAuthorized, navigate, user]);

  const createInterview = async () => {
    if (!isAuthorized) { navigate("/pricing"); return; }
    try {
      const res = await API.post("/api/ai/create", { jobRole, note });
      setCreatedCode(res.data.aiCode);
    } catch (err) {
      alert(err.response?.data?.message || "Create interview failed");
    }
  };

  const copyCode = () => { navigator.clipboard.writeText(createdCode); alert("Code copied"); };
  const shareCode = () => {
    const link = `${window.location.origin}/ai/join/${createdCode}`;
    navigator.clipboard.writeText(link); alert("Share link copied");
  };

  if (user && !isAuthorized) return null;

  return (
    <div className="ai-modal-overlay">
      <div className="ai-modal">
        <h2>Create AI Interview</h2>
        {!createdCode && (
          <>
            <input type="text" placeholder="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
            <textarea placeholder="Notes" value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="ai-modal-actions">
              <button className="ai-btn" onClick={createInterview}>Create</button>
              <button className="ai-btn-secondary" onClick={close}>Cancel</button>
            </div>
          </>
        )}
        {createdCode && (
          <div className="ai-code-section">
            <h3>Interview Created</h3>
            <div className="ai-code-box">{createdCode}</div>
            <div className="ai-code-actions">
              <button className="ai-btn" onClick={copyCode}>Copy Code</button>
              <button className="ai-btn" onClick={shareCode}>Share</button>
              <button className="ai-btn-secondary" onClick={close}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Allowed Changes — CreateAIInterviewModal

**1. Add imports (top of file only):**
```jsx
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FileText, Copy, Share2, X, Zap } from "lucide-react";
```

**2. Wrap outer two divs with motion — ONLY these two tags change:**
```jsx
// BEFORE:
<div className="ai-modal-overlay">
  <div className="ai-modal">

// AFTER:
<motion.div
  className="ai-modal-overlay"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={close}
>
  <motion.div
    className="ai-modal"
    initial={{ opacity: 0, scale: 0.92, y: 16 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.92, y: 16 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    onClick={(e) => e.stopPropagation()}
  >
```
Close tags become `</motion.div>` instead of `</div>`.
classNames `"ai-modal-overlay"` and `"ai-modal"` stay exactly the same.

**3. Wrap inputs with icon groups — onChange handlers UNCHANGED:**
```jsx
// BEFORE:
<input type="text" placeholder="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
<textarea placeholder="Notes" value={note} onChange={(e) => setNote(e.target.value)} />

// AFTER:
<div className="aim-input-group">
  <Briefcase size={16} className="aim-input-icon" />
  <input type="text" placeholder="Job Role" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
</div>
<div className="aim-input-group aim-input-group--textarea">
  <FileText size={16} className="aim-input-icon" />
  <textarea placeholder="Notes" value={note} onChange={(e) => setNote(e.target.value)} />
</div>
```

**4. Add Zap icon before `<h3>` in success view:**
```jsx
// BEFORE:
<div className="ai-code-section">
  <h3>Interview Created</h3>

// AFTER:
<div className="ai-code-section">
  <div className="aim-success-icon"><Zap size={20} /></div>
  <h3>Interview Created</h3>
```

**5. Add icons inside success view buttons — onClick handlers UNCHANGED:**
```jsx
// BEFORE:
<button className="ai-btn" onClick={copyCode}>Copy Code</button>
<button className="ai-btn" onClick={shareCode}>Share</button>
<button className="ai-btn-secondary" onClick={close}>Close</button>

// AFTER:
<button className="ai-btn" onClick={copyCode}><Copy size={15} /> Copy Code</button>
<button className="ai-btn" onClick={shareCode}><Share2 size={15} /> Share Link</button>
<button className="ai-btn-secondary" onClick={close}><X size={15} /> Close</button>
```

**That is ALL for CreateAIInterviewModal. Every other line stays exactly as pinned above.**

---

## PART B — JoinAIInterviewModal

### Pinned Original JSX (READ THIS — do not deviate from logic)

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/JoinAIInterviewModal.css";

export default function JoinAIInterviewModal({ close }) {
  const [aiCode, setAiCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!aiCode.trim()) { alert("Enter interview code"); return; }
    try {
      setLoading(true);
      const res = await API.post(`/api/ai/verify/${aiCode}`);
      const data = res.data;
      if (res.data.status === "active") {
        navigate(`/ai/room/${aiCode}`, { state: { interviewId: res.data.interviewId } });
      } else {
        navigate(`/ai/upload-resume/${aiCode}`, {
          state: { interviewId: data.interviewId, jobRole: data.jobRole, interviewer: data.interviewer },
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to verify interview code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-modal-overlay">
      <div className="ai-modal">
        <h2>Join AI Interview</h2>
        <input
          type="text"
          placeholder="Enter AI Interview Code"
          value={aiCode}
          onChange={(e) => setAiCode(e.target.value)}
          className="ai-input"
        />
        <div className="ai-modal-buttons">
          <button className="ai-btn-primary" onClick={handleJoin} disabled={loading}>
            {loading ? "Verifying..." : "Join"}
          </button>
          <button className="ai-btn-secondary" onClick={close}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
```

### Allowed Changes — JoinAIInterviewModal

**1. Change CSS import line only:**
```jsx
// BEFORE:
import "../styles/JoinAIInterviewModal.css";
// AFTER:
import "../styles/AIModal.css";
```

**2. Add outside-click close on overlay — ONLY add onClick props:**
```jsx
// BEFORE:
<div className="ai-modal-overlay">
  <div className="ai-modal">

// AFTER:
<div className="ai-modal-overlay" onClick={close}>
  <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
```

**That is ALL for JoinAIInterviewModal.**
Do NOT rename any classNames. Do NOT add framer-motion. Do NOT add any icons.
Every other line stays exactly as pinned above.

---

## AIModal.css — Full File

This single file styles both modals.
Note: JoinModal uses `ai-btn-primary` — CSS must cover both `ai-btn` and `ai-btn-primary`.

```css
/* === OVERLAY === */
.ai-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal, 1000);
}

/* === MODAL CARD === */
.ai-modal {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(124, 58, 237, 0.25);
  border-radius: var(--radius-xl, 20px);
  padding: 2rem;
  width: 440px;
  max-width: 92vw;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ai-modal h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

/* === INPUT ICON GROUPS (CreateModal only) === */
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

.aim-input-group--textarea {
  align-items: flex-start;
}

.aim-input-group--textarea .aim-input-icon {
  top: 0.875rem;
}

/* === ALL INPUTS === */
.ai-modal input,
.ai-modal textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md, 12px);
  color: var(--color-text);
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  resize: none;
  box-sizing: border-box;
  transition: border-color 200ms, box-shadow 200ms;
}

/* CreateModal inputs — icon pushes text right */
.aim-input-group input,
.aim-input-group textarea {
  padding: 0.75rem 0.875rem 0.75rem 2.5rem;
}

/* JoinModal input — no icon */
.ai-input {
  padding: 0.75rem 0.875rem;
}

.ai-modal textarea {
  min-height: 90px;
}

.ai-modal input:focus,
.ai-modal textarea:focus {
  border-color: var(--color-primary, #7C3AED);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
}

/* === BUTTON ROWS === */
.ai-modal-actions,
.ai-modal-buttons {
  display: flex;
  gap: 0.75rem;
}

/* Primary — CreateModal uses .ai-btn, JoinModal uses .ai-btn-primary */
.ai-btn,
.ai-btn-primary {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: var(--radius-md, 12px);
  background: var(--color-primary, #7C3AED);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 200ms, opacity 200ms;
}

.ai-btn:hover,
.ai-btn-primary:hover {
  background: #6d28d9;
}

.ai-btn:disabled,
.ai-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Secondary */
.ai-btn-secondary {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md, 12px);
  background: transparent;
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: 0.875rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 200ms, color 200ms, background 200ms;
}

.ai-btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.25);
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.04);
}

/* === SUCCESS VIEW (CreateModal) === */
.ai-code-section {
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
  color: var(--color-primary, #7C3AED);
}

.ai-code-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.ai-code-box {
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: var(--radius-full, 9999px);
  padding: 0.5rem 1.5rem;
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-primary, #7C3AED);
  letter-spacing: 0.1em;
}

.ai-code-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  flex-wrap: wrap;
}

.ai-code-actions .ai-btn,
.ai-code-actions .ai-btn-secondary {
  flex: 1;
  min-width: 100px;
}

/* === RESPONSIVE === */
@media (max-width: 480px) {
  .ai-modal { padding: 1.5rem; }
  .ai-code-actions,
  .ai-modal-actions,
  .ai-modal-buttons { flex-direction: column; }
}
```

---

## Completion
1. List every modified/created file with one-line summary
2. Mark `MODAL-01` and `MODAL-02` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP