# When to create the Firebase Auth user

Two valid models for a verify-before-signup flow. Pick one deliberately.

## Model A: Create user *after* code verification (recommended)

Flow:
1. `requestSignupCode({ email, displayName? })` → check email isn't already
   in Auth; store hashed code in Firestore.
2. `verifySignupCode({ email, code, password, displayName? })` → on success,
   `admin.auth().createUser({ ..., emailVerified: true })`.
3. Client signs in with email/password.

**Pros**
- No "ghost" unverified users cluttering Auth.
- `user.emailVerified` is `true` from the start — no need to gate routes on
  it later.
- Failed signups leave no trace except the (short-lived) verification doc.

**Cons**
- Password travels in the `verifySignupCode` call. Fine over HTTPS; just don't
  log it.
- Backend has to handle `auth/email-already-exists` at create time as a
  fallback (race between code request and code verify).

## Model B: Create user *before* code verification

Flow:
1. Client calls `createUserWithEmailAndPassword` → user exists, unverified.
2. Backend sends code; stores hash.
3. `verifyCode` flips a custom claim or Firestore flag.
4. Routes/rules gate on the flag.

**Pros**
- Standard Firebase Auth Admin patterns; can use `admin.auth().updateUser({
  emailVerified: true })`.
- Client password never leaves the SDK.

**Cons**
- Unfinished signups leave permanent Auth records — needs a sweep job.
- Every route/rule has to check verified status — easy to forget.
- Conflicts with "signup is not complete until verified" requirement: the user
  technically *has* an account.

## Heuristic

- "Signup isn't complete until verified" → **Model A**.
- "User can browse/use the app but must verify within 7 days" → **Model B**.

## Other auth providers

If the user signed up via Google/Apple/etc, **skip OTP entirely** — those
providers already verified the email. Check
`firebase.auth.GoogleAuthProvider.PROVIDER_ID` on the credential.
