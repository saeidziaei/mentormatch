import { Card } from "./Card";
import { Button } from "./Button";

interface Tutor {
  id: string;
  name: string;
  photo: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  available: boolean;
}

export function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <Card interactive className="flex flex-col gap-4 p-0 overflow-hidden">
      <img
        src={tutor.photo}
        alt={tutor.name}
        className="h-48 w-full object-cover"
      />
      <div className="flex flex-col gap-3 px-6 pb-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-dark">
            {tutor.name}
          </h3>
          {tutor.available && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Available
            </span>
          )}
        </div>

        <p className="text-sm text-muted line-clamp-1">
          {tutor.subjects.join(" · ")}
        </p>

        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} aria-hidden>
              {i < Math.round(tutor.rating) ? "★" : "☆"}
            </span>
          ))}
          <span className="ml-1 text-sm text-muted">
            {tutor.rating.toFixed(1)} ({tutor.reviewCount})
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-body text-base font-semibold text-dark">
            ${tutor.hourlyRate}
            <span className="text-sm font-normal text-muted"> /hr</span>
          </span>
          <Button variant="primary" className="px-5 py-2 text-sm">
            Book session
          </Button>
        </div>
      </div>
    </Card>
  );
}
