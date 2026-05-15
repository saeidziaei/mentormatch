# CLAUDE.md

## Project Overview

**Mentormatch** is a premium K–12 tutoring marketplace based in Sydney, Australia. It connects parents and students with vetted tutors for academic improvement, confidence-building, and stress reduction around exams.

The app is currently empty. Build it to feel **modern, premium, trustworthy, simple, and supportive** — not like a low-quality tutoring directory.

---

## Tech Stack & Project Layout

Three logically separate npm projects share one Firebase backend:

- `web/` — Vite + React 18 + TypeScript SPA. Connects to Functions via Firebase client SDK.
- `functions/` — Firebase Cloud Functions (gen 2, callable HTTPS), TypeScript, Node 20 runtime. Compiles to `functions/lib/`.

Firebase project: `mentormatch-cf770` (see `.firebaserc`). Firestore region: `australia-southeast1`.

---

## Commands

**Web (`web/`):**
- `npm run dev` — Vite dev server with HMR
- `npm run build` — type-check + production build to `dist/`
- `npm run preview` — preview production build

**Functions (`functions/`):**
- `npm run build` — compile TypeScript to `lib/`
- `npm run lint` — ESLint
- `npm run serve` — build then start function emulators
- `npm run deploy` — deploy functions (predeploy: lint + build)

**Whole project (repo root):**
- `firebase emulators:start` — start all emulators. Web auto-connects to `127.0.0.1:5001` when on localhost.
- `firebase deploy` — deploy everything (hosting + functions + firestore rules/indexes)

---

## Architecture Notes

**Client → Functions.** All backend logic is called via Firebase callable functions (`httpsCallable`). Backend functions use `onCall` from `firebase-functions/v2/https` and are exported from `functions/src/index.ts`. No manual HTTP/CORS wiring needed.

**Local dev.** `web/src/firebase.ts` detects localhost and connects to emulators automatically. The `firebaseConfig` uses placeholder `"demo"` values for local use only — real values are needed before production.

**Firestore rules.** Currently permissive scaffold expiring `2026-06-10`. Replace with proper rules before that date or the database auto-locks.

**Predeploy gate.** Functions deploys require passing `npm run lint && npm run build`. Fix lint errors; don't bypass.

**Skills reference.** `.agents/skills/` contains Firebase/Genkit skill bundles (firestore, auth, hosting, security-rules-auditor, etc.). Consult relevant skill when working on that subsystem.

---

## Core Business Model

- Tutors create profiles, set hourly rates and availability
- Parents/students search tutors, chat, and book sessions (online or in-person)
- Payments processed through the platform; platform takes a commission
- **All tutor profiles are PENDING until approved by admin**

---

## UI Styling (Tailwind CSS)

The web app uses Tailwind CSS for all styling.

### Rules:
- Always use Tailwind utility classes (no custom CSS unless absolutely necessary)
- Avoid inline styles (`style={{}}`) unless dynamic calculations require it
- Do not introduce CSS frameworks (e.g. Bootstrap, MUI)
- Prefer reusable UI patterns via composition, not CSS files

## Design System

Premium education startup aesthetic:

- Clean white backgrounds, soft modern color palette
- High-quality typography (distinctive display font paired with a refined body font — avoid Inter, Roboto, Arial)
- Mobile-first responsive design
- Minimal, confident UI with subtle animations and micro-interactions
- Calm and trustworthy feel

---

## Pages & Features to Build

### Homepage
- **Hero:** "Find the right tutor for better results, more confidence, and less stress."
- **CTAs:** Find a Tutor · Become a Tutor · Log In / Sign Up
- **How It Works (3 steps):** Pick Your Tutor → Chat With Your Instructor → Book Your Session
- **Featured Tutors Carousel:** photo, name, subjects, star rating, review count, availability badge, "Book Session" button
- **Trust signals:** Verified tutors · Real reviews · Confidence-building approach · Flexible online/in-person

### Find a Tutor Page
- Search filters: subject, year level, location/suburb, online or in-person, price range, rating, availability
- Tutor cards: rating, reviews, hourly rate, availability, teaching style, confidence tags
- Actions per card: Chat · Book Online · Book Face-to-Face

### Become a Tutor Page
- Value prop: set your own rates, choose availability, teach online or in-person, build reputation
- Onboarding steps: Create account → Verify postcode → Submit profile for approval
- Required profile fields: full name, photo, short bio, subjects, year levels, availability, hourly rate, teaching style, online/in-person preference

### Tutor Dashboard (post-login)
- Edit profile
- Manage availability
- View bookings
- Chat with students/parents
- View ratings & reviews
- View earnings

### Student/Parent Account (post-login)
- Search and save favourite tutors
- Chat with tutors
- Book and pay for sessions
- Leave ratings and reviews after sessions

### Admin Panel
- Approve/reject tutor applications
- Manage users and bookings
- Handle payments and commissions
- Moderate reviews

### Ratings & Reviews
- After each session: star rating + written review
- Higher-rated tutors rank higher in search results

---

## Future Features
- AI tutor tools (homework generation, topic suggestions, confidence trend analysis)
- AI-powered matching system
- Nationwide expansion