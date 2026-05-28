/**
 * receipt.ts — Payment / order receipt email
 * Copy to: functions/src/emails/receipt.ts
 *
 * Params:
 *   total       total amount string e.g. "$49.00" (required)
 *   items       line items array [{label, amount}] (optional)
 *   orderId     order or transaction ID (optional)
 *   name        recipient's first name (optional)
 *   date        transaction date string (optional, defaults to today)
 */
export interface ReceiptItem {
  label: string;
  amount: string;
}

export function receiptEmail(
  total: string,
  items: ReceiptItem[] = [],
  orderId = "",
  name: string | null = null,
  date = new Date().toLocaleDateString("en-AU"),
): string {
  const greet = name ? `Hi ${name},` : "Hi there,";
  const wrap =
    "font-family:'DM Sans',system-ui,sans-serif;color:#1A1530;" +
    "max-width:480px;margin:0 auto;padding:24px;";
  const h1Style =
    "font-family:'Playfair Display',Georgia,serif;" +
    "font-size:24px;font-weight:600;margin:0 0 4px;";
  const sub = "margin:0 0 20px;font-size:14px;color:#7B7490;";
  const p = "margin:0 0 16px;color:#7B7490;";
  const row = "display:flex;justify-content:space-between;padding:8px 0;" +
    "border-bottom:1px solid #F0EDF8;font-size:15px;color:#7B7490;";
  const totalRow = "display:flex;justify-content:space-between;padding:12px 0;" +
    "font-weight:700;font-size:16px;color:#1A1530;";

  const lineItems = items.map((item) =>
    `<div style="${row}"><span>${item.label}</span><span>${item.amount}</span></div>`
  ).join("");

  return [
    `<div style="${wrap}">`,
    `<h1 style="${h1Style}">Receipt${orderId ? ` #${orderId}` : ""}.</h1>`,
    `<p style="${sub}">${date}</p>`,
    `<p style="${p}">${greet} Thanks for your purchase.</p>`,
    items.length > 0 ? [
      `<div style="margin:0 0 8px;">`,
      lineItems,
      `<div style="${totalRow}"><span>Total</span><span>${total}</span></div>`,
      `</div>`,
    ].join("") : `<p style="font-size:20px;font-weight:700;color:#1A1530;">${total}</p>`,
    `<p style="margin:24px 0 0;font-size:14px;color:#7B7490;">` +
      "Questions? Reply to this email and we'll help you out.</p>",
    "</div>",
  ].join("");
}

export function receiptEmailText(total: string, orderId = ""): string {
  return `Your receipt${orderId ? ` #${orderId}` : ""}. Total: ${total}`;
}
