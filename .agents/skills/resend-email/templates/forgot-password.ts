/**
 * forgot-password.ts — Password reset link email
 * Copy to: functions/src/emails/forgot-password.ts
 *
 * Params:
 *   resetUrl    the password reset link (required)
 *   name        recipient's first name (optional)
 *   expiresIn   expiry string e.g. "1 hour" (optional)
 */
export function forgotPasswordEmail(
  resetUrl: string,
  name: string | null = null,
  expiresIn = "1 hour",
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
    `<h1 style="${h1Style}">Reset your password${greet}.</h1>`,
    `<p style="${p}">We received a request to reset your password. ` +
      "Click the button below to choose a new one:</p>",
    `<a href="${resetUrl}" style="${btn}">Reset password</a>`,
    `<p style="${foot}">This link expires in ${expiresIn}. ` +
      "If you didn't request a reset, you can ignore this email — " +
      "your password won't change.</p>",
    `<p style="margin:8px 0 0;font-size:12px;color:#7B7490;">` +
      `Or copy this link: <a href="${resetUrl}" style="color:#5B2ECC;">${resetUrl}</a></p>`,
    "</div>",
  ].join("");
}

export function forgotPasswordEmailText(resetUrl: string): string {
  return `Reset your password here: ${resetUrl}\n\nThis link expires in 1 hour.`;
}
