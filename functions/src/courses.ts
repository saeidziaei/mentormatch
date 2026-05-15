// IMPORTANT: keep this list in sync with web/src/lib/courses.ts.
// The backend is the validation source of truth.

export type CourseStage = "primary" | "junior" | "senior";

export interface Course {
  id: string;
  name: string;
  stage: CourseStage;
}

type R = readonly [id: string, name: string, stage: CourseStage];

const ROWS: readonly R[] = [
  // Primary (F–6)
  ["primary-english", "English (Primary)", "primary"],
  ["primary-mathematics", "Mathematics (Primary)", "primary"],
  ["primary-science", "Science (Primary)", "primary"],
  ["primary-hass", "HASS (Primary)", "primary"],

  // Junior secondary (Years 7–10)
  ["english-7-10", "English (Years 7–10)", "junior"],
  ["mathematics-7-10", "Mathematics (Years 7–10)", "junior"],
  ["science-7-10", "Science (Years 7–10)", "junior"],
  ["history-7-10", "History (Years 7–10)", "junior"],
  ["geography-7-10", "Geography (Years 7–10)", "junior"],
  ["civics-7-10", "Civics & Citizenship", "junior"],
  ["economics-business-7-10", "Economics & Business (7–10)", "junior"],
  ["lote-7-10", "Languages (LOTE) (Years 7–10)", "junior"],
  ["design-tech-7-10", "Design & Technology", "junior"],
  ["digital-tech-7-10", "Digital Technologies", "junior"],

  // Senior (Years 11–12)
  ["english-standard", "English Standard (HSC)", "senior"],
  ["english-advanced", "English Advanced (HSC)", "senior"],
  ["english-extension", "English Extension (HSC)", "senior"],
  ["mathematics-standard", "Mathematics Standard (HSC)", "senior"],
  ["mathematics-advanced", "Mathematics Advanced (HSC)", "senior"],
  ["mathematics-extension-1", "Mathematics Extension 1 (HSC)", "senior"],
  ["mathematics-extension-2", "Mathematics Extension 2 (HSC)", "senior"],
  ["biology", "Biology (HSC)", "senior"],
  ["chemistry", "Chemistry (HSC)", "senior"],
  ["physics", "Physics (HSC)", "senior"],
  ["earth-env-science", "Earth & Environmental Science (HSC)", "senior"],
  ["economics", "Economics (HSC)", "senior"],
  ["business-studies", "Business Studies (HSC)", "senior"],
  ["legal-studies", "Legal Studies (HSC)", "senior"],
  ["modern-history", "Modern History (HSC)", "senior"],
  ["ancient-history", "Ancient History (HSC)", "senior"],
  ["geography-senior", "Geography (HSC)", "senior"],
  ["pdhpe", "PDHPE (HSC)", "senior"],
  ["software-engineering", "Software Engineering (HSC)", "senior"],
  ["visual-arts", "Visual Arts (HSC)", "senior"],
  ["music", "Music (HSC)", "senior"],
  ["drama", "Drama (HSC)", "senior"],
];

export const AU_K12_COURSES: readonly Course[] = ROWS.map(
  ([id, name, stage]): Course => ({id, name, stage}),
);

export const COURSE_IDS: ReadonlySet<string> = new Set(
  AU_K12_COURSES.map((c) => c.id),
);
