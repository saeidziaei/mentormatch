# Decision matrix — which verification flow?

## Firebase email-link (`sendEmailVerification`)

**Use when:** standard "verify your email" after signup, low-stakes
confirmation, you're fine with the user clicking a link in their inbox.

**Pros:** zero infra; Firebase sends the email; built-in expiry and replay
protection; `user.emailVerified` flag flips automatically.

**Cons:** clicking the link opens a new tab — bad UX on mobile, easy to lose
context; you can't customize the email beyond a template in the console;
there's no way to *block* signup completion until verification.

## Custom 6-digit OTP via transactional email (this skill)

**Use when:**
- Signup must be **blocked** until email is verified (no Auth user created
  yet).
- Step-up auth on a sensitive action — re-confirm email before deleting
  account, changing password, downloading data.
- Password reset by **code** (preferred over link in mobile-heavy apps).
- You want full control over email design (your brand, your copy).

**Pros:** user never leaves the signup page; mobile-friendly (SMS-style code
input); custom branding; verification is part of the request, not a separate
out-of-band step.

**Cons:** you own rate limiting, hashing, TTL, attempt caps; you need a
transactional email provider (with secret/API key); 6-digit codes are weaker
than long random links — must be paired with attempt caps and TTL.

## Firebase Phone Auth

**Use when:** you want to verify a phone number, not email. Different
primitive — uses Firebase's reCAPTCHA + SMS pipeline. Out of scope for this
skill.

## SSO (Google, Apple, etc.)

**Use when:** the user already has a verified email at the provider. No
explicit verification step needed — `provider === "google.com"` implies
`emailVerified: true`. Pair with email-OTP only for non-SSO signups.

## When in doubt

Default to Firebase email-link. Only reach for custom OTP when one of the
"use when" bullets actually applies — most apps don't need it.
