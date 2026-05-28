import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import { AU_K12_COURSES } from "../../lib/courses";

const COURSE_NAME = new Map(AU_K12_COURSES.map((c) => [c.id, c.name]));
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const DAY_SHORT: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu",
  friday: "Fri", saturday: "Sat", sunday: "Sun",
};

interface DaySlot { enabled: boolean; from: string; to: string }
interface PendingTutor {
  uid: string;
  firstName: string;
  lastName: string;
  bio: string;
  photoURL: string;
  courses: string[];
  availability: Record<string, DaySlot>;
  status: string;
  createdAt: string | null;
}

const listPendingTutorsFn = httpsCallable<Record<string, never>, { tutors: PendingTutor[] }>(
  functions,
  "listPendingTutors",
);
const reviewTutorFn = httpsCallable<
  { uid: string; action: "approve" | "reject"; reason?: string },
  { ok: boolean; status: string }
>(functions, "reviewTutor");

function availabilitySummary(av: Record<string, DaySlot>): string {
  const active = DAYS.filter((d) => av[d]?.enabled);
  if (active.length === 0) return "No availability set";
  return active.map((d) => DAY_SHORT[d]).join(", ");
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function TutorCard({
  tutor,
  onReviewed,
}: {
  tutor: PendingTutor;
  onReviewed: (uid: string) => void;
}) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setBusy(true);
    setError(null);
    try {
      await reviewTutorFn({ uid: tutor.uid, action: "approve" });
      onReviewed(tutor.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve.");
      setBusy(false);
    }
  };

  const handleReject = async () => {
    setBusy(true);
    setError(null);
    try {
      await reviewTutorFn({ uid: tutor.uid, action: "reject", reason: reason.trim() || undefined });
      onReviewed(tutor.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject.");
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-4 p-5">
        <img
          src={tutor.photoURL}
          alt={`${tutor.firstName} ${tutor.lastName}`}
          className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tutor.firstName}+${tutor.lastName}&background=7c3aed&color=fff`; }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-semibold text-white">
              {tutor.firstName} {tutor.lastName}
            </h3>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
              Pending
            </span>
          </div>
          <p className="mt-0.5 text-xs text-white/40">
            Applied {formatDate(tutor.createdAt)} · UID: {tutor.uid.slice(0, 8)}…
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="border-t border-white/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Bio</p>
        <p className="mt-1.5 text-sm leading-relaxed text-white/75">{tutor.bio}</p>
      </div>

      {/* Courses */}
      <div className="border-t border-white/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
          Subjects ({tutor.courses.length})
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tutor.courses.map((id) => (
            <span
              key={id}
              className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium text-violet-300"
            >
              {COURSE_NAME.get(id) ?? id}
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="border-t border-white/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
          Availability
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const slot = tutor.availability[day];
            return slot?.enabled ? (
              <span key={day} className="rounded-lg bg-white/[0.07] px-2.5 py-1 text-xs text-white/70">
                <span className="font-semibold text-white/90">{DAY_SHORT[day]}</span>{" "}
                {slot.from}–{slot.to}
              </span>
            ) : null;
          })}
          {DAYS.every((d) => !tutor.availability[d]?.enabled) && (
            <span className="text-xs text-white/30">No availability set</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-white/5 p-5">
        {error && (
          <p className="mb-3 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        {!rejectOpen ? (
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              disabled={busy}
              className="flex-1 rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "…" : "✓ Approve"}
            </button>
            <button
              onClick={() => setRejectOpen(true)}
              disabled={busy}
              className="flex-1 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              ✕ Reject
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
              Rejection reason (optional)
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Profile photo is unclear, bio is too short…"
                rows={3}
                className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/25 outline-none transition focus:border-violet-400/50 focus:bg-white/8"
              />
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={busy}
                className="flex-1 rounded-xl bg-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-300 ring-1 ring-red-500/30 transition hover:bg-red-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "…" : "Confirm Rejection"}
              </button>
              <button
                onClick={() => { setRejectOpen(false); setReason(""); }}
                disabled={busy}
                className="rounded-xl px-4 py-2.5 text-sm text-white/40 transition hover:text-white/70"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminTutors() {
  const [tutors, setTutors] = useState<PendingTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listPendingTutorsFn({});
      setTutors(res.data.tutors);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pending tutors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleReviewed = (uid: string) => {
    setTutors((prev) => prev.filter((t) => t.uid !== uid));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Tutor Applications</h1>
          <p className="mt-1 text-sm text-white/50">
            {loading ? "Loading…" : `${tutors.length} pending ${tutors.length === 1 ? "application" : "applications"}`}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-12 text-center text-sm text-white/30">Loading applications…</div>
      )}

      {!loading && !error && tutors.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <div className="text-5xl">🎉</div>
          <p className="font-display text-lg font-semibold text-white">All caught up!</p>
          <p className="text-sm text-white/40">No pending tutor applications right now.</p>
        </div>
      )}

      {!loading && tutors.length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.uid} tutor={tutor} onReviewed={handleReviewed} />
          ))}
        </div>
      )}
    </div>
  );
}
