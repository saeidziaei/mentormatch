# Email providers

For transactional email (verification codes, password resets, receipts), you
need a real provider — Gmail SMTP and Firebase Auth's built-in sender are not
options. Pick one of the below.

## Resend (recommended for new projects)

- **Free tier:** 3,000 emails/month, 100/day
- **Setup time:** ~5 minutes
- **API:** Simple JSON POST to `https://api.resend.com/emails`
- **Quirks:** Dev sender is `onboarding@resend.dev` — rate-limited to your
  own email only. **Verify a real sending domain before launch.**

```ts
await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${RESEND_API_KEY.value()}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "Yourapp <hello@yourapp.com>",
    to,
    subject: "Your code",
    html, text,
  }),
});
```

## SendGrid

- **Free tier:** 100 emails/day
- **Setup time:** 15–30 minutes (sender verification, domain auth records)
- **API:** REST or `@sendgrid/mail` npm package
- **Quirks:** Sender verification is mandatory and tedious. Better deliverability
  reputation than Resend at high volumes.

## Firebase Trigger Email extension

- Install the extension; it watches a Firestore collection (e.g. `mail/`).
- Writes to that collection trigger an email send.
- **You still need an SMTP backend** (Mailgun, SendGrid, Gmail App Password) —
  the extension is a relay, not a sender.
- Good when you already use Firebase Extensions heavily and want everything in
  Firestore. Adds latency vs direct API call.

## Mailgun, Postmark, Amazon SES

Valid alternatives. Postmark is the gold standard for transactional
deliverability but pricier. SES is cheapest at scale but has the worst DX
(needs domain verification + leaving the sandbox).

## Anti-patterns

- ❌ Using Gmail SMTP for transactional email. Will get blocked or
  rate-limited; reputation tanks deliverability for the rest of your domain.
- ❌ Sending from a free domain (`gmail.com`, `outlook.com`) as `from:`.
  DMARC/DKIM will fail. Always send from your own verified domain.
- ❌ Hardcoding API keys in source. Always `defineSecret`, never `process.env`
  for secrets in gen 2 Functions.
