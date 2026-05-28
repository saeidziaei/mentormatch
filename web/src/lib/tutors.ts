import { AU_K12_COURSES } from "./courses";

export interface PublicTutor {
  uid: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  bio: string;
  courses: string[];
  hourlyRate: number;
  teachingMode: "online" | "in-person" | "both";
  suburb: string | null;
  availableDays: string[];
  rating: number;
  reviewCount: number;
  createdAt: string | null;
}

export interface PublicTutorDetail extends PublicTutor {
  availability: Record<string, { enabled: boolean; from: string; to: string }>;
}

const COURSE_MAP = new Map(AU_K12_COURSES.map((c) => [c.id, c]));

export function tutorDisplayName(
  t: Pick<PublicTutor, "firstName" | "lastName">,
): string {
  return `${t.firstName} ${t.lastName.charAt(0)}.`;
}

export function teachingModeLabel(mode: PublicTutor["teachingMode"]): string {
  if (mode === "online") return "Online Only";
  if (mode === "in-person") return "In-Person Only";
  return "Online & In-Person";
}

export function topSubjectNames(courses: string[], max = 2): string[] {
  return courses
    .slice(0, max)
    .map((id) => COURSE_MAP.get(id)?.name ?? id);
}

export function yearLevelLabel(courses: string[]): string {
  const stages = new Set(
    courses.map((id) => COURSE_MAP.get(id)?.stage).filter(Boolean),
  );
  const parts: string[] = [];
  if (stages.has("primary")) parts.push("F–6");
  if (stages.has("junior")) parts.push("7–10");
  if (stages.has("senior")) parts.push("11–12");
  if (parts.length === 0) return "All levels";
  if (parts.length === 3) return "Years F–12";
  return "Years " + parts.join(", ");
}

export function availableDaysSummary(days: string[]): string {
  const SHORT: Record<string, string> = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  };
  if (days.length === 0) return "No availability";
  if (days.length >= 5) return `${days.length} days/week`;
  return days
    .slice(0, 3)
    .map((d) => SHORT[d] ?? d)
    .join(", ") + (days.length > 3 ? ` +${days.length - 3}` : "");
}
