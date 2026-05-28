import { useEffect, useMemo, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import Navbar from "../components/Navbar";
import TutorCard, { TutorCardSkeleton } from "../components/TutorCard";
import { GraduationCapIcon, SlidersIcon, XIcon } from "../components/icons";
import { AU_K12_COURSES, STAGE_LABELS, type CourseStage } from "../lib/courses";
import type { PublicTutor } from "../lib/tutors";

const searchTutorsFn = httpsCallable<
  Record<string, never>,
  { tutors: PublicTutor[] }
>(functions, "searchTutors");

const STAGES: { value: CourseStage | ""; label: string }[] = [
  { value: "", label: "All stages" },
  { value: "primary", label: "Primary (F–6)" },
  { value: "junior", label: "Junior Secondary (7–10)" },
  { value: "senior", label: "Senior / HSC (11–12)" },
];

const MODES: { value: string; label: string }[] = [
  { value: "", label: "Any mode" },
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-Person" },
];

const COURSE_MAP = new Map(AU_K12_COURSES.map((c) => [c.id, c]));
const GROUPED_COURSES: Record<CourseStage, typeof AU_K12_COURSES> = {
  primary: [],
  junior: [],
  senior: [],
};
for (const c of AU_K12_COURSES) {
  GROUPED_COURSES[c.stage].push(c);
}

function applyFilters(
  tutors: PublicTutor[],
  courseId: string,
  stage: string,
  mode: string,
  maxRate: number,
): PublicTutor[] {
  return tutors.filter((t) => {
    if (courseId && !t.courses.includes(courseId)) return false;
    if (stage && !courseId) {
      const hasStage = t.courses.some(
        (id) => COURSE_MAP.get(id)?.stage === stage,
      );
      if (!hasStage) return false;
    }
    if (mode === "online" && t.teachingMode === "in-person") return false;
    if (mode === "in-person" && t.teachingMode === "online") return false;
    if (t.hourlyRate > maxRate) return false;
    return true;
  });
}

export default function FindTutor() {
  const [tutors, setTutors] = useState<PublicTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [courseId, setCourseId] = useState("");
  const [stage, setStage] = useState("");
  const [mode, setMode] = useState("");
  const [maxRate, setMaxRate] = useState(200);

  useEffect(() => {
    searchTutorsFn({})
      .then((res) => setTutors(res.data.tutors))
      .catch(() => setError("Could not load tutors. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => applyFilters(tutors, courseId, stage, mode, maxRate),
    [tutors, courseId, stage, mode, maxRate],
  );

  const hasActiveFilters = courseId || stage || mode || maxRate < 200;

  function clearFilters() {
    setCourseId("");
    setStage("");
    setMode("");
    setMaxRate(200);
  }

  const filterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-slate-900">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-violet-600 hover:text-violet-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Subject
        </label>
        <select
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            if (e.target.value) setStage("");
          }}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        >
          <option value="">All subjects</option>
          {(["primary", "junior", "senior"] as CourseStage[]).map((s) => (
            <optgroup key={s} label={STAGE_LABELS[s]}>
              {GROUPED_COURSES[s].map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Stage (only visible when no specific course is selected) */}
      {!courseId && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Year Level
          </label>
          <div className="mt-2 space-y-2">
            {STAGES.map((s) => (
              <label
                key={s.value}
                className="flex cursor-pointer items-center gap-2.5"
              >
                <input
                  type="radio"
                  name="stage"
                  value={s.value}
                  checked={stage === s.value}
                  onChange={() => setStage(s.value)}
                  className="h-4 w-4 accent-violet-600"
                />
                <span className="text-sm text-slate-700">{s.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Teaching mode */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Teaching Mode
        </label>
        <div className="mt-2 space-y-2">
          {MODES.map((m) => (
            <label
              key={m.value}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="radio"
                name="mode"
                value={m.value}
                checked={mode === m.value}
                onChange={() => setMode(m.value)}
                className="h-4 w-4 accent-violet-600"
              />
              <span className="text-sm text-slate-700">{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Max hourly rate */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Max Hourly Rate
        </label>
        <div className="mt-2">
          <div className="mb-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900">${maxRate}</span>
            {maxRate === 200 && (
              <span className="text-xs text-slate-400">(any)</span>
            )}
            <span className="ml-0.5 text-xs text-slate-400">/hr</span>
          </div>
          <input
            type="range"
            min={20}
            max={200}
            step={5}
            value={maxRate}
            onChange={(e) => setMaxRate(Number(e.target.value))}
            className="w-full accent-violet-600"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>$20</span>
            <span>$200</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-white font-body text-slate-900">
      <Navbar />

      {/* Hero header */}
      <div className="bg-gradient-to-b from-violet-50 to-white px-6 pb-10 pt-12 md:px-10">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-700 shadow-sm">
            <GraduationCapIcon className="h-3.5 w-3.5" />
            Find a Tutor
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Find your{" "}
            <span className="italic text-violet-600">perfect</span> tutor.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-600 md:text-base">
            Browse verified K–12 tutors across Sydney. Filter by subject, year
            level, teaching mode, and budget.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-10">
        {/* Mobile filter toggle */}
        <div className="mb-4 flex items-center justify-between md:hidden">
          <p className="text-sm text-slate-500">
            {loading
              ? "Loading…"
              : `${filtered.length} tutor${filtered.length !== 1 ? "s" : ""} found`}
          </p>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700"
          >
            {filtersOpen ? (
              <>
                <XIcon className="h-4 w-4" />
                Close
              </>
            ) : (
              <>
                <SlidersIcon className="h-4 w-4" />
                Filters{hasActiveFilters ? " •" : ""}
              </>
            )}
          </button>
        </div>

        {/* Mobile filter panel */}
        {filtersOpen && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:hidden">
            {filterPanel}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-60 shrink-0 md:block">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {filterPanel}
            </div>
          </aside>

          {/* Results */}
          <main className="min-w-0 flex-1">
            {/* Results header */}
            <div className="mb-5 hidden items-center justify-between md:flex">
              <p className="text-sm font-medium text-slate-600">
                {loading ? (
                  <span className="inline-block h-4 w-32 animate-pulse rounded-full bg-slate-100" />
                ) : (
                  <>
                    <span className="font-bold text-slate-900">
                      {filtered.length}
                    </span>{" "}
                    tutor{filtered.length !== 1 ? "s" : ""} found
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="ml-3 text-xs text-violet-600 hover:text-violet-700"
                      >
                        Clear filters
                      </button>
                    )}
                  </>
                )}
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[380px]">
                    <TutorCardSkeleton />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-4 py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
                  <GraduationCapIcon className="h-8 w-8 text-violet-400" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-slate-900">
                    No tutors found
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {hasActiveFilters
                      ? "Try broadening your filters."
                      : "No approved tutors are listed yet."}
                  </p>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((tutor) => (
                  <TutorCard key={tutor.uid} tutor={tutor} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
