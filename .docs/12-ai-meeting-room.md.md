# PAGE-12 — AI Meeting Room

## Task
Redesign `src/pages/AiMeetingRoom.jsx` + `src/styles/AiMeetingRoom.css`
Enhance `src/components/AiWaveForm.jsx` styling (CSS only)
Enhance `src/components/MicWaveForm.jsx` canvas color (one line change allowed)

This file contains critical real-time AI + WebRTC + Speech Recognition logic.
**TREAT EVERY LINE OF LOGIC AS PROTECTED.**

---

## ABSOLUTE RULE — Logic Preservation
Do NOT touch ANY of these — zero exceptions:

**Refs:**
`localVideoRef`, `localStream`, `peerConnections`, `recognitionRef`, `attentionInterval`, `silenceTimer`, `transcriptRef`, `answerSentRef`, `answerTimeout`, `timerInterval`, `aiStateRef`, `hasSpokenRef`, `isMountedRef`

**State:**
`remoteStreams`, `canSpeak`, `aiState`, `question`, `interviewId`, `isMuted`, `isVideoOff`, `warning`, `responseTimer`, `hasStartedSpeaking`, `micStream`, `timerNotice`, `timeLeft`, `isWarning`

**Functions — completely untouched:**
`loadModels()`, `initCamera()`, `startAttentionDetection()`, `setup()`, `createPeerConnection()`, `startNoResponseTimer()`, `speak()`, `toggleAudio()`, `toggleVideo()`, `startListening()`, `sendAnswer()`, `cleanup()`, `leaveInterview()`

**All socket events — untouched:**
`join-ai-room`, `ai-joined`, `ai-user-joined`, `ai-offer`, `ai-answer`, `ai-ice-candidate`, `ai:timer-started`, `ai:speaking`, `ai:thinking`, `ai-error`, `ai-completed`

**All useEffect hooks — untouched**

**All conditionals in JSX — untouched:**
- `role === "candidate"` checks
- `aiState === "thinking"`, `"speaking"`, `"listening"` checks
- `{warning && ...}`, `{timerNotice && ...}`, `{timeLeft && ...}`
- `{aiState === "listening" && !hasStartedSpeaking && ...}`
- `{remoteStreams.map(...)}`

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables — no hardcoded hex (except MicWaveform canvas color — see below)
- No `cn()`, `clsx()`, `@/` alias
- `framer-motion` and `lucide-react` available
- Relative imports only

---

## Output Contract
**Modify:** `src/pages/AiMeetingRoom.jsx`, `src/styles/AiMeetingRoom.css`, `src/components/AiWaveForm.jsx`, `src/components/MicWaveForm.jsx`
**Never touch:** `src/socketAI.js`, `src/api/axios.js`, `src/context/AuthContext.jsx`, any backend file

---

## PART A — TextShimmer Component

Create `src/components/TextShimmer.jsx` — convert from prompt below.

> **Usage rule: Convert exactly — TS→JSX, remove cn()/clsx(), remove "use client", keep all framer-motion animation logic identical. Always dark mode (remove dark: prefix conditionals — use dark values as defaults).**

```tsx
// FULL PROMPT — TextShimmer:
'use client';
import React, { useMemo, type JSX } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion(Component as keyof JSX.IntrinsicElements);

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}
```

**Converted JSX (what agent should produce):**
```jsx
import { useMemo } from "react";
import { motion } from "framer-motion";

export default function TextShimmer({
  children,
  as: Component = "p",
  className = "",
  duration = 2,
  spread = 2,
}) {
  const MotionComponent = motion(Component);

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={"text-shimmer " + className}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
      style={{
        "--spread": `${dynamicSpread}px`,
        backgroundImage: `var(--shimmer-bg), linear-gradient(var(--shimmer-base), var(--shimmer-base))`,
      }}
    >
      {children}
    </MotionComponent>
  );
}
```

