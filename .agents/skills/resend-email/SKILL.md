---
name: resend-email
description: >
  Send transactional emails via Resend in a Firebase project. Use this skill whenever
  the user wants to send any kind of email — verification, forgot password, welcome,
  reminders, notifications, receipts — or wants to add a new email type, create a new
  template, or wire up an email-sending Firebase Function. Trigger any time the user
  mentions "send email", "email template", "forgot password email", "reminder email",
  "verification email", or any transactional email need.
---

# Resend Email Skill (Firebase + TypeScript)

## Project layout

```
/functions
  package.json          ← resend installed here
  src/
    emails/             ← one .ts file per email type
      verification.ts
      forgot-password.ts
      welcome.ts
      reminder.ts
      notification.ts
      receipt.ts
    email.ts            ← shared sendEmail() helper (add once)
    index.ts            ← Firebase Functions; import and call sendEmail() here
```

## Dependency

```bash
cd functions && npm install resend
```

RESEND_API_KEY is stored as a Firebase secret:
```bash
firebase functions:secrets:set RESEND_API_KEY
```

For local dev, add to functions/.secret.local:
```
RESEND_API_KEY=re_xxxx
```

---

## Pattern — how emails are sent

Templates are plain TypeScript functions returning an HTML string.
The sendEmail() helper calls Resend. Add it once to functions/src/email.ts:

```ts
import {Resend} from "resend";
import {logger} from "firebase-functions/v2";
import {HttpsError} from "firebase-functions/v2/https";

// TODO: replace with verified domain before production
export const FROM_EMAIL = "Yourapp <onboarding@resend.dev>";

export async function sendEmail(
  apiKey: string,
  to: string,
  subject: string,
  html: string,
  text?: string,
): Promise<void> {
  const resend = new Resend(apiKey);
  const {error} = await resend.emails.send({from: FROM_EMAIL, to, subject, html, text});
  if (error) {
    logger.error("Resend error", error);
    throw new HttpsError("internal", "Couldn't send email. Please try again.");
  }
}
```

### Calling from a Firebase Function

```ts
import {defineSecret} from "firebase-functions/params";
import {sendEmail} from "./email";
import {forgotPasswordEmail} from "./emails/forgot-password";

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

export const sendPasswordReset = onCall(
  {region: REGION, secrets: [RESEND_API_KEY]},
  async (req) => {
    const {email, name, resetUrl} = req.data;
    await sendEmail(
      RESEND_API_KEY.value(),
      email,
      "Reset your password",
      forgotPasswordEmail(name, resetUrl),
    );
    return {ok: true};
  }
);
```

### Emulator fallback pattern

```ts
if (process.env.FUNCTIONS_EMULATOR === "true" || !apiKey) {
  logger.info(`[dev] Would send "${subject}" to ${to}`);
  return;
}
```

---

## Templates

See templates/ in this skill — copy whichever you need into functions/src/emails/.

| File | Email type | Key params |
|---|---|---|
| verification.ts | Email verification / OTP code | code, displayName? |
| forgot-password.ts | Password reset link | resetUrl, name? |
| welcome.ts | Post-signup welcome | name?, appName?, loginUrl? |
| reminder.ts | Generic reminder / nudge | message, subject?, ctaUrl? |
| notification.ts | App notification | subject, message, ctaUrl? |
| receipt.ts | Payment / order receipt | total, items?, orderId? |

---

## Adding a new email type (checklist)

1. Copy the nearest template from templates/ into functions/src/emails/
2. Rename, update the function signature and HTML to match your data
3. Import it in the relevant Firebase Function and call sendEmail()
4. Add secrets: [RESEND_API_KEY] to the onCall options if not already there

---

## Styling conventions (match your existing verification email)

- Font: 'DM Sans', system-ui, sans-serif
- Headings: 'Playfair Display', Georgia, serif
- Primary text: #1A1530
- Muted text: #7B7490
- Accent/brand: #5B2ECC
- Max width: 480px, centered, padding: 24px
