import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import {logger} from "firebase-functions/v2";
import {z} from "zod";
import {admin} from "./firebaseAdmin";
import {Resend} from "resend";
import {forgotPasswordEmail, forgotPasswordEmailText} from "./emails/forgot-password";

const REGION = "australia-southeast1";
const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const FROM_EMAIL = "Mentormatch <onboarding@resend.dev>";

const APP_BASE_URL =
  process.env.FUNCTIONS_EMULATOR === "true"
    ? "http://localhost:5173"
    : "https://mentormatch-cf770.web.app";

const resetSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const sendPasswordReset = onCall(
  {region: REGION, secrets: [RESEND_API_KEY]},
  async (req) => {
    const parsed = resetSchema.safeParse(req.data);
    if (!parsed.success) {
      throw new HttpsError(
        "invalid-argument",
        parsed.error.issues[0]?.message ?? "Invalid input",
      );
    }
    const {email} = parsed.data;

    let apiKey: string | undefined;
    try {
      apiKey = RESEND_API_KEY.value();
    } catch {
      apiKey = process.env.RESEND_API_KEY;
    }

    try {
      let displayName: string | null = null;
      try {
        const userRecord = await admin.auth().getUserByEmail(email);
        displayName = userRecord.displayName ?? null;
      } catch {
        // User not found or other lookup error — continue silently
      }

      const firebaseLink = await admin.auth().generatePasswordResetLink(email);
      const oobCode = new URL(firebaseLink).searchParams.get("oobCode") ?? "";
      const resetLink = `${APP_BASE_URL}/reset-password?oobCode=${encodeURIComponent(oobCode)}`;

      if (!apiKey) {
        logger.info(`[dev] Password reset link for ${email}: ${resetLink}`);
        return {ok: true};
      }

      const resend = new Resend(apiKey);
      const {error} = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Reset your Mentormatch password",
        html: forgotPasswordEmail(resetLink, displayName, "1 hour"),
        text: forgotPasswordEmailText(resetLink),
      });

      if (error) {
        logger.error("Resend send failed", error);
        throw new HttpsError(
          "internal",
          "Couldn't send the reset email. Please try again.",
        );
      }
    } catch (err: unknown) {
      if (err instanceof HttpsError) throw err;
      // Swallow all other errors (auth/user-not-found, etc.) — anti-enumeration
      logger.warn("sendPasswordReset: suppressed error", err);
    }

    return {ok: true};
  },
);
