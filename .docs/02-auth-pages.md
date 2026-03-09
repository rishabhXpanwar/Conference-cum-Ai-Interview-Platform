# PAGE-02 — Auth Pages (Login & Signup)

## Task
Redesign styling of the auth pages. The JSX logic and component structure are **already complete and working**.

Files to modify:
- `src/styles/Auth.css` — full redesign
- `src/components/AuthVisual.jsx` — add more orbiting tech icons, keep all existing structure
- `src/components/OtpInput.jsx` — CSS polish only (update its CSS file)

Files to **never touch**:
- `src/pages/Login.jsx` — complete, do not modify at all
- `src/pages/Signup.jsx` — complete, do not modify at all
- `src/api/auth.js`
- `src/context/AuthContext.jsx`

---

## What Already Exists — READ THIS CAREFULLY

Both `Login.jsx` and `Signup.jsx` already have full working code including:

### Helper components (already in Login.jsx and Signup.jsx):

**`RevealField`** — framer-motion box-reveal wipe animation. Wraps every form field.
Uses `className="auth-reveal-box"` for the wipe overlay — needs CSS.
```jsx
// Already exists in both files — do not recreate
function RevealField({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <motion.div
        className="auth-reveal-box"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: [0, 1, 1, 0] } : {}}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 0.6, 1] }}
        style={{ originX: 0 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
```

**`GlowInput`** — framer-motion mouse-tracking radial glow. Wraps every `<input>`.
Uses `className="auth-input-glow-wrap"` — needs CSS. Sets `style={{ background }}` via motion template (do not override with CSS background).
```jsx
// Already exists in both files — do not recreate
function GlowInput({ children }) {
  // ... framer-motion useMotionValue tracking
  // renders: <motion.div className="auth-input-glow-wrap" style={{ background }}>
}
```

### JSX structure already in place in both files:
```jsx
<div className="auth-page">
  <div className="auth-left">
    <AuthVisual />
  </div>
  <div className="auth-right">
    <div className="auth-glow" />
    <div className="auth-card">
      {/* all content wrapped in RevealField + GlowInput */}
    </div>
  </div>
</div>
```

### All CSS classes already used in JSX (every one needs styling in Auth.css):
`auth-page`, `auth-left`, `auth-right`, `auth-glow`, `auth-card`, `auth-brand`, `auth-brand-name`, `auth-heading`, `auth-subtext`, `auth-error`, `auth-form`, `auth-input`, `auth-input-glow-wrap`, `auth-reveal-box`, `auth-links-row`, `auth-link`, `auth-link--accent`, `auth-btn`, `auth-back-link`, `auth-otp-hint`, `auth-switch`

---

## PART A — AuthVisual.jsx — Add More Orbiting Icons

`src/components/AuthVisual.jsx` already exists with this structure:
```jsx
export default function AuthVisual() {
  return (
    <div className="auth-visual">
      <div className="auth-visual-rings">
        <span className="auth-ring auth-ring--1" />
        <span className="auth-ring auth-ring--2" />
        <span className="auth-ring auth-ring--3" />
        <span className="auth-ring auth-ring--4" />
        <span className="auth-ring auth-ring--5" />
      </div>
      <div className="auth-visual-center">
        <span className="auth-visual-text">MeetPro</span>
      </div>
      {/* 4 existing orbits: React, Node.js, JavaScript, CSS3 */}
      <div className="auth-orbit auth-orbit--1">
        <img className="auth-orbit-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React" />
      </div>
      <div className="auth-orbit auth-orbit--2">
        <img className="auth-orbit-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Node" />
      </div>
      <div className="auth-orbit auth-orbit--3">
        <img className="auth-orbit-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JS" />
      </div>
      <div className="auth-orbit auth-orbit--4">
        <img className="auth-orbit-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" alt="CSS" />
      </div>
    </div>
  );
}
```

