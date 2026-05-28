/**
 * notification.ts — Generic app notification email
 * Copy to: functions/src/emails/notification.ts
 *
 * Params:
 *   subject     notification title / heading (required)
 *   message     body text (required)
 *   name        recipient's first name (optional)
 *   ctaLabel    button label (optional, default "View")
 *   ctaUrl      button link (optional)
 */
export function notificationEmail(
  subject: string,
  message: string,
  name: string | null = null,
  ctaLabel = "View",
  ctaUrl = "",
): string {
  const greet = name ? `Hi ${name},` : "Hi there,";
  const wrap =
    "font-family:'DM Sans',system-ui,sans-serif;color:#1A1530;" +
    "max-width:480px;margin:0 auto;padding:24px;";
  const label =
    "font-size:11px;font-weight:600;letter-spacing:0.1em;" +
    "text-transform:uppercase;color:#5B2ECC;margin:0 0 8px;";
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
    `<p style="${label}">Mentormatch</p>`,
    `<h1 style="${h1Style}">${subject}</h1>`,
    `<p style="${p}">${greet}</p>`,
    `<p style="${p}">${message}</p>`,
    ctaUrl ? `<a href="${ctaUrl}" style="${btn}">${ctaLabel}</a>` : "",
    "</div>",
  ].join("");
}

export function notificationEmailText(subject: string, message: string): string {
  return `${subject}\n\n${message}`;
}
