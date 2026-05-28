/**
 * verification.ts — Email verification OTP code
 * Copy to: functions/src/emails/verification.ts
 *
 * Already implemented in your codebase as buildEmailHtml() in index.ts.
 * Extract it here if you want a consistent home for all email templates.
 *
 * Params:
 *   code        6-digit verification code
 *   displayName recipient's name (optional)
 */
export function verificationEmail(
  code: string,
  displayName: string | null,
): string {
  const greet = displayName ? `, ${displayName}` : "";
  const wrap =
    "font-family:'DM Sans',system-ui,sans-serif;color:#1A1530;" +
    "max-width:480px;margin:0 auto;padding:24px;";
  const h1Style =
    "font-family:'Playfair Display',Georgia,serif;" +
    "font-size:24px;font-weight:600;margin:0 0 16px;";
  const intro = "margin:0 0 24px;color:#7B7490;";
  const codeStyle =
    "font-size:32px;font-weight:700;letter-spacing:0.18em;" +
    "color:#5B2ECC;margin:0 0 24px;";
  const foot = "margin:0;font-size:14px;color:#7B7490;";
  return [
    `<div style="${wrap}">`,
    `<h1 style="${h1Style}">Welcome${greet}.</h1>`,
    `<p style="${intro}">Enter this code to finish creating your account:</p>`,
    `<p style="${codeStyle}">${code}</p>`,
    `<p style="${foot}">This code expires in 10 minutes. ` +
      "If you didn't request it, you can ignore this email.</p>",
    "</div>",
  ].join("");
}

export function verificationEmailText(code: string): string {
  return `Your verification code is ${code}. It expires in 10 minutes.`;
}