**Add 4 more orbit divs after orbit--4:**
```jsx
<div className="auth-orbit auth-orbit--5">
  <img className="auth-orbit-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" alt="MongoDB" />
</div>
<div className="auth-orbit auth-orbit--6">
  <img className="auth-orbit-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" alt="Express" />
</div>
<div className="auth-orbit auth-orbit--7">
  <img className="auth-orbit-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg" alt="Socket.io" />
</div>
<div className="auth-orbit auth-orbit--8">
  <img className="auth-orbit-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5" />
</div>
```

That is the **only change** to AuthVisual.jsx. Rings and center text stay untouched.

---

## PART B — Auth.CSS — Full Redesign

Write complete `src/styles/Auth.css`. Dark violet theme. All colors via CSS variables.

### Page Layout

```css
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  background: var(--color-bg);
  font-family: var(--font-sans);
}

.auth-left {
  width: 50%;
  position: relative;
  overflow: hidden;
  background: rgba(124, 58, 237, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-right {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
}

@media (max-width: 992px) {
  .auth-left  { display: none; }
  .auth-right { width: 100%; }
}
```

### AuthVisual — rings

```css
.auth-visual {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-visual-rings {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.auth-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(124, 58, 237, 0.18);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: authRipple 4s ease-in-out infinite;
}

.auth-ring--1 { width: 150px;  height: 150px;  animation-delay: 0s;    opacity: 0.8; }
.auth-ring--2 { width: 260px;  height: 260px;  animation-delay: 0.6s;  opacity: 0.6; }
.auth-ring--3 { width: 370px;  height: 370px;  animation-delay: 1.2s;  opacity: 0.4; }
.auth-ring--4 { width: 480px;  height: 480px;  animation-delay: 1.8s;  opacity: 0.2; }
.auth-ring--5 { width: 590px;  height: 590px;  animation-delay: 2.4s;  opacity: 0.1; }

@keyframes authRipple {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50%       { transform: translate(-50%, -50%) scale(0.93); }
}

.auth-visual-center {
  position: relative;
  z-index: 2;
  text-align: center;
}

.auth-visual-text {
  font-size: 3rem;
  font-weight: var(--weight-bold);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}
```

### AuthVisual — orbiting icons (8 total)

```css
/* Parent wrapper rotates around center */
.auth-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
}

.auth-orbit--1 { animation: authOrbit  9s linear infinite;         animation-delay:  0s;    }
.auth-orbit--2 { animation: authOrbit 11s linear infinite reverse;  animation-delay: -2s;    }
.auth-orbit--3 { animation: authOrbit 13s linear infinite;          animation-delay: -4s;    }
.auth-orbit--4 { animation: authOrbit 10s linear infinite reverse;  animation-delay: -6s;    }
.auth-orbit--5 { animation: authOrbit 12s linear infinite reverse;  animation-delay: -1.5s;  }
.auth-orbit--6 { animation: authOrbit  8s linear infinite;          animation-delay: -3s;    }
.auth-orbit--7 { animation: authOrbit 14s linear infinite reverse;  animation-delay: -5s;    }
.auth-orbit--8 { animation: authOrbit 10s linear infinite;          animation-delay: -7s;    }

@keyframes authOrbit {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Icon — pushed to radius via margin-left, counter-rotated to stay upright */
.auth-orbit-icon {
  position: absolute;
  top: -17px; /* half of 34px to center vertically */
  width: 34px;
  height: 34px;
  display: block;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.07);
  padding: 4px;
  box-sizing: border-box;
}

/* Inner ring (orbits 1,2,5,6) — 120px from center */
.auth-orbit--1 .auth-orbit-icon,
.auth-orbit--2 .auth-orbit-icon,
.auth-orbit--5 .auth-orbit-icon,
.auth-orbit--6 .auth-orbit-icon {
  left: 120px;
  animation: authIconUpright  9s linear infinite;
}
.auth-orbit--2 .auth-orbit-icon,
.auth-orbit--5 .auth-orbit-icon {
  animation-direction: reverse;
}

/* Outer ring (orbits 3,4,7,8) — 180px from center */
.auth-orbit--3 .auth-orbit-icon,
.auth-orbit--4 .auth-orbit-icon,
.auth-orbit--7 .auth-orbit-icon,
.auth-orbit--8 .auth-orbit-icon {
  left: 180px;
  animation: authIconUpright 13s linear infinite;
}
.auth-orbit--4 .auth-orbit-icon,
.auth-orbit--7 .auth-orbit-icon {
  animation-direction: reverse;
}

@keyframes authIconUpright {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}
```

