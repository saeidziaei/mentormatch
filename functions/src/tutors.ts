import {onCall, HttpsError} from "firebase-functions/v2/https";
import {z} from "zod";
import {FieldValue, Timestamp} from "firebase-admin/firestore";
import {db} from "./firebaseAdmin";
import {COURSE_IDS} from "./courses";

const REGION = "australia-southeast1";

const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;

const daySchema = z.object({
  enabled: z.boolean(),
  from: z.string().regex(timeRe, "Time must be HH:mm"),
  to: z.string().regex(timeRe, "Time must be HH:mm"),
}).refine((d) => !d.enabled || d.from < d.to, {
  message: "End time must be after start time",
});

const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  bio: z.string().trim().min(50).max(600),
  photoURL: z.string().url(),
  courses: z.array(z.string()).min(1).max(20),
  availability: z.object({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
  }),
});

export const upsertTutorProfile = onCall({region: REGION}, async (req) => {
  if (!req.auth) {
    throw new HttpsError("unauthenticated", "Sign in to save your profile.");
  }
  const uid = req.auth.uid;

  const parsed = profileSchema.safeParse(req.data);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    throw new HttpsError("invalid-argument", msg);
  }
  const data = parsed.data;

  for (const id of data.courses) {
    if (!COURSE_IDS.has(id)) {
      throw new HttpsError("invalid-argument", `Unknown course: ${id}`);
    }
  }
  if (new Set(data.courses).size !== data.courses.length) {
    throw new HttpsError("invalid-argument", "Duplicate course in selection");
  }

  const ref = db.collection("tutors").doc(uid);
  const snap = await ref.get();
  const isCreate = !snap.exists;

  await ref.set({
    uid,
    displayName: data.displayName,
    bio: data.bio,
    photoURL: data.photoURL,
    courses: data.courses,
    availability: data.availability,
    status: "pending",
    updatedAt: FieldValue.serverTimestamp(),
    ...(isCreate ? {createdAt: FieldValue.serverTimestamp()} : {}),
  }, {merge: true});

  return {ok: true, status: "pending" as const, created: isCreate};
});

export const getMyTutorProfile = onCall({region: REGION}, async (req) => {
  if (!req.auth) {
    throw new HttpsError("unauthenticated", "Sign in to view your profile.");
  }
  const snap = await db.collection("tutors").doc(req.auth.uid).get();
  if (!snap.exists) return {profile: null};

  const raw = snap.data() as Record<string, unknown>;
  const toIso = (v: unknown) =>
    v instanceof Timestamp ? v.toDate().toISOString() : null;
  return {
    profile: {
      ...raw,
      createdAt: toIso(raw.createdAt),
      updatedAt: toIso(raw.updatedAt),
    },
  };
});
