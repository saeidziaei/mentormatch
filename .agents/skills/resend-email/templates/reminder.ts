/**
 * reminder.ts — Generic reminder / nudge email
 * Copy to: functions/src/emails/reminder.ts
 *
 * Params:
 *   message     main body text (required)
 *   heading     email heading (optional)
 *   name        recipient's first name (optional)
 *   ctaLabel    button label (optional)
 *   ctaUrl      button link (optional)
 */
export function reminderEmail(
  message: string,
  heading = "A quick reminder.",
  name: string | null = null,
  ctaLabel = "",
  ctaUrl = "",
): string {
  const greet = name ? `Hi ${name},` : "Hi there,";
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
  return [
    `<div style="${wrap}">`,
    `<h1 style="${h1Style}">${heading}</h1>`,
    `<p style="${p}">${greet}</p>`,
    `<p style="${p}">${message}</p>`,
    ctaLabel && ctaUrl ?
      `<a href="${ctaUrl}" style="${btn}">${ctaLabel}</a>` : "",
    "</div>",
  ].join("");
}

export function reminderEmailText(message: string, name: string | null = null): string {
  const greet = name ? `Hi ${name},\n\n` : "";
  return `${greet}${message}`;
}
