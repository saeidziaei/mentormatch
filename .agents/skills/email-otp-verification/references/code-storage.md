# Code storage — Firestore doc shape

Codes live in a dedicated, lockdown-restricted Firestore collection. Default
name: `signupVerifications` (rename per-flow if you have multiple, e.g.
`passwordResetCodes`).

## Doc ID

```
sha256(email.toLowerCase()).hex
```

Why hashed:
- Safe to use as a Firestore doc ID (no `/`, no leading `.`).
- Doesn't leak which emails have pending verifications via list operations.
- Deterministic — `request` and `verify` find the same doc.

## Document fields

```ts
{
  email: string;            // for debugging / logs; lowercased
  codeHash: string;         // sha256(code).hex — never plaintext
  attempts: number;         // incremented on each wrong guess
  expiresAt: Timestamp;     // now + 10 min
  createdAt: Timestamp;     // server timestamp
  // Optional carryover from request → verify:
  displayName: string | null;
  // For Model B (user already created):
  uid?: string;
}
```

## TTL / cleanup

Firestore TTL policies: configure the `expiresAt` field on the
`signupVerifications` collection as a TTL field in the Firebase console. Docs
auto-delete within 24h of expiry.

Don't rely on TTL for **security** — your `verifyCode` function must check
`expiresAt < now` and reject manually. TTL is just garbage collection.

## Rate limits

Enforced in the request handler:

- **Resend cooldown:** if existing doc's `createdAt > now - 30s`, reject with
  `resource-exhausted`.
- **Per-email request cap:** optional — store a separate counter doc if you
  want to cap requests per hour. For most apps the 30s cooldown is enough.
- **Per-IP cap:** rarely needed; callable functions give you `req.rawRequest.ip`
  if you want to bucket. Skip unless under attack.

## Attempts

Enforced in the verify handler:

```ts
if (data.attempts >= MAX_ATTEMPTS) {
  await ref.delete();
  throw new HttpsError("resource-exhausted", ...);
}
if (data.codeHash !== hashCode(code)) {
  await ref.update({ attempts: FieldValue.increment(1) });
  throw new HttpsError("invalid-argument", ...);
}
```

Defaults:
- `MAX_ATTEMPTS = 5`
- After exceeding, **delete the doc** — force a fresh `requestSignupCode`.

## Firestore rules

The collection should be **locked**. Only the Admin SDK reads/writes:

```
match /signupVerifications/{id} {
  allow read, write: if false;
}
```

A catch-all `match /{document=**} { allow read, write: if false; }` covers
this implicitly — explicit blocks are clearer for security review.
