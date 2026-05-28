/**
 * welcome.ts — Post-signup welcome email
 * Copy to: functions/src/emails/welcome.ts
 *
 * Params:
 *   name        recipient's first name (optional)
 *   appName     your app name (optional)
 *   loginUrl    get-started / dashboard link (optional)
 */
export function welcomeEmail(
  name: string | null = null,
  appName = "Mentormatch",
  loginUrl = "",
): string {
  const greet = name ? `, ${name}` : "";
  const wrap =
    "font-family:'DM Sans',system-ui,sans-serif;color:#1A1530;" +
    "max-width:480px;margin:0 auto;padding:24px;";
  const h1Style =
    "font-family:'Playfair Display',Georgia,serif;" +
    "font-size:24px;font-weight:600;margin:0 0 16px;";
  const p = "margin:0 0 24px;color:#7B7490;";
  const btn =
    "display:inline-block;padding:12px 24px;background:#5B2ECC;" +
    "color:#ffffff;border-radius:8px;text-decoration:none;" +
    "font-weight:600;font-size:15px;";
  const foot = "margin:24px 0 0;font-size:14px;color:#7B7490;";
  return [
    `<div style="${wrap}">`,
    `<h1 style="${h1Style}">Welcome to ${appName}${greet}.</h1>`,
    `<p style="${p}">Your account is all set. ` +
      "We're thrilled to have you on board.</p>",
    loginUrl ? `<a href="${loginUrl}" style="${btn}">Get started</a>` : "",
    `<p style="${foot}">If you have any questions, just reply to this email.</p>`,
    "</div>",
  ].join("");
}

export function welcomeEmailText(name: string | null, appName = "Mentormatch"): string {
  const greet = name ? `, ${name}` : "";
  return `Welcome to ${appName}${greet}! Your account is all set.`;
}
