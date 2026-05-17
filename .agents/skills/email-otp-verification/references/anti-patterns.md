# Anti-patterns

Audit against these before shipping.

## Cryptography & storage

- ❌ Storing the code in plaintext in Firestore.
  - ✅ `codeHash = sha256(code)`.
- ❌ Generating the code with `Math.random()`.
  - ✅ `crypto.randomInt(0, 1_000_000)` — cryptographically secure.
- ❌ Using a hardcoded code (`"123456"`) for "dev convenience."
  - ✅ Real random codes everywhere. In emulator, log the code so devs can
    read it — but generate it normally.
- ❌ Sequential or time-based codes (`Math.floor(Date.now() / 60000)`).
  - ✅ Per-request random.
- ❌ Storing the user's password in the verification doc.
  - ✅ Password stays in the client until `verifyCode` — sent in the same
    request body, never written to Firestore.

## Rate limiting & attempts

- ❌ No attempt cap — attackers can brute-force 1 million combos.
  - ✅ Max 5 wrong attempts → delete the doc, force fresh request.
- ❌ No resend cooldown — UI lets users hammer "resend" and spam someone's
  inbox.
  - ✅ 30s cooldown in the UI AND server-side check.
- ❌ No TTL — codes valid forever if never used.
  - ✅ 10 minutes. Configurable per flow.

## Anti-enumeration

- ❌ `requestCode` returns different error codes for "email exists" vs "email
  available" — attackers can probe.
  - Trade-off: for marketplace apps with public listings (like Mentormatch),
    enumeration risk is already low; clear UX wins.
  - For privacy-sensitive apps (medical, dating, finance), always return
    `{ ok: true }` regardless and silently no-op on duplicate emails.

## Email content

- ❌ Including the user's password or any PII in the verification email.
  - ✅ Just the code and a short note about expiry.
- ❌ Linking from the email back to the signup page with the code in the URL.
  - ✅ User types the code into the open browser tab. URL inclusion defeats
    the purpose of having a code at all.
- ❌ Sending from a free-domain `from:` address (`yourapp@gmail.com`).
  - ✅ Verified domain (`hello@yourapp.com`).

## Frontend

- ❌ A single `<input>` for all 6 digits.
  - ✅ Six segmented inputs — feels like SMS, paste works naturally, mobile
    keyboards behave better.
- ❌ Missing `autoComplete="one-time-code"`.
  - ✅ On iOS/Android, this surfaces the code from SMS suggestions
    automatically. Email codes don't auto-fill but the attribute is still
    correct semantically.
- ❌ Submitting the code on every digit change.
  - ✅ Auto-submit only when all 6 are filled, OR require explicit button
    click. Avoid mid-typing submits that produce errors.
- ❌ Storing the code in URL params, localStorage, or window.name.
  - ✅ Component state only.

## Operations

- ❌ Hardcoded API keys in source / committed `.env` files.
  - ✅ `defineSecret` + `firebase functions:secrets:set`.
- ❌ Using the provider's dev sender (`onboarding@resend.dev`) in production.
  - ✅ Verified sending domain. Dev senders silently fail for non-owner
    recipients.
- ❌ No Firestore TTL on the verification collection — docs pile up forever.
  - ✅ TTL policy on `expiresAt`. Cleanup is automatic.
- ❌ Treating verification doc reads/writes as "internal, who cares about
  rules" and leaving the collection world-readable.
  - ✅ Explicit `allow read, write: if false` in `firestore.rules`. Only the
    Admin SDK touches it.
