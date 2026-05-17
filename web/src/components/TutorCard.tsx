import {
  BadgeCheckIcon,
  GraduationCapIcon,
  HeartIcon,
  IdCardIcon,
  MonitorIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon,
} from "./icons";

export type TutorTagTone = "violet" | "amber" | "emerald";

export type TutorTag = {
  label: string;
  tone?: TutorTagTone;
};

export type Tutor = {
  id: string;
  name: string;
  photoUrl: string;
  rating: number;
  reviews: number;
  subject: string;
  yearLevels: string;
  tags: TutorTag[];
  hourlyRate: number;
  availability: "Online & In-Person" | "Online Only" | "In-Person Only";
  verified?: boolean;
};

const tagToneClasses: Record<TutorTagTone, string> = {
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
};

export default function TutorCard({ tutor }: { tutor: Tutor }) {
  const AvailabilityIcon =
    tutor.availability === "Online Only" ? MonitorIcon : UserIcon;

  return (
    <article className="flex w-72 shrink-0 flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-lg hover:ring-violet-200">
      <div className="flex items-start justify-between">
        {tutor.verified !== false && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheckIcon className="h-3.5 w-3.5" />
            Verified Tutor
          </span>
        )}
        <button
          type="button"
          aria-label={`Save ${tutor.name}`}
          className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-rose-500"
        >
          <HeartIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex justify-center">
        <img
          src={tutor.photoUrl}
          alt={tutor.name}
          className="h-24 w-24 rounded-full object-cover ring-2 ring-white shadow"
          loading="lazy"
        />
      </div>

      <div className="mt-3 text-center">
        <h3 className="text-base font-semibold text-slate-900">{tutor.name}</h3>
        <div className="mt-1 flex items-center justify-center gap-1 text-xs">
          <StarIcon className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-semibold text-slate-800">
            {tutor.rating.toFixed(1)}
          </span>
          <span className="text-slate-500">({tutor.reviews} reviews)</span>
        </div>
        <div className="mt-1.5 text-xs text-slate-600">
          {tutor.subject}
          <span className="mx-1.5 text-slate-300">•</span>
          {tutor.yearLevels}
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {tutor.tags.map((tag) => (
          <li key={tag.label}>
            <span
              className={`block rounded-full px-3 py-1 text-center text-xs font-medium ${
                tagToneClasses[tag.tone ?? "violet"]
              }`}
            >
              {tag.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-center gap-3 text-slate-400">
        <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
        <GraduationCapIcon className="h-4 w-4" />
        <IdCardIcon className="h-4 w-4" />
        <BadgeCheckIcon className="h-4 w-4" />
      </div>

      <div className="mt-3 border-t border-slate-100 pt-3 text-center">
        <div className="text-lg font-bold text-slate-900">
          ${tutor.hourlyRate}
          <span className="ml-0.5 text-xs font-medium text-slate-500">/hr</span>
        </div>
        <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <AvailabilityIcon className="h-3.5 w-3.5" />
          {tutor.availability}
        </div>
      </div>
    </article>
  );
}