CSS for TextShimmer (add to AiMeetingRoom.css):
```css
.text-shimmer {
  position: relative;
  display: inline-block;
  background-size: 250% 100%, auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-repeat: no-repeat, padding-box;

  /* Always dark mode values */
  --shimmer-base: #71717a;
  --shimmer-gradient: #ffffff;
  --shimmer-bg: linear-gradient(
    90deg,
    #0000 calc(50% - var(--spread)),
    var(--shimmer-gradient),
    #0000 calc(50% + var(--spread))
  );
}
```

---

## PART B — JSX Changes in AiMeetingRoom.jsx

### 1. Import TextShimmer
```jsx
import TextShimmer from "../components/TextShimmer";
```

### 2. Class rename map (existing elements only):
- `"ai-room"` → `"airm-page"`
- `"ai-top"` → `"airm-top"`
- `"ai-avatar"` → `"airm-avatar"`  (keep dynamic `${aiState}` class: `className={\`airm-avatar airm-avatar--${aiState}\`}`)
- `"ai-question"` → `"airm-question"`
- `"ai-videos"` → `"airm-videos"`
- `"ai-video"` → `"airm-video"`
- `"ai-controls"` → `"airm-controls"`
- `"candidate-wave"` → `"airm-candidate-wave"`
- `"ai-timer-notice"` → `"airm-timer-notice"`
- `"interview-timer"` → `"airm-timer"` (keep dynamic: `className={\`airm-timer ${isWarning ? "airm-timer--warning" : ""}\`}`)
- `"response-timer"` → `"airm-response-timer"`
- `"warning"` → `"airm-warning"`

### 3. Replace thinking/speaking text with TextShimmer:

Replace:
```jsx
{aiState === "thinking" && <span>🤔 Thinking...</span>}
{aiState === "speaking" && <span>AI</span>}
```

With:
```jsx
{aiState === "thinking" && (
  <TextShimmer duration={1.5} className="airm-shimmer">
    Thinking...
  </TextShimmer>
)}
{aiState === "speaking" && (
  <TextShimmer duration={2} className="airm-shimmer">
    AI Interviewer
  </TextShimmer>
)}
```

### 4. Replace question text with TextShimmer when thinking:

Replace:
```jsx
{aiState === "thinking"
  ? "AI is thinking..."
  : question || "Waiting for interview to start"}
```

With:
```jsx
{aiState === "thinking" ? (
  <TextShimmer duration={1.8} className="airm-question-shimmer">
    AI is thinking...
  </TextShimmer>
) : (
  question || "Waiting for interview to start"
)}
```

### 5. Enhance control buttons — add icons:
```jsx
import { Mic, MicOff, Video, VideoOff, LogOut } from "lucide-react";

// Mute button:
<button className="airm-ctrl-btn" disabled={!canSpeak} onClick={toggleAudio}>
  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
  <span>{isMuted ? "Unmute" : "Mute"}</span>
</button>

// Video button:
<button className="airm-ctrl-btn" onClick={toggleVideo}>
  {isVideoOff ? <Video size={18} /> : <VideoOff size={18} />}
  <span>{isVideoOff ? "Camera On" : "Camera Off"}</span>
</button>

// Leave button:
<button className="airm-ctrl-btn airm-ctrl-btn--leave" onClick={leaveInterview}>
  <LogOut size={18} />
  <span>Leave</span>
</button>
```

All `disabled` props stay exactly as before. Only className and inner content changes.

---

## PART C — AiWaveForm.jsx

Only className change — logic untouched:
- `"ai-wave"` → `"airm-ai-wave"`
- `active ? "active" : ""` stays as-is

```jsx
export default function AiWaveform({ active }) {
  return (
    <div className={`airm-ai-wave ${active ? "active" : ""}`}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
```

---

## PART D — MicWaveForm.jsx

**One allowed logic change:** canvas bar color from hardcoded `"#3b82f6"` → violet CSS variable value.

Replace:
```js
ctx.fillStyle = "#3b82f6";
```
With:
```js
ctx.fillStyle = "#7C3AED";
```

