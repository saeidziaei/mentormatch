import { useEffect, useMemo, useState, type FormEvent } from "react";
import { httpsCallable } from "firebase/functions";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "../components/Navbar";
import { CheckIcon, SparkleIcon } from "../components/icons";
import { functions, storage } from "../firebase";
import { useAuth } from "../lib/auth";
import {
  AU_K12_COURSES,
  STAGE_LABELS,
  type Course,
  type CourseStage,
} from "../lib/courses";

type DaySlot = { enabled: boolean; from: string; to: string };
const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
type Day = (typeof DAYS)[number];
type Availability = Record<Day, DaySlot>;

const DAY_LABEL: Record<Day, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

interface ServerProfile {
  uid: string;
  firstName: string;
  lastName: string;
  bio: string;
  photoURL: string;
  courses: string[];
  hourlyRate: number;
  teachingMode: "online" | "in-person" | "both";
  suburb: string | null;
  availability: Availability;
  status: "pending" | "approved" | "rejected";
  createdAt: string | null;
  updatedAt: string | null;
}

const defaultDay: DaySlot = { enabled: false, from: "16:00", to: "18:00" };
const defaultAvailability: Availability = {
  monday: { ...defaultDay },
  tuesday: { ...defaultDay },
  wednesday: { ...defaultDay },
  thursday: { ...defaultDay },
  friday: { ...defaultDay },
  saturday: { ...defaultDay },
  sunday: { ...defaultDay },
};

const upsertProfileCallable = httpsCallable<
  {
    firstName: string;
    lastName: string;
    bio: string;
    photoURL: string;
    courses: string[];
    hourlyRate: number;
    teachingMode: "online" | "in-person" | "both";
    suburb?: string;
    availability: Availability;
  },
  { ok: true; status: string; created: boolean }
>(functions, "upsertTutorProfile");
const getMyProfileCallable = httpsCallable<unknown, { profile: ServerProfile | null }>(
  functions,
  "getMyTutorProfile",
);

const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-slate-500";
const inputClass =
  "mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

