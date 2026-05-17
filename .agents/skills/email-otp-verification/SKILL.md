---
name: email-otp-verification
description: >-
  Builds and reasons about email-based verification flows — custom 6-digit OTP
  codes sent via transactional email providers (Resend, SendGrid). Use when
  adding email verification to signup, step-up auth, password reset codes, or
  any flow that needs to prove control of an email address. Covers provider
  choice, code storage shape, rate limiting, anti-enumeration, secret config,
  and the segmented OTP input pattern.
---

# Email OTP Verification

This skill is for verification flows that send a **6-digit numeric code to
email** and ask the user to type it in — distinct from Firebase's built-in
email-link verification (`sendEmailVerification`, `applyActionCode`).

If you've been asked to "send a verification code to the email" or "verify the
email before signup completes," this is the skill.

## Pick the right tool

Before writing code, decide which verification method actually fits — see
[references/decision-matrix.md](references/decision-matrix.md). Quick version:

| Need                                           | Use                                       |
| ---------------------------------------------- | ----------------------------------------- |
| Standard "verify your email" after signup      | Firebase email-link (`sendEmailVerification`) |
| **Verify before account is fully created**     | Custom OTP (this skill)                   |
| Step-up auth on sensitive action               | Custom OTP                                |
| Password reset via code (not link)             | Custom OTP                                |
| Phone verification                             | Firebase Phone Auth (different skill)     |

If Firebase's built-in link flow works, prefer it — less code, less to break.

## Workflow

1. **Pick the email provider** — see
   [references/email-providers.md](references/email-providers.md). For new
   projects, default to **Resend** (best DX, generous free tier).
2. **Decide when the Auth user is created** —
   [references/auth-user-timing.md](references/auth-user-timing.md). Most cases
   want the user created *after* verification.
3. **Write the backend** — copy
   [templates/emailVerification.ts](templates/emailVerification.ts) and edit
   the provider, sender, and final-user-creation block.
4. **Write the frontend** — drop in
   [templates/OtpInput.tsx](templates/OtpInput.tsx). It's a controlled
   component; the parent page handles submit.
5. **Configure the secret** —
   [references/secrets-and-config.md](references/secrets-and-config.md).
   Includes emulator fallback (log the code instead of sending).
6. **Audit against** —
   [references/anti-patterns.md](references/anti-patterns.md) before shipping.

## Core invariants

Every email-OTP flow in this codebase must satisfy these. If you can't, stop
and ask.

1. **Codes are never stored in plaintext.** Hash with SHA-256 before write.
2. **Codes expire.** Default TTL = 10 minutes.
3. **Attempts are capped.** Default = 5 wrong tries → invalidate the code.
4. **Resends are throttled.** Default cooldown = 30s per email.
5. **Codes are 6 digits, generated with `crypto.randomInt`** — never
   `Math.random`.
6. **The OTP collection is locked down in Firestore rules.** Only the Admin
   SDK touches it. No client read or write.
7. **Sender domain is verified in the provider** before production. Dev senders
   (`onboarding@resend.dev`) are rate-limited and break deliverability.

## Quick reference

- Code: `String(randomInt(0, 1_000_000)).padStart(6, "0")`
- Hash: `createHash("sha256").update(code).digest("hex")`
- Doc ID: `sha256(email.toLowerCase())` — avoids special-char issues, no PII
  in path
- TTL field: Firestore `Timestamp.fromMillis(Date.now() + 10*60*1000)`
- Front-end input: `autoComplete="one-time-code"` + `inputMode="numeric"` —
  triggers iOS/Android SMS suggestion and numeric keyboard
