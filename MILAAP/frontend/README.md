# Milap — Frontend (MILAAP/frontend)

Student innovation & collaboration platform for Chitkara University.

This version is intentionally written using only the core React concepts:
**functional components, props, useState, and plain CSS** — no Tailwind, no
Framer Motion, no Context API, no chart library. Animations are done with
plain CSS `@keyframes`. Charts are plain `<div>`s sized with inline styles.

**Color theme:** warm terracotta + mustard + parchment cream (`src/App.css`,
CSS variables at the top). No blue, purple, or black — picked to feel warm
and hand-styled rather than a generic tech/AI palette.

## Tech stack
- React 18 + Vite
- React Router v6 (for multi-page navigation)
- Axios (API layer, `src/services/api.js`)
- Plain CSS (`src/App.css`) — one stylesheet, CSS variables for the color theme

## How state is managed (no Context API)
`App.jsx` holds the logged-in `user` in a single `useState`. It's passed down
to every page as a **prop** (`user`, `onLogin`, `onRegister`, `onLogout`).
`ProtectedRoute.jsx` also just receives `user` as a prop and decides whether
to redirect to `/login`.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173 — register with any email/password as any role
(Student / Organizer / Judge) to see that role's dashboard.

## What's built

**Public:** Landing page (animated hero, stats, features, how-it-works),
Login/Register (role switch tabs), Event Discovery (search + filters), Event
Details, Team Formation Hub (skill-match %), Leaderboard.

**Student dashboard:** Dashboard, Performance Analysis (plain-CSS bar/trend
charts), Skill Gap Analysis, My Submissions, Profile.

**Organizer dashboard:** Dashboard + stats, Create Event form.

**Judge dashboard:** Assigned events, submission review + evaluation modal.

## Architecture notes
- `src/data/mockData.js` — all mock data + the skill-match/skill-gap logic
  (`computeMatch`, `computeSkillGap`). Swap these for real API calls later.
- `src/App.css` — every class used across the app, organized by section with
  comments. CSS variables at the top control the whole color theme.

## Next up
- Connect forms to the real Express + MongoDB backend (`src/services/api.js`
  already has the axios instance + JWT interceptor set up)
- Replace the mock skill-match function with a backend-computed score
