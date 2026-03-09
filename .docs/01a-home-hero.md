# PAGE-01A — Home Page: Hero Section

## Task
- Create `src/components/ShaderBackground.jsx`
- Create `src/components/MagnetizeButton.jsx`
- Modify `src/pages/Home.jsx` — hero section only
- Modify `src/styles/Home.css` — hero + button styles only

---

## ABSOLUTE RULE — Logic Preservation
Do NOT touch any of these:

**Refs:** `heroTagRef`, `heroHeadRef`, `heroSubRef`, `heroBtnRef`, `featSecRef`, `featCardsRef`, `aiSecRef`, `aiStepsRef`, `ctaSecRef`

**All useEffect blocks — completely untouched**

**All Link/navigate/href values — untouched:**
- `<Link to="/signup">`, `<Link to="/login">`, `<a href="#ai-section">`

**Features section, AI section, CTA section, Footer — DO NOT TOUCH in this phase**

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables — no hardcoded hex
- No `cn()`, `clsx()`, `@/` alias, `next-themes`, `"use client"`, `dark:` prefix
- `framer-motion` available
- `lucide-react` available
- Relative imports only
- No `Image` from next/image — use `<img>`
- No `Link` from next/link — use React Router `<Link>` or `<a>`

---

## Output Contract
**Create:**
- `src/components/ShaderBackground.jsx`
- `src/components/MagnetizeButton.jsx`

**Modify:**
- `src/pages/Home.jsx` — hero section JSX only
- `src/styles/Home.css` — add new classes, keep all existing

**Never touch:**
- `src/components/HeroScene.jsx`
- `src/components/Navbar.jsx`
- `src/context/AuthContext.jsx`
- `src/App.jsx`
- Features section, AI section, CTA, Footer JSX

---

## PART A — ShaderBackground

> **Usage rule: Convert exactly — TS→JSX, Tailwind class → plain CSS class `.shader-bg-canvas`. GLSL shader strings (vsSource + fsSource) copied exactly as-is. All WebGL logic identical.**

```tsx
// FULL PROMPT — shader-background.tsx:
import React, { useEffect, useRef } from 'react';

const ShaderBackground = () => {
  const canvasRef = useRef(null);

  const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  const fsSource = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    const float overallSpeed = 0.2;
    const float gridSmoothWidth = 0.015;
    const float axisWidth = 0.05;
    const float majorLineWidth = 0.025;
    const float minorLineWidth = 0.0125;
    const float majorLineFrequency = 5.0;
    const float minorLineFrequency = 1.0;
    const vec4 gridColor = vec4(0.5);
    const float scale = 5.0;
    const vec4 lineColor = vec4(0.4, 0.2, 0.8, 1.0);
    const float minLineWidth = 0.01;
    const float maxLineWidth = 0.2;
    const float lineSpeed = 1.0 * overallSpeed;
    const float lineAmplitude = 1.0;
    const float lineFrequency = 0.2;
    const float warpSpeed = 0.2 * overallSpeed;
    const float warpFrequency = 0.5;
    const float warpAmplitude = 1.0;
    const float offsetFrequency = 0.5;
    const float offsetSpeed = 1.33 * overallSpeed;
    const float minOffsetSpread = 0.6;
    const float maxOffsetSpread = 2.0;
    const int linesPerGroup = 16;

    #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
    #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
    #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
    #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

    float drawGridLines(float axis) {
      return drawCrispLine(0.0, axisWidth, axis)
            + drawPeriodicLine(majorLineFrequency, majorLineWidth, axis)
            + drawPeriodicLine(minorLineFrequency, minorLineWidth, axis);
    }

    float drawGrid(vec2 space) {
      return min(1.0, drawGridLines(space.x) + drawGridLines(space.y));
    }

    float random(float t) {
      return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
    }

    float getPlasmaY(float x, float horizontalFade, float offset) {
      return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec4 fragColor;
      vec2 uv = fragCoord.xy / iResolution.xy;
      vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

      float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
      float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

      space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
      space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

      vec4 lines = vec4(0.0);
      vec4 bgColor1 = vec4(0.1, 0.1, 0.3, 1.0);
      vec4 bgColor2 = vec4(0.3, 0.1, 0.5, 1.0);

      for(int l = 0; l < linesPerGroup; l++) {
        float normalizedLineIndex = float(l) / float(linesPerGroup);
        float offsetTime = iTime * offsetSpeed;
        float offsetPosition = float(l) + space.x * offsetFrequency;
        float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
        float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
        float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
        float linePosition = getPlasmaY(space.x, horizontalFade, offset);
        float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

        float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
        vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
        float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

        line = line + circle;
        lines += line * lineColor * rand;
      }

      fragColor = mix(bgColor1, bgColor2, uv.x);
      fragColor *= verticalFade;
      fragColor.a = 1.0;
      fragColor += lines;

      gl_FragColor = fragColor;
    }
  `;

  const loadShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error: ', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const initShaderProgram = (gl, vsSource, fsSource) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Shader program link error: ', gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    return shaderProgram;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) { console.warn('WebGL not supported.'); return; }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1.0,-1.0, 1.0,-1.0, -1.0,1.0, 1.0,1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const programInfo = {
      program: shaderProgram,
      attribLocations: { vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition') },
      uniformLocations: {
        resolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
        time: gl.getUniformLocation(shaderProgram, 'iTime'),
      },
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let startTime = Date.now();
    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(programInfo.program);
      gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
      gl.uniform1f(programInfo.uniformLocations.time, currentTime);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    return () => { window.removeEventListener('resize', resizeCanvas); };
  }, []);

  return <canvas ref={canvasRef} className="shader-bg-canvas" />;
};

export default ShaderBackground;
```

CSS (add to Home.css):
```css
.shader-bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
```

Placement in Home.jsx — first child inside `.home-container`:
```jsx
import ShaderBackground from "../components/ShaderBackground";
// <div className="home-container">
//   <ShaderBackground />   ← add here
//   ... rest unchanged
```

---

## PART B — MagnetizeButton

> **Usage rule: Convert exactly — TS→JSX, remove cn()/clsx(), remove @radix-ui/react-slot + shadcn Button + class-variance-authority. Keep all framer-motion particle animation logic identical. Style via plain CSS `.mag-btn`.**

```tsx
// FULL PROMPT — magnetize-button.tsx:
"use client"
import * as React from "react"
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { Magnet } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

function MagnetizeButton({ className, particleCount = 12, attractRadius = 50, ...props }) {
    const [isAttracting, setIsAttracting] = useState(false);
    const [particles, setParticles] = useState([]);
    const particlesControl = useAnimation();

    useEffect(() => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 360 - 180,
            y: Math.random() * 360 - 180,
        }));
        setParticles(newParticles);
    }, [particleCount]);

    const handleInteractionStart = useCallback(async () => {
        setIsAttracting(true);
        await particlesControl.start({
            x: 0, y: 0,
            transition: { type: "spring", stiffness: 50, damping: 10 },
        });
    }, [particlesControl]);

    const handleInteractionEnd = useCallback(async () => {
        setIsAttracting(false);
        await particlesControl.start((i) => ({
            x: particles[i].x,
            y: particles[i].y,
            transition: { type: "spring", stiffness: 100, damping: 15 },
        }));
    }, [particlesControl, particles]);

    return (
        <Button
            className={cn("min-w-40 relative touch-none", className)}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            {...props}
        >
            {particles.map((_, index) => (
                <motion.div
                    key={index}
                    custom={index}
                    initial={{ x: particles[index].x, y: particles[index].y }}
                    animate={particlesControl}
                    className="absolute w-1.5 h-1.5 rounded-full bg-violet-400 opacity-40"
                />
            ))}
            <span className="relative w-full flex items-center justify-center gap-2">
                <Magnet className="w-4 h-4" />
                {props.children}
            </span>
        </Button>
    );
}
export { MagnetizeButton }
```

Converted JSX (what agent should produce):
```jsx
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

export default function MagnetizeButton({
  children,
  className = "",
  particleCount = 12,
  onClick,
  ...props
}) {
  const [isAttracting, setIsAttracting] = useState(false);
  const [particles, setParticles] = useState([]);
  const particlesControl = useAnimation();

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  const handleInteractionStart = useCallback(async () => {
    setIsAttracting(true);
    await particlesControl.start({
      x: 0, y: 0,
      transition: { type: "spring", stiffness: 50, damping: 10 },
    });
  }, [particlesControl]);

  const handleInteractionEnd = useCallback(async () => {
    setIsAttracting(false);
    await particlesControl.start((i) => ({
      x: particles[i]?.x ?? 0,
      y: particles[i]?.y ?? 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    }));
  }, [particlesControl, particles]);

  return (
    <button
      className={"mag-btn " + (isAttracting ? "mag-btn--active " : "") + className}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onClick={onClick}
      {...props}
    >
      {particles.map((p, index) => (
        <motion.div
          key={index}
          custom={index}
          className="mag-particle"
          initial={{ x: p.x, y: p.y }}
          animate={particlesControl}
        />
      ))}
      <span className="mag-btn__inner">{children}</span>
    </button>
  );
}
```

CSS (add to Home.css):
```css
.mag-btn {
  position: relative;
  min-width: 160px;
  height: 48px;
  padding: 0 1.5rem;
  border-radius: var(--radius-full);
  border: 1px solid rgba(124, 58, 237, 0.4);
  background: rgba(124, 58, 237, 0.12);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  overflow: hidden;
  touch-action: none;
  transition: background 300ms, border-color 300ms;
}

.mag-btn--active {
  background: rgba(124, 58, 237, 0.22);
  border-color: rgba(124, 58, 237, 0.7);
}

.mag-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  opacity: 0.5;
  pointer-events: none;
}

.mag-btn--active .mag-particle { opacity: 1; }

.mag-btn__inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}

@media (max-width: 480px) {
  .mag-btn { width: 100%; min-width: unset; }
}
```

Placement in Home.jsx — replace primary CTA buttons ONLY:
```jsx
import MagnetizeButton from "../components/MagnetizeButton";

// Hero — replace <Link to="/signup" className="btn-primary hero-cta-primary">
<MagnetizeButton onClick={() => navigate("/signup")} className="hero-cta-primary">
  Start a Meeting
</MagnetizeButton>

// CTA section — replace <Link to="/signup" className="btn-primary cta-btn-primary">
<MagnetizeButton onClick={() => navigate("/signup")} className="cta-btn-primary">
  Get Started Free
</MagnetizeButton>
```

Note: `useNavigate` already imported in Home.jsx. Since MagnetizeButton is `<button>`, replace `<Link>` with `navigate()` onClick.

---

## PART C — Glow Buttons (Explore AI Mode + Sign In)

> **Usage rule: CSS only — do NOT change JSX element type, do NOT change href/to values. Just update CSS for `.hero-cta-secondary` and `.cta-btn-secondary`.**

```css
/* FROM PROMPT — uiverse.io glow button:
button {
  width: 165px; height: 62px; cursor: pointer; color: #fff;
  font-size: 17px; border-radius: 1rem; border: none;
  position: relative; background: #100720; transition: 0.1s;
}
button::after {
  content: ''; width: 100%; height: 100%;
  background-image: radial-gradient(circle farthest-corner at 10% 20%,
    rgba(255,94,247,1) 17.8%, rgba(2,245,255,1) 100.2%);
  filter: blur(15px); z-index: -1;
  position: absolute; left: 0; top: 0;
}
button:active {
  transform: scale(0.9) rotate(3deg);
  background: radial-gradient(circle farthest-corner at 10% 20%,
    rgba(255,94,247,1) 17.8%, rgba(2,245,255,1) 100.2%);
  transition: 0.5s;
}
*/
```

Apply to Home.css — update existing `.hero-cta-secondary` and `.cta-btn-secondary`:
```css
.hero-cta-secondary,
.cta-btn-secondary {
  position: relative;
  background: #100720;
  color: #fff;
  border: none;
  border-radius: var(--radius-lg);
  padding: 0.875rem 1.75rem;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  transition: transform 0.1s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hero-cta-secondary::after,
.cta-btn-secondary::after {
  content: '';
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(255, 94, 247, 1) 17.8%,
    rgba(2, 245, 255, 1) 100.2%
  );
  filter: blur(15px);
  z-index: -1;
  position: absolute;
  left: 0;
  top: 0;
}

.hero-cta-secondary:active,
.cta-btn-secondary:active {
  transform: scale(0.9) rotate(3deg);
  background: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(255, 94, 247, 1) 17.8%,
    rgba(2, 245, 255, 1) 100.2%
  );
  transition: 0.5s;
}

@media (max-width: 480px) {
  .hero-cta-secondary,
  .cta-btn-secondary {
    width: 100%;
    padding: 0.75rem 1.25rem;
  }
}
```

No JSX change — these elements stay as-is:
```jsx
<a href="#ai-section" className="btn-glow hero-cta-secondary">Explore AI Mode</a>
<Link to="/login" className="btn-glow cta-btn-secondary">Sign In</Link>
```

---

## Completion
1. List every created/modified file with one-line summary
2. Mark `PAGE-01A` as `[x]` in `.docs/ROADMAP.md`
3. `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP