# MeetPro — Frontend Redesign Roadmap

## Status Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete — awaiting human review
- `[!]` Blocked or needs clarification

---

## PHASE 0 — Global Infrastructure

- [ ] **INFRA-01** — Global Setup: `index.html` (Plus Jakarta Sans font import, meta tags)
- [ ] **INFRA-02** — Global CSS: `src/styles/global.css` (CSS variables, reset, typography)
- [ ] **INFRA-03** — Background component: `src/components/Background.jsx` + `src/styles/background.css`
- [ ] **INFRA-04** — Navbar component: `src/components/Navbar.jsx` + `src/styles/navbar.css`
- [ ] **INFRA-05** — Alert component: `src/components/Alert.jsx` + `src/styles/alert.css`

---

## PHASE 1 — Public Pages

- [ ] **PAGE-01A** — Home Hero: ShaderBackground + MagnetizeButton + Glow buttons
- [ ] **PAGE-01B** — Home Sections: FeatureBento + AI steps + HomeFooter
- [x] **PAGE-02** — Login page: `src/pages/Login.jsx` + `src/styles/Auth.css`
- [x] **PAGE-03** — Signup page: `src/pages/Signup.jsx` (shares `Auth.css`)
- [ ] **PAGE-04** — Pricing page: `src/pages/Pricing.jsx` + `src/styles/Pricing.css`

---

## PHASE 2 — Logged-In Pages

- [ ] **PAGE-05** — Dashboard: `src/pages/Dashboard.jsx` + `src/styles/Dashboard.css`
- [ ] **PAGE-06** — AI Dashboard: `src/pages/AIDashboard.jsx` + `src/styles/AIDashboard.css`
- [ ] **PAGE-07** — Activity: `src/pages/Activity.jsx` + `src/styles/Activity.css`
- [ ] **PAGE-08** — AI Activity: `src/pages/AIActivity.jsx` + `src/styles/AIActivity.css`
- [ ] **PAGE-09** — Resume Upload: `src/pages/ResumeUpload.jsx` + `src/styles/ResumeUpload.css`

---

## PHASE 3 — Modal Components

- [ ] **MODAL-01** — Create AI Interview Modal: `src/components/CreateAIInterviewModal.jsx` + `src/styles/AIModal.css`
- [ ] **MODAL-02** — Join AI Interview Modal: `src/components/JoinAIInterviewModal.jsx` + `src/styles/JoinAIInterviewModal.css`

---

## PHASE 4 — Room Pages

- [x] **ROOM-01** — Meeting Room: `src/pages/MeetingRoom.jsx` + `src/styles/MeetingRoom.css`
- [ ] **ROOM-02** — AI Meeting Room: `src/pages/AiMeetingRoom.jsx` + `src/styles/AiMeetingRoom.css`

---

## PHASE 5 — Polish

- [ ] **POLISH-01** — Responsive pass: verify all breakpoints across all pages
- [ ] **POLISH-02** — Animation audit: GSAP + framer-motion consistency check
- [ ] **POLISH-03** — Revisit `00-design-tokens.md` — refine after all pages done