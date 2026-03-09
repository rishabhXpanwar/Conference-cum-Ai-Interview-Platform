# MeetPro — Task Router

## How to use this file
1. Find the active task ID from `ROADMAP.md`
2. Look up the task ID in the table below
3. Open the listed Instruction File
4. Only touch the files listed in "Output Files" — nothing else

---

## PHASE 0 — Global Infrastructure

| Task ID    | Instruction File              | Output Files                                                                 |
|------------|-------------------------------|------------------------------------------------------------------------------|
| INFRA-01   | `.docs/infra-01-html.md`      | `index.html`                                                                 |
| INFRA-02   | `.docs/infra-02-global-css.md`| `src/styles/global.css`                                                      |
| INFRA-03   | `.docs/infra-03-background.md`| `src/components/Background.jsx`, `src/styles/background.css`                 |
| INFRA-04   | `.docs/infra-04-navbar.md`    | `src/components/Navbar.jsx`, `src/styles/navbar.css`                         |
| INFRA-05   | `.docs/infra-05-alert.md`     | `src/components/Alert.jsx`, `src/styles/alert.css`                           |

---

## PHASE 1 — Public Pages

| Task ID    | Instruction File              | Output Files                                                                 |
|------------|-------------------------------|------------------------------------------------------------------------------|
| PAGE-01A   | `.docs/01a-home-hero.md`      | `src/pages/Home.jsx`, `src/styles/Home.css`, `src/components/ShaderBackground.jsx`, `src/components/MagnetizeButton.jsx` |
| PAGE-01B   | `.docs/01b-home-sections.md`  | `src/pages/Home.jsx`, `src/styles/Home.css`, `src/components/FeatureBento.jsx`, `src/components/HomeFooter.jsx`, `src/styles/home-footer.css` |
| PAGE-02    | `.docs/02-auth-pages.md`      | `src/pages/Login.jsx`, `src/styles/Auth.css`                                 |
| PAGE-03    | `.docs/02-auth-pages.md`      | `src/pages/Signup.jsx` (shares `Auth.css`)                                   |
| PAGE-04    | `.docs/04-pricing-page.md`    | `src/pages/Pricing.jsx`, `src/styles/Pricing.css`                            |

---

## PHASE 2 — Logged-In Pages

| Task ID    | Instruction File              | Output Files                                                                 |
|------------|-------------------------------|------------------------------------------------------------------------------|
| PAGE-05    | `.docs/05-dashboard.md`       | `src/pages/Dashboard.jsx`, `src/styles/Dashboard.css`                        |
| PAGE-06    | `.docs/06-ai-dashboard.md`    | `src/pages/AIDashboard.jsx`, `src/styles/AIDashboard.css`                    |
| PAGE-07    | `.docs/07-activity.md`        | `src/pages/Activity.jsx`, `src/styles/Activity.css`                          |
| PAGE-08    | `.docs/08-ai-activity.md`     | `src/pages/AIActivity.jsx`, `src/styles/AIActivity.css`                      |
| PAGE-09    | `.docs/09-resume-upload.md`   | `src/pages/ResumeUpload.jsx`, `src/styles/ResumeUpload.css`                  |

---

## PHASE 3 — Modal Components

| Task ID    | Instruction File              | Output Files                                                                 |
|------------|-------------------------------|------------------------------------------------------------------------------|
| MODAL-01   | `.docs/10-modals.md`          | `src/components/CreateAIInterviewModal.jsx`, `src/styles/AIModal.css`        |
| MODAL-02   | `.docs/10-modals.md`          | `src/components/JoinAIInterviewModal.jsx`, `src/styles/JoinAIInterviewModal.css` |

---

## PHASE 4 — Room Pages

| Task ID    | Instruction File              | Output Files                                                                 |
|------------|-------------------------------|------------------------------------------------------------------------------|
| ROOM-01    | `.docs/11-meeting-room.md`    | `src/pages/MeetingRoom.jsx`, `src/styles/MeetingRoom.css`                    |
| ROOM-02    | `.docs/12-ai-meeting-room.md` | `src/pages/AiMeetingRoom.jsx`, `src/styles/AiMeetingRoom.css`                |

---

## PHASE 5 — Polish

| Task ID    | Instruction File              | Output Files                                                                 |
|------------|-------------------------------|------------------------------------------------------------------------------|
| POLISH-01  | `.docs/13-polish.md`          | All page CSS files (responsive pass only)                                    |
| POLISH-02  | `.docs/13-polish.md`          | All pages with GSAP/framer-motion (animation audit only)                     |
| POLISH-03  | `.docs/00-design-tokens.md`   | `.docs/00-design-tokens.md` (token refinement only)                          |

---

## Quick Reference — Files the Agent Must NEVER Touch

```
/backend/**
src/main.jsx
src/App.jsx
src/context/AuthContext.jsx
src/socket.js
src/socketAI.js
src/api/axios.js
src/api/auth.js
src/components/protectedRoutes.jsx
src/components/MicWaveForm.jsx
src/components/AiWaveForm.jsx
```