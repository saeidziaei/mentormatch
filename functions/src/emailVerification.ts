import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import {logger} from "firebase-functions/v2";
import {z} from "zod";
import {createHash, randomInt} from "crypto";
import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {db, admin} from "./firebaseAdmin";

const REGION = "australia-southeast1";
const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

// TODO: switch to a verified Mentormatch sender domain in Resend before
// shipping to production. `onboarding@resend.dev` works for early dev only
// and will be rate-limited.
const FROM_EMAIL = "Mentormatch <onboarding@resend.dev>";

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_ATTEMPTS = 5;

const emailSchema = z.string().trim().toLowerCase().email();
const codeSchema = z.string().regex(/^\d{6}$/);

const hashCode = (code: string) =>
  createHash("sha256").update(code).digest("hex");
const emailKey = (email: string) =>
  createHash("sha256").update(email).digest("hex");
const generateCode = () =>
  String(randomInt(0, 1_000_000)).padStart(6, "0");

const buildEmailHtml = (code: string, displayName: string | null) => {
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
    `<p style="${intro}">Enter this code in the Mentormatch ` +
      "sign-up page to finish creating your account:</p>",
    `<p style="${codeStyle}">${code}</p>`,
    `<p style="${foot}">This code expires in 10 minutes. ` +
      "If you didn't request it, you can ignore this email.</p>",
    "</div>",
  ].join("");
};

/**
 * Sends the signup verification code via Resend, or logs it to the
 * Functions log when running in the emulator / without an API key.
 * @param {string} to Recipient email address.
 * @param {string} code The 6-digit verification code.
 * @param {string | null} displayName Optional name for personalization.
 * @param {string | undefined} apiKey Resend API key, if configured.
 * @return {Promise<void>}
 */
async function sendCodeEmail(
  to: string,
  code: string,
  displayName: string | null,
  apiKey: string | undefined,
): Promise<void> {
  if (process.env.FUNCTIONS_EMULATOR === "true" || !apiKey) {
    logger.info(`[dev] Verification code for ${to}: ${code}`);
    return;
  }
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject: "Your Mentormatch verification code",
      html: buildEmailHtml(code, displayName),
      text:
        `Your Mentormatch verification code is ${code}. ` +
        "It expires in 10 minutes.",
    }),
  });
  if (!resp.ok) {
    const body = await resp.text();
    logger.error("Resend send failed", {status: resp.status, body});
    throw new HttpsError(
      "internal",
      "Couldn't send the verification email. Please try again.",
    );
  }
}

const requestSchema = z.object({
  email: emailSchema,
  displayName: z.string().trim().min(1).max(80).optional(),
});

export const requestSignupCode = onCall(
  {region: REGION, secrets: [RESEND_API_KEY]},
  async (req) => {
    const parsed = requestSchema.safeParse(req.data);
    if (!parsed.success) {
      throw new HttpsError(
        "invalid-argument",
        parsed.error.issues[0]?.message ?? "Invalid input",
      );
    }
    const {email, displayName} = parsed.data;

    try {
      await admin.auth().getUserByEmail(email);
      throw new HttpsError(
        "already-exists",
        "This email is already in use — sign in instead.",
      );
    } catch (err: unknown) {
      if (err instanceof HttpsError) throw err;
      const code = (err as {code?: string}).code;
      if (code !== "auth/user-not-found") {
        logger.error("Unexpected auth lookup error", err);
        throw new HttpsError(
          "internal",
          "Couldn't check email availability. Please try again.",
        );
      }
    }

    const ref = db.collection("signupVerifications").doc(emailKey(email));
    const existing = await ref.get();
    if (existing.exists) {
      const createdAt = existing.get("createdAt") as Timestamp | undefined;
      if (createdAt && Date.now() - createdAt.toMillis() < RESEND_COOLDOWN_MS) {
        throw new HttpsError(
          "resource-exhausted",
          "Please wait a moment before requesting another code.",
        );
      }
    }

    const code = generateCode();
    await ref.set({
      email,
      codeHash: hashCode(code),
      displayName: displayName ?? null,
      attempts: 0,
      expiresAt: Timestamp.fromMillis(Date.now() + CODE_TTL_MS),
      createdAt: FieldValue.serverTimestamp(),
    });

    let apiKey: string | undefined;
    try {
      apiKey = RESEND_API_KEY.value();
    } catch {
      apiKey = undefined;
    }
    await sendCodeEmail(email, code, displayName ?? null, apiKey);

    return {ok: true};
  },
);

const verifySchema = z.object({
  email: emailSchema,
  code: codeSchema,
  password: z.string().min(6).max(256),
  displayName: z.string().trim().min(1).max(80).optional(),
});

export const verifySignupCode = onCall({region: REGION}, async (req) => {
  const parsed = verifySchema.safeParse(req.data);
  if (!parsed.success) {
    throw new HttpsError(
      "invalid-argument",
      parsed.error.issues[0]?.message ?? "Invalid input",
    );
  }
  const {email, code, password, displayName} = parsed.data;

  const ref = db.collection("signupVerifications").doc(emailKey(email));
  const snap = await ref.get();
  if (!snap.exists) {
    throw new HttpsError(
      "not-found",
      "No verification in progress. Request a new code.",
    );
  }

  const data = snap.data() as {
    codeHash: string;
    attempts: number;
    expiresAt: Timestamp;
    displayName: string | null;
  };

  if (data.expiresAt.toMillis() < Date.now()) {
    await ref.delete();
    throw new HttpsError(
      "deadline-exceeded",
      "Code expired. Request a new one.",
    );
  }

  if (data.attempts >= MAX_ATTEMPTS) {
    await ref.delete();
    throw new HttpsError(
      "resource-exhausted",
      "Too many incorrect attempts. Request a new code.",
    );
  }

  if (data.codeHash !== hashCode(code)) {
    await ref.update({attempts: FieldValue.increment(1)});
    throw new HttpsError(
      "invalid-argument",
      "That code didn't match. Try again.",
    );
  }

  const finalDisplayName = displayName ?? data.displayName ?? undefined;
  let userRecord;
  try {
    userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: finalDisplayName,
      emailVerified: true,
    });
  } catch (err: unknown) {
    const errCode = (err as {code?: string}).code;
    if (errCode === "auth/email-already-exists") {
      await ref.delete();
      throw new HttpsError(
        "already-exists",
        "This email is already in use — sign in instead.",
      );
    }
    logger.error("createUser failed", err);
    throw new HttpsError(
      "internal",
      "Couldn't create your account. Please try again.",
    );
  }

  await ref.delete();

  return {ok: true, uid: userRecord.uid};
});
