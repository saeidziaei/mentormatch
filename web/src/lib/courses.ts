// IMPORTANT: keep this list in sync with functions/src/courses.ts.
// The backend is the validation source of truth.

export type CourseStage = "primary" | "junior" | "senior";

export interface Course {
  id: string;
  name: string;
  stage: CourseStage;
}

export const AU_K12_COURSES: readonly Course[] = [
  { id: "primary-english", name: "English (Primary)", stage: "primary" },
  { id: "primary-mathematics", name: "Mathematics (Primary)", stage: "primary" },
  { id: "primary-science", name: "Science (Primary)", stage: "primary" },
  { id: "primary-hass", name: "HASS (Primary)", stage: "primary" },

  { id: "english-7-10", name: "English (Years 7–10)", stage: "junior" },
  { id: "mathematics-7-10", name: "Mathematics (Years 7–10)", stage: "junior" },
  { id: "science-7-10", name: "Science (Years 7–10)", stage: "junior" },
  { id: "history-7-10", name: "History (Years 7–10)", stage: "junior" },
  { id: "geography-7-10", name: "Geography (Years 7–10)", stage: "junior" },
  { id: "civics-7-10", name: "Civics & Citizenship", stage: "junior" },
  { id: "economics-business-7-10", name: "Economics & Business (Years 7–10)", stage: "junior" },
  { id: "lote-7-10", name: "Languages (LOTE) (Years 7–10)", stage: "junior" },
  { id: "design-tech-7-10", name: "Design & Technology", stage: "junior" },
  { id: "digital-tech-7-10", name: "Digital Technologies", stage: "junior" },

  { id: "english-standard", name: "English Standard (HSC)", stage: "senior" },
  { id: "english-advanced", name: "English Advanced (HSC)", stage: "senior" },
  { id: "english-extension", name: "English Extension (HSC)", stage: "senior" },
  { id: "mathematics-standard", name: "Mathematics Standard (HSC)", stage: "senior" },
  { id: "mathematics-advanced", name: "Mathematics Advanced (HSC)", stage: "senior" },
  { id: "mathematics-extension-1", name: "Mathematics Extension 1 (HSC)", stage: "senior" },
  { id: "mathematics-extension-2", name: "Mathematics Extension 2 (HSC)", stage: "senior" },
  { id: "biology", name: "Biology (HSC)", stage: "senior" },
  { id: "chemistry", name: "Chemistry (HSC)", stage: "senior" },
  { id: "physics", name: "Physics (HSC)", stage: "senior" },
  { id: "earth-env-science", name: "Earth & Environmental Science (HSC)", stage: "senior" },
  { id: "economics", name: "Economics (HSC)", stage: "senior" },
  { id: "business-studies", name: "Business Studies (HSC)", stage: "senior" },
  { id: "legal-studies", name: "Legal Studies (HSC)", stage: "senior" },
  { id: "modern-history", name: "Modern History (HSC)", stage: "senior" },
  { id: "ancient-history", name: "Ancient History (HSC)", stage: "senior" },
  { id: "geography-senior", name: "Geography (HSC)", stage: "senior" },
  { id: "pdhpe", name: "PDHPE (HSC)", stage: "senior" },
  { id: "software-engineering", name: "Software Engineering (HSC)", stage: "senior" },
  { id: "visual-arts", name: "Visual Arts (HSC)", stage: "senior" },
  { id: "music", name: "Music (HSC)", stage: "senior" },
  { id: "drama", name: "Drama (HSC)", stage: "senior" },
];

export const STAGE_LABELS: Record<CourseStage, string> = {
  primary: "Primary (F–6)",
  junior: "Junior Secondary (7–10)",
  senior: "Senior (HSC / Years 11–12)",
};