### Right panel — glow + card

```css
.auth-glow {
  position: absolute;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.09) 0%, transparent 65%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}

.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-2xl);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  backdrop-filter: blur(12px);
}

.auth-brand { text-align: center; }

.auth-brand-name {
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1.5px;
}

.auth-heading {
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
  margin: 0 0 0.25rem;
}

.auth-subtext {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.auth-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: var(--radius-md);
  color: #f87171;
  font-size: var(--text-sm);
  padding: 0.625rem 0.875rem;
}
```

### Form elements

```css
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

/* RevealField overlay box — framer-motion scaleX wipe */
.auth-reveal-box {
  position: absolute;
  inset: 0;
  background: var(--color-primary);
  z-index: 10;
  pointer-events: none;
  border-radius: var(--radius-md);
}

/* GlowInput wrapper — framer-motion sets background via inline style, do NOT set CSS background here */
.auth-input-glow-wrap {
  border-radius: var(--radius-md);
  padding: 1.5px;
}

.auth-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  padding: 0.75rem 1rem;
  outline: none;
  transition: border-color 200ms, box-shadow 200ms;
  box-sizing: border-box;
  display: block;
}

.auth-input::placeholder { color: var(--color-text-muted); }

.auth-input:focus {
  border-color: rgba(124, 58, 237, 0.6);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

.auth-links-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auth-link {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color 150ms;
  user-select: none;
}

.auth-link:hover        { color: var(--color-text); }
.auth-link--accent      { color: var(--color-primary); }
.auth-link--accent:hover { color: var(--color-accent-cyan); }

.auth-btn {
  width: 100%;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, rgba(109, 40, 217, 0.8) 100%);
  color: #fff;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  font-family: var(--font-sans);
  cursor: pointer;
  transition: opacity 200ms, transform 150ms;
  min-height: 44px;
}

.auth-btn:hover:not(:disabled)  { opacity: 0.88; transform: translateY(-1px); }
.auth-btn:active:not(:disabled) { transform: translateY(0); }
.auth-btn:disabled               { opacity: 0.5; cursor: not-allowed; }

.auth-back-link {
  display: block;
  text-align: center;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color 150ms;
  user-select: none;
}

.auth-back-link:hover { color: var(--color-primary); }

.auth-otp-hint {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
}

.auth-otp-hint strong {
  color: var(--color-text);
  font-weight: var(--weight-medium);
}

.auth-switch {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.auth-switch a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--weight-medium);
  transition: color 150ms;
}

.auth-switch a:hover { color: var(--color-accent-cyan); }
```

### Responsive

```css
@media (max-width: 768px) {
  .auth-card { padding: 2rem 1.5rem; }
}

@media (max-width: 480px) {
  .auth-right { padding: 1rem; }
  .auth-card  { padding: 1.5rem 1.25rem; border-radius: var(--radius-xl); }
  .auth-input { padding: 0.7rem 0.875rem; }
  .auth-btn   { padding: 0.75rem 1rem; }
}
```

---

## PART C — OtpInput CSS

Check `src/components/OtpInput.jsx` to find what CSS file it imports. Update that file with:

```css
.otp-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.otp-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.otp-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.otp-box {
  width: 48px;
  height: 52px;
  text-align: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: var(--weight-bold);
  font-family: var(--font-sans);
  outline: none;
  transition: border-color 200ms, box-shadow 200ms;
  caret-color: var(--color-primary);
}

.otp-box--filled {
  border-color: rgba(124, 58, 237, 0.6);
}

.otp-box:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.18);
}

.otp-separator {
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
}

@media (max-width: 480px) {
  .otp-box { width: 40px; height: 44px; font-size: 1rem; }
}
```

---

## Completion
1. List every created/modified file with one-line summary
2. Mark `PAGE-02` and `PAGE-03` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP