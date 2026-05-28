# Mentormatch — Product Requirements Document

**Last updated:** 2026-05-27  
**Status key:** ✅ Done · 🔶 Partial · ⬜ Not started

---

## 1. Product Vision

Mentormatch is a premium K–12 tutoring marketplace based in Sydney, Australia. It connects parents and students with vetted tutors for academic improvement, confidence-building, and stress reduction around exams.

**Tone:** Modern, premium, trustworthy, simple, supportive.  
**Monetisation:** Platform commission on sessions booked through the marketplace.  
**Differentiation:** After every session, the tutor writes a lesson summary. The platform uses AI (Claude) to generate personalised multiple-choice quizzes for the student, drawing on the summary, the subject, and the student's past quiz history. Students earn points and badges for completing quizzes, creating an engaging learning loop that keeps students coming back and gives parents visibility into progress.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 18 + TypeScript + Tailwind CSS |
| Backend | Firebase Cloud Functions (gen 2, Node 20) |
| Database | Firestore (`australia-southeast1`) |
| Auth | Firebase Authentication |
| Email | Resend |
| Storage | Firebase Storage (profile photos) |
| Payments | Stripe *(not started)* |
| AI / LLM | Claude API (`claude-sonnet-4-6`) via Anthropic SDK *(not started)* |

---

## 3. Implemented Features

### 3.1 Authentication

- ✅ **Sign up** — two-step flow: email/password entry then 6-digit OTP verification via email
  - 10-minute code TTL, 30-second resend cooldown, 5 max attempts
  - Code hashed (SHA-256) before Firestore storage
  - Duplicate email detection before code send
- ✅ **Sign in** — email/password with Firebase Auth
- ✅ **Forgot password** — sends password reset email via Resend (anti-enumeration: no reveal of whether email exists)
- ✅ **Reset password** — oobCode from email link, confirm new password in UI
- ✅ **Auth context** — `user`, `isAdmin`, `loading` state; token refresh on login
- ✅ **Route guards** — `RequireAuth` (redirects to `/signup`) and `RequireAdmin` (admin claim check)

### 3.2 Email System

- ✅ **OTP verification email** — styled HTML template (DM Sans / Playfair Display), plain-text fallback
- ✅ **Password reset email** — styled HTML, anti-phishing double-link, 1-hour expiry notice
- ✅ **Dev fallback** — logs to console when no Resend API key is set
- 🔶 **Sender domain** — currently `onboarding@resend.dev`; needs to switch to verified Mentormatch domain before production

### 3.3 Tutor Onboarding

- ✅ **Profile builder** — multi-section form:
  - About You: first name, last name, bio (50–600 chars), profile photo upload (JPG/PNG ≤5 MB)
  - Courses: multi-select from AU K–12 curriculum grouped by stage (Primary, Junior, Senior)
  - Availability: per-day toggles with start/end time pickers
- ✅ **Cloud functions** — `upsertTutorProfile` (create/update) and `getMyTutorProfile` (fetch own profile)
- ✅ **Photo upload** — to Firebase Storage, URL stored in Firestore
- ✅ **Status tracking** — `pending` / `approved` / `rejected` on tutor document
- ✅ **Validation** — all required fields, ≥1 course, ≥1 available day, bio length

### 3.4 Admin Panel

- ✅ **Access control** — admin custom token claim; `claimAdminRole` bootstrap (email allowlist via `ADMIN_EMAILS` env var); `grantAdminRole` admin-to-admin promotion
- ✅ **Admin layout** — dark sidebar with navigation and user info
- ✅ **Tutor approval workflow** — lists all pending applications with full profile preview (photo, bio, courses, availability); approve or reject (with optional rejection reason); real-time list update after action
- 🔶 **Dashboard stats** — 4 stat cards scaffolded (Pending Tutors works; Total Users / Bookings / Revenue show "Coming soon")
- ⬜ **Admin Users page** — placeholder only
- ⬜ **Admin Bookings page** — placeholder only

### 3.5 Marketing Homepage