export default function TutorOnboard() {
  const { user, refreshUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Availability>(defaultAvailability);

  const [hourlyRate, setHourlyRate] = useState<number>(60);
  const [teachingMode, setTeachingMode] = useState<"online" | "in-person" | "both">("both");
  const [suburb, setSuburb] = useState("");

  const [status, setStatus] = useState<ServerProfile["status"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyProfileCallable();
        if (cancelled) return;
        const profile = res.data.profile;
        if (profile) {
          setFirstName(profile.firstName ?? "");
          setLastName(profile.lastName ?? "");
          setBio(profile.bio);
          setPhotoURL(profile.photoURL);
          setCourses(profile.courses);
          setHourlyRate(profile.hourlyRate ?? 60);
          setTeachingMode(profile.teachingMode ?? "both");
          setSuburb(profile.suburb ?? "");
          setAvailability(profile.availability);
          setStatus(profile.status);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load profile");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const grouped = useMemo(() => {
    const out: Record<CourseStage, Course[]> = { primary: [], junior: [], senior: [] };
    for (const c of AU_K12_COURSES) out[c.stage].push(c);
    return out;
  }, []);

  const toggleCourse = (id: string) => {
    setCourses((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  };

  const updateDay = (day: Day, patch: Partial<DaySlot>) => {
    setAvailability((cur) => ({ ...cur, [day]: { ...cur[day], ...patch } }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Photo must be an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be smaller than 5 MB.");
      return;
    }
    setError(null);
    setPhotoFile(file);
    setPhotoURL(URL.createObjectURL(file));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSavedAt(null);

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }
    if (bio.trim().length < 50) {
      setError("Bio must be at least 50 characters.");
      return;
    }
    if (courses.length === 0) {
      setError("Pick at least one course you teach.");
      return;
    }
    if (!hourlyRate || hourlyRate < 20 || hourlyRate > 200) {
      setError("Hourly rate must be between $20 and $200.");
      return;
    }
    const anyDay = DAYS.some((d) => availability[d].enabled);
    if (!anyDay) {
      setError("Select at least one day of availability.");
      return;
    }
    for (const d of DAYS) {
      const slot = availability[d];
      if (slot.enabled && !(slot.from < slot.to)) {
        setError(`${DAY_LABEL[d]}: end time must be after start time.`);
        return;
      }
    }
    if (!photoFile && !photoURL) {
      setError("Upload a profile photo.");
      return;
    }

    setSubmitting(true);
    try {
      let finalPhotoURL = photoURL;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `tutorPhotos/${user.uid}/profile.${ext}`;
        const ref = storageRef(storage, path);
        await uploadBytes(ref, photoFile, { contentType: photoFile.type });
        finalPhotoURL = await getDownloadURL(ref);
      }

      await upsertProfileCallable({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        photoURL: finalPhotoURL,
        courses,
        hourlyRate,
        teachingMode,
        suburb: suburb.trim() || undefined,
        availability,
      });

      setPhotoFile(null);
      setPhotoURL(finalPhotoURL);
      setStatus("pending");
      setSavedAt(Date.now());
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-200 font-body text-slate-900">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 shadow-sm">
            <SparkleIcon className="h-3.5 w-3.5 text-violet-500" />
            <span>Tutor Profile</span>
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
            Build your{" "}
            <span className="italic text-violet-600">tutor</span> profile.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-600 md:text-base">
            Tell students who you are, what you teach, and when you're
            available. Your profile stays in review until our team approves it.
          </p>

          {status && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              <span>
                Your profile is currently{" "}
                <strong className="font-semibold">{status}</strong> review.
                Edits will reset it to pending.
              </span>
            </div>
          )}

          {loading ? (
            <p className="mt-10 text-sm text-slate-500">Loading your profile…</p>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">

              {/* About you */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
                <div className="border-l-[3px] border-violet-500 pl-3">
                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    About you
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Basics that appear at the top of your public profile.
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <label className={labelClass}>
                    First name
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className={inputClass}
                    />
                  </label>
                  <label className={labelClass}>
                    Last name
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Smith"
                      className={inputClass}
                    />
                  </label>
                </div>

                <label className={`mt-5 ${labelClass}`}>
                  Short bio
                  <span className="ml-2 font-normal normal-case text-slate-400">
                    ({bio.length}/600)
                  </span>
                  <textarea
                    required
                    minLength={50}
                    maxLength={600}
                    rows={5}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Share your teaching experience, approach, and what students can expect."
                    className={`${inputClass} resize-y`}
                  />
                </label>

                <div className="mt-5">
                  <p className={labelClass}>Profile photo</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 shadow-sm">
                      {photoURL ? (
                        <img
                          src={photoURL}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-xs text-slate-400">
                          No photo
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700">
                      {photoURL ? "Replace photo" : "Upload photo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    JPG or PNG up to 5 MB. A clear headshot works best.
                  </p>
                </div>
              </section>

              {/* Teaching details */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
                <div className="border-l-[3px] border-violet-500 pl-3">
                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    Teaching details
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    How you teach, where, and what you charge per hour.
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  {/* Hourly rate */}
                  <div>
                    <label className={labelClass}>
                      Hourly rate (AUD)
                      <div className="relative mt-2">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                          $
                        </span>
                        <input
                          type="number"
                          min={20}
                          max={200}
                          step={5}
                          required
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-7 pr-4 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                        />
                      </div>
                    </label>
                  </div>

                  {/* Suburb */}
                  <label className={labelClass}>
                    Suburb (optional)
                    <input
                      type="text"
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      placeholder="e.g. Bondi, Parramatta"
                      maxLength={50}
                      className={inputClass}
                    />
                  </label>
                </div>

                {/* Teaching mode */}
                <div className="mt-5">
                  <p className={labelClass}>Teaching mode</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(
                      [
                        { value: "online", label: "Online only" },
                        { value: "in-person", label: "In-person only" },
                        { value: "both", label: "Online & in-person" },
                      ] as { value: "online" | "in-person" | "both"; label: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setTeachingMode(opt.value)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                          teachingMode === opt.value
                            ? "border-violet-500 bg-violet-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Courses you teach */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">

                <div className="flex items-start justify-between gap-4">
                  <div className="border-l-[3px] border-violet-500 pl-3">
                    <h2 className="font-display text-xl font-semibold text-slate-900">
                      Courses you teach
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Pick every K–12 subject you can confidently tutor.
                    </p>
                  </div>
                  {courses.length > 0 && (
                    <span className="shrink-0 rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                      {courses.length} selected
                    </span>
                  )}
                </div>
                <div className="mt-5 space-y-5">
                  {(Object.keys(grouped) as CourseStage[]).map((stage) => (
                    <div key={stage}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {STAGE_LABELS[stage]}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {grouped[stage].map((c) => {
                          const active = courses.includes(c.id);
                          return (
                            <button
                              type="button"
                              key={c.id}
                              onClick={() => toggleCourse(c.id)}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-sm transition ${
                                active
                                  ? "border-violet-500 bg-violet-600 text-white"
                                  : "border-white/80 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                              }`}
                            >
                              {active && <CheckIcon className="h-3 w-3" />}
                              {c.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Availability */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
                <div className="border-l-[3px] border-violet-500 pl-3">
                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    Availability
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Toggle the days you can teach and set a typical window for
                    each.
                  </p>
                </div>
                <div className="mt-5 space-y-2">
                  {DAYS.map((day) => {
                    const slot = availability[day];
                    return (
                      <div
                        key={day}
                        className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 transition ${
                          slot.enabled
                            ? "border-violet-200 bg-violet-50/60"
                            : "border-slate-200/70 bg-slate-50/60"
                        }`}
                      >
                        <label className="inline-flex w-32 cursor-pointer items-center gap-3 text-sm font-medium text-slate-800">
                          <input
                            type="checkbox"
                            checked={slot.enabled}
                            onChange={(e) =>
                              updateDay(day, { enabled: e.target.checked })
                            }
                            className="h-4 w-4 cursor-pointer accent-violet-600"
                          />
                          {DAY_LABEL[day]}
                        </label>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <input
                            type="time"
                            value={slot.from}
                            onChange={(e) =>
                              updateDay(day, { from: e.target.value })
                            }
                            disabled={!slot.enabled}
                            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-800 outline-none transition focus:border-violet-500 disabled:bg-slate-50 disabled:text-slate-400"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={slot.to}
                            onChange={(e) =>
                              updateDay(day, { to: e.target.value })
                            }
                            disabled={!slot.enabled}
                            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-800 outline-none transition focus:border-violet-500 disabled:bg-slate-50 disabled:text-slate-400"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </p>
              )}
              {savedAt && !error && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  Profile saved. It's now pending admin approval.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Saving…"
                  : status
                  ? "Save changes"
                  : "Submit for approval"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
