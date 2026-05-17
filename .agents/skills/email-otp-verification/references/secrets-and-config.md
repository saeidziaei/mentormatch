# Secrets and configuration

## Defining the secret

In gen 2 Functions, use `defineSecret` — **not** `process.env`:

```ts
import { defineSecret } from "firebase-functions/params";

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

export const requestSignupCode = onCall(
  { region: "australia-southeast1", secrets: [RESEND_API_KEY] },
  async (req) => {
    const key = RESEND_API_KEY.value();
    // ...
  },
);
```

The `secrets: [...]` array in the function options is required — without it,
`RESEND_API_KEY.value()` throws.

## Setting the secret

```sh
firebase functions:secrets:set RESEND_API_KEY
# Paste value when prompted.
```

To update:
```sh
firebase functions:secrets:set RESEND_API_KEY
# New value supersedes the old; redeploy functions to pick it up.
```

To view current value (Cloud console only — CLI won't echo it):
```sh
firebase functions:secrets:access RESEND_API_KEY
```

## Emulator fallback

The emulator doesn't have access to deployed secrets. Two acceptable patterns:

### Pattern 1 (preferred): log the code, don't send

```ts
if (process.env.FUNCTIONS_EMULATOR === "true" || !apiKey) {
  logger.info(`[dev] Verification code for ${to}: ${code}`);
  return;
}
```

The code appears in the emulator's Functions tab. Developers grab it from
there. No real email sent — safe for testing.

### Pattern 2: env file with a dev key

Put a *dev-tier* Resend key in `functions/.secret.local`:

```
RESEND_API_KEY=re_devkey_xxx
```

The CLI loads it for emulator runs. Useful when you want to test actual
deliverability (e.g. spam-folder testing) but expensive on the daily quota.
Add `.secret.local` to `.gitignore`.

## Sender domain

Production sends require a verified sender domain at the provider:

- **Resend:** add domain in dashboard → add SPF + DKIM DNS records → wait for
  verification.
- **SendGrid:** Sender Authentication → Domain Authentication → similar DNS.

Until then, dev senders (`onboarding@resend.dev`) work but **only deliver to
the account owner's email**. New users won't receive codes.

This is the most common reason a flow works in dev and silently fails after
launch — flag it before claiming the feature is done.

## Region

If your project's Firestore region is non-default (e.g.
`australia-southeast1`), set the same region on the callables:

```ts
const REGION = "australia-southeast1";
onCall({ region: REGION, ... }, ...);
```

Otherwise the client SDK calls `us-central1` and gets a 404.
