import { Link } from "react-router-dom";
import { MonitorIcon, ShieldCheckIcon, StarIcon, UserIcon } from "./icons";
import {
  type PublicTutor,
  teachingModeLabel,
  topSubjectNames,
  tutorDisplayName,
  yearLevelLabel,
} from "../lib/tutors";

export type { PublicTutor };

function ModeChip({ mode }: { mode: PublicTutor["teachingMode"] }) {
  const label = teachingModeLabel(mode);
  const Icon = mode === "in-person" ? UserIcon : MonitorIcon;
  const style =
    mode === "online"
      ? "bg-sky-50 text-sky-700"
      : mode === "in-person"
        ? "bg-amber-50 text-amber-700"
        : "bg-violet-50 text-violet-700";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

export default function TutorCard({ tutor }: { tutor: PublicTutor }) {
  const displayName = tutorDisplayName(tutor);
  const subjects = topSubjectNames(tutor.courses, 2);
  const extraCount = Math.max(0, tutor.courses.length - 2);
  const yearLevels = yearLevelLabel(tutor.courses);
  const hasRating = tutor.reviewCount > 0;

  return (
    <Link to={`/tutors/${tutor.uid}`} className="group block h-full">
      <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all duration-200 group-hover:shadow-xl group-hover:ring-violet-200">
        {/* Verified badge */}
        <div className="flex justify-start">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            Verified Tutor
          </span>
        </div>

        {/* Photo */}
        <div className="mt-4 flex justify-center">
          <div className="relative">
            <img
              src={tutor.photoURL}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover ring-2 ring-white shadow-md transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.firstName + "+" + tutor.lastName)}&background=7c3aed&color=fff&size=96`;
              }}
            />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow">
              {tutor.hourlyRate > 0 ? `$${tutor.hourlyRate}` : "—"}
            </span>
          </div>
        </div>

        {/* Name + rating */}
        <div className="mt-4 text-center">
          <h3 className="font-display text-base font-semibold text-slate-900">
            {displayName}
          </h3>
          {hasRating ? (
            <div className="mt-1 flex items-center justify-center gap-1 text-xs">
              <StarIcon className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold text-slate-800">
                {tutor.rating.toFixed(1)}
              </span>
              <span className="text-slate-500">
                ({tutor.reviewCount} review{tutor.reviewCount !== 1 ? "s" : ""})
              </span>
            </div>
          ) : (
            <div className="mt-1 flex justify-center">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                New tutor
              </span>
            </div>
          )}
        </div>

        {/* Subjects */}
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {subjects.map((s) => (
            <span
              key={s}
              className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700"
            >
              {s}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              +{extraCount} more
            </span>
          )}
        </div>
        <p className="mt-1.5 text-center text-xs text-slate-400">{yearLevels}</p>

        {/* Teaching mode */}
        <div className="mt-3 flex justify-center">
          <ModeChip mode={tutor.teachingMode} />
        </div>

        {/* Spacer + rate */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-slate-900">
                ${tutor.hourlyRate}
              </span>
              <span className="ml-0.5 text-xs font-medium text-slate-400">/hr</span>
            </div>
            <span className="rounded-full bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-violet-700">
              View Profile →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function TutorCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 animate-pulse">
      <div className="h-6 w-28 rounded-full bg-slate-100" />
      <div className="mt-4 flex justify-center">
        <div className="h-24 w-24 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="h-4 w-28 rounded-full bg-slate-100" />
        <div className="h-3 w-20 rounded-full bg-slate-100" />
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        <div className="h-5 w-20 rounded-full bg-slate-100" />
        <div className="h-5 w-16 rounded-full bg-slate-100" />
      </div>
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="h-6 w-12 rounded-full bg-slate-100" />
          <div className="h-7 w-24 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