No other changes. `canvasRef`, `useEffect`, `AudioContext`, `analyser`, `draw()` — all untouched.

---

## AiMeetingRoom.CSS — Full Redesign

### Page Layout
```css
.airm-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  color: var(--color-text);
  position: relative;
  overflow: hidden;
}

/* Subtle background glow */
.airm-page::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-primary) 0%, transparent 70%);
  opacity: 0.05;
  top: -200px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 0;
}
```

### Top Section
```css
.airm-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 2rem 1rem;
  position: relative;
  z-index: 1;
}
```

### AI Avatar
```css
.airm-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.airm-shimmer {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### Question Display
```css
.airm-question {
  max-width: 700px;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: var(--radius-xl);
  padding: 1.25rem 1.75rem;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.airm-question-shimmer {
  font-size: 1.1rem;
}

.airm-response-timer {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-full, 9999px);
  padding: 0.25rem 0.875rem;
}
```

### Videos
```css
.airm-videos {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
}

.airm-video {
  width: 420px;
  height: 280px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  object-fit: cover;
}
```

### Warning
```css
.airm-warning {
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 999;
}
```

### Candidate Wave (MicWaveform wrapper)
```css
.airm-candidate-wave {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  z-index: 1;
}

.airm-candidate-wave p {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.mic-wave {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
}
```

### Controls
```css
.airm-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  position: relative;
  z-index: 1;
}

.airm-ctrl-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full, 9999px);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 200ms, border-color 200ms, opacity 200ms;
}

.airm-ctrl-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.airm-ctrl-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.airm-ctrl-btn--leave {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.25);
  color: #f87171;
}

.airm-ctrl-btn--leave:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}
```

### Timer
```css
.airm-timer {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.airm-timer--warning {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #f87171;
  animation: airmPulse 1s infinite;
}

@keyframes airmPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  50%       { box-shadow: 0 0 12px 2px rgba(239, 68, 68, 0.4); }
}
```

### Timer Notice (notification banner)
```css
.airm-timer-notice {
  position: fixed;
  top: 5rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  color: var(--color-text);
  padding: 0.75rem 1.125rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  z-index: 1000;
  animation: airmSlideIn 0.3s ease;
}

@keyframes airmSlideIn {
  from { transform: translateX(120%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
```

### AI Waveform
```css
.airm-ai-wave {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  height: 50px;
}

.airm-ai-wave span {
  width: 5px;
  height: 8px;
  border-radius: 3px;
  background: rgba(124, 58, 237, 0.3);
  transition: background 400ms;
}

/* Active: violet → animated */
.airm-ai-wave.active span {
  background: var(--color-primary);
  animation: airmAiWave 0.7s infinite ease-in-out;
}

.airm-ai-wave.active span:nth-child(1) { animation-delay: 0s; }
.airm-ai-wave.active span:nth-child(2) { animation-delay: 0.1s; }
.airm-ai-wave.active span:nth-child(3) { animation-delay: 0.2s; }
.airm-ai-wave.active span:nth-child(4) { animation-delay: 0.3s; }
.airm-ai-wave.active span:nth-child(5) { animation-delay: 0.2s; }
.airm-ai-wave.active span:nth-child(6) { animation-delay: 0.1s; }

@keyframes airmAiWave {
  0%, 100% { height: 8px; }
  50%       { height: 40px; }
}
```

---

## Responsive
```css
@media (max-width: 768px) {
  .airm-videos {
    flex-direction: column;
    gap: 0.75rem;
  }

  .airm-video {
    width: 100%;
    height: 200px;
  }

  .airm-question {
    font-size: 0.95rem;
    padding: 1rem;
  }

  .airm-controls {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .airm-ctrl-btn span {
    display: none; /* icon only on mobile */
  }

  .airm-ctrl-btn {
    padding: 0.625rem;
    border-radius: 50%;
  }
}
```

---

## Completion
1. List every modified/created file with one-line summary
2. Mark `PAGE-12` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP