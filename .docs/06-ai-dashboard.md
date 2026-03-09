# PAGE-05 — AI Dashboard

## Task
Redesign `src/pages/AIDashboard.jsx` + `src/styles/AIDashboard.css`.

---

## ABSOLUTE RULE — Logic Preservation
JSX mein sirf yeh allowed hai:
1. `import` statements add karna
2. New wrapper `<div className="...">` add karna
3. Existing elements ki `className` change karna

Do NOT touch:
- `showCreate`, `showJoin` useState
- `setShowCreate(true)`, `setShowJoin(true)` onClick handlers
- `<CreateAIInterviewModal close={...} />`
- `<JoinAIInterviewModal close={...} />`
- `<Navbar />`

---

## Codebase Rules
- JSX only — no TypeScript, no `"use client"`
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables — no hardcoded hex
- No `cn()`, no `clsx()`, no `@/` alias, no `next-themes`
- Relative imports only
- `three` and `@splinetool/react-spline` — install these

---

## Output Contract
**Create:**
- `src/components/DottedSurface.jsx` + styles in `AIDashboard.css`
- `src/components/RobotSpline.jsx`

**Modify:** `src/pages/AIDashboard.jsx`, `src/styles/AIDashboard.css`

**Reuse:** `src/components/StarButton.jsx` (already created in Dashboard task)

**Never touch:** `src/components/CreateAIInterviewModal.jsx`, `src/components/JoinAIInterviewModal.jsx`, `src/components/Navbar.jsx`, any backend file

---

## Page Layout

Two column layout — left side robot, right side cards:

```
.ai-dashboard-page
  ├── <DottedSurface />         ← fixed background, z-index 0
  ├── <Navbar />                ← already there, untouched
  └── .ai-dashboard-main        ← position relative, z-index 1
        ├── .ai-dashboard-left  ← 50% width, robot lives here
        │     └── <RobotSpline />
        └── .ai-dashboard-right ← 50% width, cards live here
              ├── section header (h1 + subtitle)
              └── .ai-cards
                    ├── Create AI Interview card
                    └── Join AI Interview card
```

AIDashboard.jsx final structure:
```jsx
import DottedSurface from "../components/DottedSurface";
import RobotSpline from "../components/RobotSpline";
import StarButton from "../components/StarButton";

return (
  <>
    <DottedSurface />
    <Navbar />
    <div className="ai-dashboard-main">
      <div className="ai-dashboard-left">
        <RobotSpline />
      </div>
      <div className="ai-dashboard-right">
        <div className="ai-section-header">
          <h1 className="ai-greeting">AI Interview Studio</h1>
          <p className="ai-greeting-sub">Create or join an AI-powered interview session.</p>
        </div>
        <div className="ai-cards">

          {/* Create Card */}
          <div className="ai-card ai-card--create">
            <div className="ai-card-icon">🤖</div>
            <h3 className="ai-card-title">New AI Interview</h3>
            <p className="ai-card-desc">Start an AI-led interview session and get instant candidate evaluation.</p>
            <StarButton variant="primary" onClick={() => setShowCreate(true)}>
              Create AI Interview
            </StarButton>
          </div>

          {/* Join Card */}
          <div className="ai-card ai-card--join">
            <div className="ai-card-icon">🔗</div>
            <h3 className="ai-card-title">Join AI Interview</h3>
            <p className="ai-card-desc">Enter a session code to join an ongoing AI interview.</p>
            <StarButton variant="join" onClick={() => setShowJoin(true)}>
              Join AI Interview
            </StarButton>
          </div>

        </div>
      </div>
    </div>

    {showCreate && <CreateAIInterviewModal close={() => setShowCreate(false)} />}
    {showJoin && <JoinAIInterviewModal close={() => setShowJoin(false)} />}
  </>
);
```

---

## Prompt 1 — Dotted Wave Background (DottedSurface)

> **Usage rule: Convert exactly — TS→JSX. Remove `useTheme` and `next-themes` entirely — our app is always dark so hardcode particle colors to `[200, 200, 200]` (light dots on dark bg). Remove `cn()` → plain className string.**

```tsx
// dotted-surface.tsx — CONVERT THIS EXACTLY:
'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points[];
    animationId: number;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 2000, 10000);
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 355, 1220);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 0);
    containerRef.current.appendChild(renderer.domElement);
    const positions = [];
    const colors = [];
    const geometry = new THREE.BufferGeometry();
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(ix * SEPARATION - (AMOUNTX * SEPARATION) / 2, 0, iy * SEPARATION - (AMOUNTY * SEPARATION) / 2);
        if (theme === 'dark') { colors.push(200, 200, 200); } else { colors.push(0, 0, 0); }
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 8, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    let count = 0;
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const pos = geometry.attributes.position.array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          pos[i * 3 + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.1;
    };
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    animate();
    sceneRef.current = { scene, camera, renderer, particles: [points], animationId, count };
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.scene.traverse((object) => {
          if (object instanceof THREE.Points) {
            object.geometry.dispose();
            Array.isArray(object.material)
              ? object.material.forEach((m) => m.dispose())
              : object.material.dispose();
          }
        });
        sceneRef.current.renderer.dispose();
        if (containerRef.current && sceneRef.current.renderer.domElement)
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
    };
  }, [theme]);

  return <div ref={containerRef} className={cn('pointer-events-none fixed inset-0 -z-1', className)} {...props} />;
}
```

DottedSurface CSS (in `AIDashboard.css`):
- `.dotted-surface` — `position: fixed`, `inset: 0`, `z-index: 0`, `pointer-events: none`

---

## Prompt 2 — 3D Robot (RobotSpline)

> **Usage rule: Convert exactly — TS→JSX, remove `"use client"`. Use the exact Spline scene URL provided below. Fallback div should show a simple loading spinner using CSS animation, no external spinner library.**

```tsx
// interactive-3d-robot.tsx — CONVERT THIS EXACTLY:
'use client';
import { Suspense, lazy } from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex items-center justify-center bg-gray-900 text-white ${className}`}>
          <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
          </svg>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
```

RobotSpline.jsx usage — hardcode the scene URL inside the component:
```jsx
const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

export default function RobotSpline() {
  return <InteractiveRobotSpline scene={ROBOT_SCENE_URL} className="ai-robot-canvas" />;
}
```

CSS:
- `.ai-robot-canvas` — `width: 100%`, `height: 100%`
- `.ai-dashboard-left` — `position: relative`, full height, overflow hidden

---

## AIDashboard.CSS Design Spec

Same dark glassmorphism design language as Dashboard page.

- `.ai-dashboard-main` — `position: relative`, `z-index: 1`, `display: flex`, `min-height: 100vh`, padding-top for navbar height
- `.ai-dashboard-left` — `width: 50%`, `position: relative` — robot fills this
- `.ai-dashboard-right` — `width: 50%`, `display: flex`, `flex-direction: column`, `justify-content: center`, `padding: 4rem`
- `.ai-section-header` — margin-bottom before cards
- `.ai-greeting` — large bold white, gradient violet like Dashboard
- `.ai-greeting-sub` — muted small
- `.ai-cards` — `display: flex`, `flex-direction: column`, `gap: 1.5rem` — stacked vertically on right side
- `.ai-card` — same glassmorphism as `.dash-card` on Dashboard — `backdrop-filter: blur(12px)`, dark gradient bg, violet border, hover lift + glow
- `.ai-card-icon` — large emoji in glowing circle
- `.ai-card--create` icon glow — violet
- `.ai-card--join` icon glow — cyan/teal
- `.ai-card-title` — white bold
- `.ai-card-desc` — muted small

---

## Responsive Requirements
- **992px** — `.ai-dashboard-left` hidden (`display: none`), `.ai-dashboard-right` full width, cards flex-row
- **768px** — cards stack vertically, padding reduced
- **480px** — StarButton full width, tighter padding
- Min tap target 44px

---

## Completion
1. List every created/modified file with one-line summary
2. Mark `PAGE-05` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP