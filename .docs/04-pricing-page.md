# PAGE-04 — Pricing Page

## Task
Redesign `src/pages/Pricing.jsx` and `src/styles/Pricing.css`.

---

## ABSOLUTE RULE — Logic Preservation
JSX mein sirf yeh allowed hai:
1. `import` statements add karna
2. New wrapper `<div className="...">` add karna
3. Existing elements ki `className` change karna

Do NOT touch:
- `pricingPlans` array — data exactly as-is
- `isCustomPlan` logic
- `<a href="mailto:...">` — exact href preserved
- `<Link to="...">` — all routes preserved
- `.map()` structure
- Any conditional rendering

---

## Codebase Rules
- JSX only — no TypeScript
- Plain CSS only — no Tailwind, no inline `style={{}}`
- All colors via CSS variables from `global.css` — no hardcoded hex
- No `cn()`, no `clsx()`, no `@/` alias
- `framer-motion` available
- Relative imports only

---

## Output Contract
**Create:** `src/components/ShaderBackground.jsx`, `src/components/RippleButton.jsx`, `src/styles/ripple-button.css`
**Modify:** `src/pages/Pricing.jsx`, `src/styles/Pricing.css`
**Never touch:** Any backend file, `src/App.jsx`, `src/context/AuthContext.jsx`

---

## 21st.dev Prompt — animated-glassy-pricing

> **Usage rule: Mimic the design — glassy cards, WebGL shader background, ripple button. Content comes entirely from existing `Pricing.jsx` — do NOT use prompt's demo data. Convert TS→JSX, Tailwind→plain CSS.**

```tsx
// animated-glassy-pricing.tsx — KEY CONCEPTS TO EXTRACT:

// 1. ShaderCanvas — WebGL animated background
// Full GLSL shader code (copy EXACTLY — do not modify):
const vertexShaderSource = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
const fragmentShaderSource = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec3 uBackgroundColor;
  mat2 rotate2d(float angle){ float c=cos(angle),s=sin(angle); return mat2(c,-s,s,c); }
  float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
  vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
    vec2 diff = center-uv;
    float len = length(diff);
    len += variation(diff,vec2(0.,1.),5.,2.);
    len -= variation(diff,vec2(1.,0.),5.,2.);
    float circle = smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
    return vec3(circle);
  }
  void main(){
    vec2 uv = gl_FragCoord.xy/iResolution.xy;
    uv.x *= 1.5; uv.x -= 0.25;
    float mask = 0.0;
    float radius = .35;
    vec2 center = vec2(.5);
    mask += paintCircle(uv,center,radius,.035).r;
    mask += paintCircle(uv,center,radius-.018,.01).r;
    mask += paintCircle(uv,center,radius+.018,.005).r;
    vec2 v=rotate2d(iTime)*uv;
    vec3 foregroundColor=vec3(v.x,v.y,.7-v.y*v.x);
    vec3 color=mix(uBackgroundColor,foregroundColor,mask);
    color=mix(color,vec3(1.),paintCircle(uv,center,radius,.003).r);
    gl_FragColor=vec4(color,1.);
  }`;
// Canvas: fixed, full screen, z-index 0
// useRef for canvas, gl, program, uniform locations
// requestAnimationFrame render loop — uniform iTime, iResolution
// resize handler updates canvas.width/height + gl.viewport
// uBackgroundColor uniform = [0,0,0] (always dark in our app)
// cleanup: cancelAnimationFrame + removeEventListener on unmount

// 2. PricingCard — glassy card design concept:
// backdrop-blur, bg gradient from white/10 to white/5, border white/10
// Popular card: scale-105, ring, brighter bg, shadow-2xl
// Divider: gradient line (transparent → white/22 → transparent)
// CheckIcon: SVG with stroke, cyan/violet colored

// 3. RippleButton — JS click ripple effect:
// On click: get rect, calculate x/y/size, append ripple span
// Ripple span: absolute, border-radius 50%, scale 0→1 + opacity 1→0 via @keyframes
// Remove ripple from state after rippleDuration ms
// className passed through — button styles come from CSS
```

---

## ShaderBackground Component
Create `src/components/ShaderBackground.jsx` — extract ShaderCanvas from prompt, convert to JSX:
- Remove TypeScript annotations
- Remove dark mode detection — always use `uBackgroundColor = [0, 0, 0]` (our app is always dark)
- Keep all WebGL setup, render loop, resize handler, cleanup exactly as prompt
- `<canvas>` className: `.shader-bg-canvas`

CSS in `Pricing.css`:
```
.shader-bg-canvas — position fixed, top 0, left 0, width 100%, height 100%, z-index 0, display block
```

---

## RippleButton Component
Create `src/components/RippleButton.jsx` — extract only the `default` variant ripple logic:
- No TypeScript, no variant system — single simple button
- Props: `children`, `onClick`, `className`, `disabled`
- On click: calculate ripple position/size from `getBoundingClientRect`, add to state, remove after 600ms
- Ripple span: `position absolute`, `border-radius 50%`, CSS `@keyframes jsRipple` (scale 0→1, opacity 1→0)
- CSS in `ripple-button.css`

```css
/* ripple-button.css */
.ripple-btn — position relative, overflow hidden, cursor pointer, border none, isolate
.ripple-btn__effect — position absolute, border-radius 50%, pointer-events none, animation jsRipple 600ms ease-out forwards
@keyframes jsRipple — 0%: scale(0) opacity(1) → 100%: scale(1) opacity(0)
```

---

## Pricing.jsx Changes

Add these imports:
```jsx
import ShaderBackground from "../components/ShaderBackground";
import RippleButton from "../components/RippleButton";
```

Wrap existing return in:
```jsx
<div className="pricing-page">
  <ShaderBackground />
  {/* rest of existing JSX — position relative, z-index above canvas */}
</div>
```

Replace CTA buttons — keep all logic, only swap element + className:
- `<Link to="/signup" className="btn-primary pricing-cta">` → wrap in `<RippleButton className="pricing-cta pricing-cta--primary">` — keep `<Link>` inside
- `<a href="mailto:..." className="btn-glow pricing-cta">` → wrap in `<RippleButton className="pricing-cta pricing-cta--glow">` — keep `<a>` inside

Actually — RippleButton wraps the button visually. Simpler: just replace `<Link className="btn-primary pricing-cta">` with `<RippleButton tag approach>`. 

Simplest correct approach: add `onClick` ripple to existing buttons by wrapping:
```jsx
// existing:
<Link to="/signup" className="btn-primary pricing-cta">Get Started</Link>

// becomes:
<RippleButton className="pricing-cta-wrap">
  <Link to="/signup" className="btn-primary pricing-cta">Get Started</Link>
</RippleButton>
```
`.pricing-cta-wrap` — display contents or inline-block wrapper, position relative

---

## Pricing.CSS Design Spec

**Design concept from prompt:** Glassy cards on animated dark background. Cards have `backdrop-filter: blur(14px)`, subtle gradient fills, soft borders. Popular card elevated with ring + scale.

Our content mapping:
- `pricing-card--scale` (Scale Pack) = "Most Popular" equivalent — elevated treatment
- `pricing-card--starter` = secondary style
- `pricing-card--custom` = secondary style

```
.pricing-page — min-height 100vh, position relative, overflow-x hidden, dark bg fallback `var(--color-bg)`

.pricing-nav — position relative, z-index var(--z-overlay), flex row, space-between, align center, padding 1.5rem 8%, backdrop-blur

.pricing-brand — gradient text violet, bold, no underline

.pricing-hero — position relative, z-index 1, flex column, align center, padding 6rem 8% 4rem

.pricing-copy — text-align center, max-width 640px, margin-bottom 4rem
  .pricing-eyebrow — small uppercase violet pill label
  h1 — large 3rem, font-weight 300, gradient white→violet
  p — muted, 1.1rem

.pricing-grid — flex row, gap 2rem, justify center, flex-wrap wrap

.pricing-card — 
  backdrop-filter blur(14px)
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))
  border: 1px solid rgba(255,255,255,0.1)
  border-radius: var(--radius-xl)
  padding: 2rem
  flex: 1, max-width 320px
  display flex, flex-column
  transition: transform 300ms, box-shadow 300ms
  position relative

.pricing-card--scale (popular) —
  transform: scale(1.05)
  border-color: var(--color-primary) with low opacity
  box-shadow: 0 0 40px var(--color-primary) at very low opacity
  background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(255,255,255,0.05))

.pricing-badge — absolute top-left or top pill, small, violet bg, white text

.pricing-card h2 — 2.5rem, font-weight 200, white

.pricing-volume — muted small text

.pricing-description — muted, 0.9rem, flex-grow 1, margin-top auto

.pricing-amounts — margin 1.5rem 0
  — divider line above: gradient transparent→white/20→transparent, height 1px, margin-bottom 1.5rem
  .pricing-original — line-through, muted, small
  .pricing-discounted — large 2rem, bold, white

.pricing-cta (Link/a buttons) —
  btn-primary: violet gradient fill, white text, border-radius var(--radius-full), padding comfortable, text-align center, display block
  btn-glow: same + violet glow box-shadow

.pricing-cta-wrap — position relative, display block (for ripple overflow)
```

---

## Responsive
- **992px** — cards stack to single column, `pricing-card--scale` scale resets to 1
- **768px** — `.pricing-hero` padding reduced, h1 smaller 2rem
- **480px** — `.pricing-nav` padding tighter, brand only (hide nav actions or stack)
- Min tap target 44px on all buttons

---

## Completion
1. List every created/modified file with one-line summary
2. Mark `PAGE-04` as `[x]` in `.docs/ROADMAP.md`
3. Write: `TASK COMPLETE — AWAITING HUMAN REVIEW`
4. STOP