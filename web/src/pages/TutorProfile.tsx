import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import Navbar from "../components/Navbar";
import {
  CalendarIcon,
  ClockIcon,
  GraduationCapIcon,
  MapPinIcon,
  MonitorIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon,
} from "../components/icons";
import { AU_K12_COURSES, STAGE_LABELS, type CourseStage } from "../lib/courses";
import {
  type PublicTutorDetail,
  teachingModeLabel,
  yearLevelLabel,
} from "../lib/tutors";

const getTutorProfileFn = httpsCallable<
  { uid: string },
  { tutor: PublicTutorDetail | null }
>(functions, "getTutorProfile");

const COURSE_MAP = new Map(AU_K12_COURSES.map((c) => [c.id, c]));

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DAY_LABEL: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

function groupCoursesByStage(courses: string[]) {
  const groups: Record<CourseStage, string[]> = {
    primary: [],
    junior: [],
    senior: [],
  };
  for (const id of courses) {
    const course = COURSE_MAP.get(id);
    if (course) groups[course.stage].push(course.name);
  }
  return groups;
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-violet-50 px-6 pb-10 pt-12 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="h-36 w-36 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-24 rounded-full bg-slate-200" />
              <div className="h-8 w-56 rounded-full bg-slate-200" />
              <div className="h-4 w-40 rounded-full bg-slate-200" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-slate-200" />
                <div className="h-6 w-24 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-5/6 rounded-full bg-slate-100" />
            <div className="h-4 w-4/6 rounded-full bg-slate-100" />
          </div>
          <div className="h-48 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function TutorProfile() {
  const { uid } = useParams<{ uid: string }>();
  const [tutor, setTutor] = useState<PublicTutorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!uid) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    getTutorProfileFn({ uid })
      .then((res) => {
        if (!res.data.tutor) {
          setNotFound(true);
        } else {
          setTutor(res.data.tutor);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [uid]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white font-body">
        <Navbar />
        <LoadingSkeleton />
      </div>
    );
  }

  if (notFound || !tutor) {
    return (
      <div className="flex min-h-screen flex-col bg-white font-body">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
            <GraduationCapIcon className="h-8 w-8 text-violet-400" />
          </div>
          <p className="font-display text-xl font-semibold text-slate-900">
            Tutor not found
          </p>
          <p className="text-sm text-slate-500">
            This tutor profile doesn't exist or hasn't been approved yet.
          </p>
          <Link
            to="/find-a-tutor"
            className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
          >
            Browse all tutors
          </Link>
        </div>
      </div>
    );
  }

  const hasRating = tutor.reviewCount > 0;
  const ModeIcon = tutor.teachingMode === "in-person" ? UserIcon : MonitorIcon;
  const courseGroups = groupCoursesByStage(tutor.courses);
  const activeDays = DAYS.filter((d) => tutor.availability[d]?.enabled);
  const yearLevels = yearLevelLabel(tutor.courses);

  return (
    <div className="flex min-h-screen flex-col bg-white font-body text-slate-900">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-b from-violet-50 via-violet-50/40 to-white px-6 pb-12 pt-12 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            {/* Photo */}
            <div className="shrink-0">
              <img
                src={tutor.photoURL}
                alt={`${tutor.firstName} ${tutor.lastName}`}
                className="h-36 w-36 rounded-full object-cover ring-4 ring-white shadow-xl md:h-44 md:w-44"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.firstName + "+" + tutor.lastName)}&background=7c3aed&color=fff&size=176`;
                }}
              />
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                Verified Tutor
              </span>

              <h1 className="mt-3 font-display text-3xl font-bold text-slate-900 md:text-4xl">
                {tutor.firstName} {tutor.lastName}
              </h1>

              {/* Rating row */}
              {hasRating ? (
                <div className="mt-2 flex items-center justify-center gap-1.5 md:justify-start">
                  <StarIcon className="h-4 w-4 text-amber-400" />
                  <span className="font-semibold text-slate-800">
                    {tutor.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({tutor.reviewCount} review{tutor.reviewCount !== 1 ? "s" : ""})
                  </span>
                </div>
              ) : (
                <div className="mt-2 flex justify-center md:justify-start">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    New tutor
                  </span>
                </div>
              )}

              {/* Meta row */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                  <ModeIcon className="h-4 w-4 text-slate-400" />
                  {teachingModeLabel(tutor.teachingMode)}
                </span>
                {tutor.suburb && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPinIcon className="h-4 w-4 text-slate-400" />
                    {tutor.suburb}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                  <GraduationCapIcon className="h-4 w-4 text-slate-400" />
                  {yearLevels}
                </span>
              </div>

              {/* Course chips (top 6) */}
              <div className="mt-4 flex flex-wrap justify-center gap-1.5 md:justify-start">
                {tutor.courses.slice(0, 6).map((id) => (
                  <span
                    key={id}
                    className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700"
                  >
                    {COURSE_MAP.get(id)?.name ?? id}
                  </span>
                ))}
                {tutor.courses.length > 6 && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    +{tutor.courses.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-8 md:px-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main content */}
          <div className="space-y-8 md:col-span-2">
            {/* Bio */}
            <section>
              <h2 className="font-display text-xl font-semibold text-slate-900">
                About {tutor.firstName}
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {tutor.bio}
              </p>
            </section>

            {/* Subjects */}
            <section>
              <h2 className="font-display text-xl font-semibold text-slate-900">
                Subjects Taught
              </h2>
              <div className="mt-4 space-y-4">
                {(["primary", "junior", "senior"] as CourseStage[]).map((s) => {
                  const names = courseGroups[s];
                  if (names.length === 0) return null;
                  return (
                    <div key={s}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {STAGE_LABELS[s]}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {names.map((name) => (
                          <span
                            key={name}
                            className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Availability */}
            <section>
              <h2 className="font-display text-xl font-semibold text-slate-900">
                Availability
              </h2>
              {activeDays.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">
                  No availability set yet.
                </p>
              ) : (
                <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
                  {activeDays.map((day) => {
                    const slot = tutor.availability[day];
                    return (
                      <div
                        key={day}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <span className="text-sm font-medium text-slate-800">
                          {DAY_LABEL[day]}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                          <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                          {formatTime(slot.from)} – {formatTime(slot.to)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-6 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* Rate */}
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-slate-900">
                    ${tutor.hourlyRate}
                  </span>
                  <span className="text-sm font-medium text-slate-400">/hr</span>
                </div>

                {/* Mode + suburb */}
                <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <ModeIcon className="h-4 w-4 text-slate-400" />
                    {teachingModeLabel(tutor.teachingMode)}
                  </div>
                  {tutor.suburb && (
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-slate-400" />
                      {tutor.suburb}
                    </div>
                  )}
                  {activeDays.length > 0 && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-slate-400" />
                      {activeDays.length} day{activeDays.length !== 1 ? "s" : ""}/week
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-2">
                  <button
                    disabled
                    className="flex w-full cursor-not-allowed flex-col items-center rounded-xl bg-violet-600 py-3 opacity-60"
                  >
                    <span className="text-sm font-semibold text-white">
                      Book a Session
                    </span>
                    <span className="text-[11px] text-violet-200">
                      Coming soon
                    </span>
                  </button>
                  <button
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-500 opacity-60"
                  >
                    Send Message
                  </button>
                </div>
              </div>

              <Link
                to="/find-a-tutor"
                className="block text-center text-xs font-medium text-slate-400 transition hover:text-violet-600"
              >
                ← Back to all tutors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