- ✅ **Navbar** — logo, auth-aware links (sign in / sign up when logged out; name + sign out when logged in), mobile hamburger menu
- ✅ **Hero** — headline, trust signals (WWCC, Qualifications, Identity, Online/In-Person, Ratings), two CTAs
- ✅ **Search bar** — UI with Subject / Year Level / Type dropdowns *(not connected to search results yet)*
- ✅ **How It Works** — 3-step section (Search Tutors → Chat & Compare → Book Your Session)
- ✅ **Featured Tutors Carousel** — horizontally scrollable cards with hardcoded mock data
- ✅ **Tutor card** — photo, name, rating, reviews, subjects, year levels, tags, trust icons, rate, availability, save button *(save button non-functional)*
- ✅ **Free Consultation CTA** — section with CTA button *(button non-functional)*
- ✅ **Footer** — multi-column links, social icons *(links are dummy anchors)*

---

## 4. Remaining Features

### 4.1 Tutor Discovery & Search

- ⬜ **Tutor listing page** (`/tutors`) — paginated or infinite-scroll grid of approved tutors
- ⬜ **Search filters** — subject, year level, location/suburb, online or in-person, price range, star rating, availability
- ⬜ **Connect SearchBar to results** — wire up homepage search bar to filter tutor listing page
- ⬜ **Tutor public profile page** (`/tutors/:id`) — full profile view for parents/students
- ⬜ **Sort options** — by rating, price (low/high), newest
- ⬜ **Save/favourite tutors** — heart button persists to user account

### 4.2 Tutor Dashboard (post-approval)

- ⬜ **Dashboard home** — overview stats (bookings, earnings, rating)
- ⬜ **Edit profile** — update bio, photo, courses, availability, hourly rate
- ⬜ **Manage availability** — calendar/schedule view
- ⬜ **View bookings** — upcoming and past sessions
- ⬜ **Earnings view** — total earnings, payout history
- ⬜ **Ratings & reviews received** — list of reviews from students

### 4.3 Student / Parent Account

- ⬜ **Student profile** — name, email, year level, subjects of interest
- ⬜ **Saved tutors list** — view and manage favourited tutors
- ⬜ **Booking history** — list of past and upcoming sessions
- ⬜ **Leave a review** — star rating + written review after session completes

### 4.4 Messaging / Chat

- ⬜ **Inbox** — list of conversations (student ↔ tutor)
- ⬜ **Chat thread** — real-time messaging (Firestore or Firebase Realtime DB)
- ⬜ **Notification badge** — unread message count in navbar

### 4.5 Booking System

- ⬜ **Book a session flow** — select date/time slot based on tutor availability, choose online or in-person, confirm
- ⬜ **Session management** — upcoming / completed / cancelled states
- ⬜ **Cancellation policy** — cancellation window, refund rules

### 4.6 Payments (Stripe)

- ⬜ **Stripe Connect** — tutor onboarding to receive payouts (Accounts v2)
- ⬜ **Checkout flow** — collect payment at booking (Stripe Checkout Session or Payment Element)
- ⬜ **Platform commission** — split payment, take commission before tutor payout
- ⬜ **Webhooks** — handle `payment_intent.succeeded`, `account.updated`, etc.
- ⬜ **Payouts** — scheduled tutor payouts via Stripe Connect
- ⬜ **Admin revenue view** — total platform revenue, pending payouts

### 4.7 Ratings & Reviews

- ⬜ **Post-session review prompt** — triggered after session is marked complete
- ⬜ **Star rating + written review** — stored per session, linked to tutor profile
- ⬜ **Tutor rating aggregation** — average star rating, review count on tutor card
- ⬜ **Admin review moderation** — flag/remove inappropriate reviews

### 4.8 Admin Panel (remaining)

- ⬜ **Admin Users page** — list all users, view profile, deactivate account
- ⬜ **Admin Bookings page** — view all bookings, resolve disputes
- ⬜ **Admin dashboard stats** — live data for Total Users, Bookings, Revenue
- ⬜ **Review moderation** — approve/remove flagged reviews

### 4.9 Notifications

- ⬜ **Email notifications** — booking confirmation, session reminder, review request
- ⬜ **In-app notifications** — new message, booking update, review received

### 4.10 AI-Powered Lesson Quizzes & Gamification

This is the core learning-loop differentiator. Every completed session produces a quiz; every quiz attempt earns the student points. The AI adapts question difficulty and topic weighting based on the student's history.

#### Session Wrap-Up (Tutor)

- ⬜ **Lesson summary form** — tutor submits after each session:
  - Free-text summary of what was covered (required, 50–1000 chars)
  - Topics covered (multi-select from subject's topic list or free-text tags)
  - Key concepts checklist (optional — highlights terms for the AI to quiz on)
  - Homework assigned (optional free text)
  - Tutor's private note on student progress (not shown to student)
- ⬜ **Submit triggers quiz generation** — on save, the `submitLessonSummary` function fires asynchronously; student is notified once the quiz is ready (usually within seconds)
- ⬜ **Tutor sees quiz status** — on the session card: "Quiz pending", "Quiz completed (4/5 correct)", or "Quiz expired"

#### AI Quiz Generation (Backend)

- ⬜ **`generateQuiz` Cloud Function** — called internally by `submitLessonSummary`; orchestrates the Claude API call and stores the result
- ⬜ **Claude prompt design**:
  - System prompt: role as K–12 educational quiz writer, output format (strict JSON), instruction to vary difficulty, instruction to write clear, age-appropriate language
  - User prompt includes: lesson summary, subject, year level, topics covered, last N quiz attempts with per-question answers and scores (N = 10, configurable)
  - AI adjusts: if recent accuracy > 80% → harder questions; if < 50% → easier reinforcement questions; always includes at least one question on a topic the student got wrong in a recent quiz
- ⬜ **Output schema** — AI returns a JSON array of questions, each with:
  - `id` (UUID), `question` (string), `options` (`{ A, B, C, D }`), `correctAnswer` (`A`–`D`), `explanation` (shown after attempt), `difficulty` (`easy` | `medium` | `hard`), `topic` (string)
- ⬜ **Default question count** — 5 questions per session (configurable per subject or tutor)
- ⬜ **Output validation** — parse and validate AI JSON before saving; retry once on malformed response; log failures to admin
- ⬜ **Prompt caching** — cache the system prompt with Anthropic's prompt caching to reduce latency and cost
- ⬜ **Quiz expiry** — quizzes expire 7 days after generation; expired quizzes are read-only (student can view but not submit)

#### Quiz Taking (Student)

- ⬜ **Pending quiz notification** — in-app badge + email: "Your quiz for [Subject] with [Tutor] is ready"
- ⬜ **Quiz page** (`/quiz/:quizId`) — one question at a time, progress bar (e.g. "Question 3 of 5")
  - Four answer options displayed as large tap-friendly cards
  - No timer by default (relaxed, learning-focused mode)
  - "Next" button disabled until an option is selected
  - Answers locked once submitted — no going back
- ⬜ **Immediate per-question feedback** — after selecting, show correct/incorrect state and the AI-generated explanation before moving to next question
- ⬜ **Results screen** (`/quiz/:quizId/results`) — score summary, points earned, streak status, breakdown of each question (answer chosen vs correct answer), and a "View Lesson Summary" link
- ⬜ **Quiz history** — student can view all past quiz results from their dashboard

#### Gamification — Points

- ⬜ **Base points per correct answer**: 10 pts
- ⬜ **Difficulty multipliers**: easy ×1, medium ×1.5, hard ×2
- ⬜ **Perfect score bonus**: +25 pts (all questions correct in one quiz)
- ⬜ **Participation bonus**: +5 pts for completing any quiz (regardless of score) — rewards effort
- ⬜ **Streak bonus**: +5 pts per consecutive correct answer *within* a quiz (e.g. 3 in a row = +15 extra)
- ⬜ **Points are permanent** — no deductions; leaderboard/level is always rising

#### Gamification — Streaks

- ⬜ **Session streak** — counts how many consecutive sessions the student completed the quiz (resets if a quiz expires unanswered)
- ⬜ **Current streak displayed** on student dashboard with a flame icon and count
- ⬜ **Streak milestones**: notify and award badge at 3, 7, 14, 30 consecutive sessions

#### Gamification — Levels

- ⬜ **XP = total points** — level thresholds (e.g. Lv1 0–99 pts, Lv2 100–249 pts, Lv3 250–499 pts, Lv4 500–999 pts, Lv5 1000+ pts)
- ⬜ **Level names** — themed for students: Learner → Scholar → Achiever → Expert → Champion
- ⬜ **Level-up celebration** — animated modal when the student crosses a threshold

#### Gamification — Badges

| Badge ID | Name | Trigger |
|---|---|---|
| `first_quiz` | First Step | Complete first quiz |
| `perfect_score` | Flawless | Score 100% on any quiz |
| `streak_3` | On a Roll | 3-session streak |
| `streak_7` | Week Warrior | 7-session streak |
| `streak_14` | Fortnight Focus | 14-session streak |
| `streak_30` | Monthly Master | 30-session streak |
| `fast_learner` | Quick Study | Complete a quiz within 3 minutes |
| `comeback_kid` | Comeback Kid | Score 100% on a topic previously answered incorrectly |
| `subject_math` | Maths Ace | Score ≥80% on 5 maths quizzes |
| `subject_english` | Word Wizard | Score ≥80% on 5 English quizzes |
| `subject_science` | Science Star | Score ≥80% on 5 science quizzes |
| `century` | Century | Earn 100+ total points |
| `scholar` | Scholar | Reach Level 3 |

*(Add subject badges for each subject area as needed)*

- ⬜ **Badge display** — unlocked badges shown as coloured icons; locked shown as greyed-out silhouettes with "How to earn" tooltip
- ⬜ **Badge awarded email** — Resend email when a new badge is unlocked

#### Student Progress Dashboard

- ⬜ **Progress page** (`/dashboard/progress`) — full gamification view:
  - Total points, current level + XP bar to next level
  - Current streak + longest streak
  - Total quizzes completed, overall accuracy %
  - Per-subject accuracy breakdown (bar or ring chart)
  - Badge collection grid
  - Recent quiz history (last 10)
- ⬜ **Student dashboard home widget** — compact summary: level, streak, points, "You have a quiz ready" CTA

#### Tutor — Student Progress View

- ⬜ **Progress tab on student card** (in tutor dashboard) — tutor sees per-student:
  - Quiz completion rate (quizzes completed / quizzes sent)
  - Average accuracy over last N sessions
  - Topics the student is struggling with (lowest accuracy)
  - Topics the student is excelling at
  - Current streak
- ⬜ **Lesson summary history** — tutor can review their own past summaries

#### Parent Visibility

- ⬜ **Parent account type** — can be linked to a student account
- ⬜ **Parent dashboard** — read-only view of child's quiz results, progress, badges, and upcoming sessions
- ⬜ **Weekly progress email** — auto-sent to parent/guardian every Sunday: sessions this week, quizzes completed, points earned, streak

#### Admin — Quiz Management

- ⬜ **Admin quiz settings page** — configure defaults: question count, expiry days, difficulty weight, which subjects use AI quizzes
- ⬜ **Quiz failure log** — list of sessions where AI generation failed, with retry button
- ⬜ **Abuse / content moderation** — flag if AI output contains inappropriate content (automated check before saving)
- ⬜ **Override quiz** — admin can manually edit or delete a generated quiz

### 4.11 "Become a Tutor" Landing Page

- ⬜ **Marketing page** (`/become-a-tutor`) — value prop, how it works, FAQ, CTA to sign up as tutor

### 4.11 Production Hardening

- ⬜ **Firestore security rules** — current scaffold expires **2026-06-10**; replace with proper rules before that date
- ⬜ **Resend domain** — switch from `onboarding@resend.dev` to verified Mentormatch domain
- ⬜ **Firebase config** — replace placeholder `"demo"` values with real production config
- ⬜ **Algolia search** — index approved tutors for fast full-text search with filters (skill bundle available in `.agents/skills/algolia-search/`)
- ⬜ **Error monitoring** — Sentry or similar
- ⬜ **Analytics** — page views, conversion funnel

---

## 5. Routes

| Path | Component | Auth | Status |
|---|---|---|---|
| `/` | Home | Public | ✅ |
| `/signin` | SignIn | Public | ✅ |
| `/signup` | SignUp | Public | ✅ |
| `/forgot-password` | ForgotPassword | Public | ✅ |
| `/reset-password` | ResetPassword | Public | ✅ |
| `/tutor/onboard` | TutorOnboard | RequireAuth | ✅ |
| `/tutors` | TutorListing | Public | ⬜ |
| `/tutors/:id` | TutorProfile | Public | ⬜ |
| `/tutor/dashboard` | TutorDashboard | RequireAuth | ⬜ |
| `/become-a-tutor` | BecomeTutor | Public | ⬜ |
| `/dashboard` | StudentDashboard | RequireAuth | ⬜ |
| `/messages` | Inbox | RequireAuth | ⬜ |
| `/messages/:id` | ChatThread | RequireAuth | ⬜ |
| `/admin` | AdminDashboard | RequireAdmin | 🔶 |
| `/admin/tutors` | AdminTutors | RequireAdmin | ✅ |
| `/admin/users` | AdminUsers | RequireAdmin | ⬜ |
| `/admin/bookings` | AdminBookings | RequireAdmin | ⬜ |
| `/tutor/sessions/:sessionId/summary` | LessonSummaryForm | RequireAuth (tutor) | ⬜ |
| `/quiz/:quizId` | QuizTaker | RequireAuth (student) | ⬜ |
| `/quiz/:quizId/results` | QuizResults | RequireAuth (student) | ⬜ |
| `/dashboard/progress` | StudentProgress | RequireAuth | ⬜ |
| `/admin/quiz-settings` | AdminQuizSettings | RequireAdmin | ⬜ |

---

## 6. Cloud Functions

| Function | Status | Notes |
|---|---|---|
| `requestSignupCode` | ✅ | OTP generation, email send, rate limiting |
| `verifySignupCode` | ✅ | Code verify + Firebase user creation |
| `sendPasswordReset` | ✅ | Resend email with oobCode |
| `upsertTutorProfile` | ✅ | Create/update tutor profile |
| `getMyTutorProfile` | ✅ | Fetch own tutor doc |
| `claimAdminRole` | ✅ | Bootstrap admin from env allowlist |
| `grantAdminRole` | ✅ | Admin promotes another user |
| `listPendingTutors` | ✅ | Admin: list pending applications |
| `reviewTutor` | ✅ | Admin: approve/reject application |
| `listApprovedTutors` | ⬜ | Public tutor search/listing |
| `bookSession` | ⬜ | Create booking document |
| `cancelSession` | ⬜ | Cancel with refund rules |
| `createStripeAccount` | ⬜ | Tutor Stripe Connect onboarding |
| `createCheckoutSession` | ⬜ | Student payment at booking |
| `stripeWebhook` | ⬜ | Handle Stripe events |
| `submitReview` | ⬜ | Post-session review |
| `sendMessage` | ⬜ | Chat message (if using Functions) |
| `sendBookingConfirmation` | ⬜ | Booking email notification |
| `submitLessonSummary` | ⬜ | Tutor submits post-session summary; triggers quiz generation |
| `generateQuiz` | ⬜ | Internal — calls Claude API, validates output, writes quiz doc |
| `getStudentQuizzes` | ⬜ | Student fetches pending + completed quizzes |
| `submitQuizAnswers` | ⬜ | Score attempt, award points, evaluate badge triggers, update streak |
| `getStudentProgress` | ⬜ | Fetch points, level, streak, badges for student dashboard |
| `getTutorStudentProgress` | ⬜ | Tutor views a specific student's quiz history and accuracy |
| `getParentProgress` | ⬜ | Parent reads linked student's progress (read-only) |
| `sendWeeklyProgressEmail` | ⬜ | Scheduled (Sunday) — Resend email to parent with weekly summary |
| `retryQuizGeneration` | ⬜ | Admin retries a failed quiz generation for a session |

---

## 7. Data Models (Firestore)

> Schema for collections introduced by the AI quiz feature. Other collections (users, tutors, bookings) to be defined when those features are built.

### `sessions/{sessionId}`
```
tutorId: string
studentId: string
subject: string
yearLevel: string
scheduledAt: timestamp
completedAt: timestamp | null
status: 'upcoming' | 'completed' | 'cancelled'
lessonSummary: {
  text: string                  // tutor's written summary
  topicsCovered: string[]       // tags / topic labels
  keyConcepts: string[]         // optional highlighted terms
  homeworkAssigned: string      // optional
  tutorPrivateNote: string      // not shown to student
  submittedAt: timestamp
} | null
quizId: string | null           // set once quiz is generated
```

### `quizzes/{quizId}`
```
sessionId: string
studentId: string
tutorId: string
subject: string
yearLevel: string
generatedAt: timestamp
expiresAt: timestamp            // generatedAt + 7 days
status: 'pending' | 'completed' | 'expired'
completedAt: timestamp | null
questions: [{
  id: string                    // UUID
  question: string
  options: { A: string, B: string, C: string, D: string }
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string           // shown after student answers
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string                 // e.g. "quadratic equations"
}]
aiContext: {
  pastQuizzesConsidered: number
  adaptiveNotes: string         // e.g. "reinforced fractions (3 wrong recently)"
}
```

### `quizAttempts/{attemptId}`
```
quizId: string
studentId: string
sessionId: string
answers: { [questionId]: 'A' | 'B' | 'C' | 'D' }
correctCount: number
totalQuestions: number
score: number                   // 0–100
pointsEarned: number
timeTakenSeconds: number
completedAt: timestamp
streakAtCompletion: number      // session streak value when this was submitted
```

### `studentProgress/{userId}`
```
totalPoints: number
level: number                   // 1–5 (derived from totalPoints)
currentStreak: number           // consecutive sessions with quiz completed
longestStreak: number
lastQuizCompletedAt: timestamp | null
totalQuizzesCompleted: number
totalQuestionsAnswered: number
totalCorrectAnswers: number
badges: string[]                // badge IDs
subjectProgress: {
  [subject: string]: {
    points: number
    quizzesCompleted: number
    correctAnswers: number
    totalAnswers: number
  }
}
```

### `badges` (hardcoded config, not a Firestore collection)
```
Defined in functions/src/quiz/badges.ts as a static map:
{ id, name, description, howToEarn, iconName }
Award logic lives in submitQuizAnswers function.
```

---

## 8. Known Issues / Technical Debt / Technical Debt

| Item | Priority |
|---|---|
| Firestore security rules expire **2026-06-10** — auto-locks database | 🔴 High |
| Resend sender domain still `onboarding@resend.dev` — deliverability risk in production | 🟠 Medium |
| Firebase client config uses placeholder `"demo"` values — breaks production | 🔴 High |
| Homepage SearchBar not connected to any search result page | 🟡 Low |
| TutorsCarousel uses hardcoded mock data | 🟡 Low |
| Footer links are non-functional (`#` anchors) | 🟡 Low |
| Admin dashboard stats (Users, Bookings, Revenue) not loading real data | 🟡 Low |
| Save/favourite tutor heart button non-functional | 🟡 Low |

---

## 8. Next Priorities (Suggested Order)

1. **Fix Firestore rules** — deadline 2026-06-10, non-negotiable
2. **Tutor listing + search page** — needed for any user acquisition
3. **Tutor public profile page** — needed for conversion
4. **"Become a Tutor" landing page** — needed for supply side
5. **Tutor dashboard** — tutors need post-approval experience
6. **Booking system** — core marketplace transaction
7. **Stripe payments** — monetisation
8. **Lesson summary + AI quiz generation** — core differentiator; unlocks the learning loop
9. **Student quiz UI + gamification** — points, streaks, badges, progress dashboard
10. **Messaging/chat** — trust and communication
11. **Reviews & ratings** — social proof, ranking signal
12. **Parent account + weekly progress email** — retention and parental buy-in
13. **Production hardening** — Resend domain, real Firebase config, error monitoring
