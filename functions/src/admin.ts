import {onCall, HttpsError, type CallableRequest} from "firebase-functions/v2/https";
import {FieldValue} from "firebase-admin/firestore";
import {db, admin} from "./firebaseAdmin";

const REGION = "australia-southeast1";

function requireAdmin(req: CallableRequest) {
  if (req.auth?.token["admin"] !== true) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }
}

/** Bootstrap: grants admin claim if the caller's email is in the ADMIN_EMAILS env var. */
export const claimAdminRole = onCall({region: REGION}, async (req) => {
  if (!req.auth) throw new HttpsError("unauthenticated", "Sign in first.");
  const email = (req.auth.token.email ?? "").toLowerCase();
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!allowlist.includes(email)) {
    throw new HttpsError("permission-denied", "Your email is not on the admin allowlist.");
  }
  await admin.auth().setCustomUserClaims(req.auth.uid, {admin: true});
  return {ok: true};
});

/** Admin-to-admin promotion: existing admin grants another user admin access by email. */
export const grantAdminRole = onCall({region: REGION}, async (req) => {
  requireAdmin(req);
  const {email} = req.data as {email: string};
  if (!email) throw new HttpsError("invalid-argument", "email is required.");
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, {admin: true});
  return {ok: true};
});

/** Returns all tutors with status 'pending', ordered oldest-first. */
export const listPendingTutors = onCall({region: REGION}, async (req) => {
  requireAdmin(req);
  const snap = await db
    .collection("tutors")
    .where("status", "==", "pending")
    .orderBy("createdAt", "asc")
    .limit(100)
    .get();
  return {
    tutors: snap.docs.map((doc) => {
      const d = doc.data();
      return {
        uid: d.uid as string,
        firstName: d.firstName as string,
        lastName: d.lastName as string,
        bio: d.bio as string,
        photoURL: d.photoURL as string,
        courses: d.courses as string[],
        availability: d.availability as Record<string, {enabled: boolean; from: string; to: string}>,
        status: d.status as string,
        createdAt: d.createdAt?.toDate().toISOString() ?? null,
      };
    }),
  };
});

/** Approve or reject a tutor application. */
export const reviewTutor = onCall({region: REGION}, async (req) => {
  requireAdmin(req);
  const {uid, action, reason} = req.data as {
    uid: string;
    action: "approve" | "reject";
    reason?: string;
  };
  if (!uid) throw new HttpsError("invalid-argument", "uid is required.");
  if (action !== "approve" && action !== "reject") {
    throw new HttpsError("invalid-argument", "action must be approve or reject.");
  }
  const newStatus = action === "approve" ? "approved" : "rejected";
  const update: Record<string, unknown> = {
    status: newStatus,
    reviewedAt: FieldValue.serverTimestamp(),
    reviewedBy: req.auth!.uid,
  };
  if (action === "reject" && reason?.trim()) {
    update.rejectionReason = reason.trim();
  }
  await db.collection("tutors").doc(uid).update(update);
  return {ok: true, status: newStatus};
});
