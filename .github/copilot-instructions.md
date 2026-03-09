<!-- # Copilot Master Directives — MeetPro Frontend Redesign

---

## MANDATORY WORKFLOW — NEVER SKIP A STEP

Before writing a single line of code, execute this sequence in order:

1. Read `.docs/ROADMAP.md` → find the first task marked `[ ]`
2. Read `.docs/00-design-tokens.md` → load global design system
3. Read `.docs/00-task-router.md` → find which instruction file maps to this task
4. Read ONLY that specific task file (e.g. `.docs/01-home-page.md`)
5. Execute the task exactly as described
6. Mark task `[x]` in ROADMAP.md
7. Write: `TASK COMPLETE — AWAITING HUMAN REVIEW` → STOP

**Never read multiple task files in one session.**
**Never proceed to the next `[ ]` task without explicit human approval.**

---

## HARD LOCKS — NEVER TOUCH THESE FILES

```
/backend/**
src/main.jsx
src/App.jsx
src/context/AuthContext.jsx
src/socket.js
src/socketAI.js
src/api/axios.js
```

Exception: Only touch these if the active task's Output Contract explicitly lists them.

**Never change:**
- Socket event names (backend is locked to them)
- API endpoint URLs (backend is locked to them)
- `navigate()` destination paths
- `Link to=""` values

**Never create:**
- Files not listed in the active task's Output Contract
- New npm packages — check installed list in `00-design-tokens.md` first

---

## TECH STACK

- React 18 + Vite
- React Router v6
- Plain CSS only — NO Tailwind, NO CSS Modules, NO styled-components
- JSX only — NO TypeScript, NO .tsx files
- Auth: `AuthContext` → `{ user, login, logout, loading }`
- API: `src/api/axios.js` (token auto-attached, base URL from VITE_API_URL)
- Sockets: `/meeting` → `socket.js` | `/ai` → `socketAI.js` (both autoConnect: false)

---

## JSX MODIFICATION RULES

Agent MAY:
- Add new wrapper divs with new class names for styling purposes
- Rename existing class names if redesign requires it
- Add or remove className strings on existing elements
- Restructure JSX layout (move elements, wrap in new divs)

Agent must NEVER touch:
- onClick, onChange, onSubmit, onKeyDown handlers
- useState, useEffect, useContext, useRef logic
- axios API calls
- socket.emit / socket.on calls
- navigate(), Link to="" values
- Conditional rendering logic (ternary, &&)
- Props passed to child components

---

## CSS RULES

- Read `00-design-tokens.md` before writing any CSS
- Never hardcode hex colors — always use CSS variables
- Never use `style={{}}` inline in JSX — all styles go in .css files
- Never use `transition: all` — always list explicit properties
- Never use `!important`
- Never use backdrop-filter except on navbar and modals

**Style priority rule:**
- If the page instruction defines a component style → use page style
- If the page instruction does NOT define it → use global fallback from `00-design-tokens.md`

---

## THIRD-PARTY PROMPT HANDLING (21st.dev etc.)

When a page instruction contains a component prompt from 21st.dev or similar:

ALWAYS:
- Extract visual concept, animation logic, layout structure
- Convert Tailwind → our CSS variables
- Convert TypeScript → plain .jsx (remove ALL type annotations)
- Replace their colors with our CSS variables
- Replace their copy with MeetPro content

NEVER:
- Import from shadcn or /components/ui/ folder
- Use next-themes or useTheme (no Next.js here)
- Run npm install for packages already installed (check `00-design-tokens.md`)

---

## RESPONSE FORMAT — AFTER EVERY TASK

1. List every file modified with a one-line summary of what changed
2. Mark task `[x]` in ROADMAP.md
3. Write exactly: `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP — do not suggest or begin the next task -->