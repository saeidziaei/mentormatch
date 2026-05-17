import { useRef } from "react";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";
import TutorCard, { type Tutor } from "./TutorCard";

const featuredTutors: Tutor[] = [
  {
    id: "serah-m",
    name: "Serah M.",
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=faces",
    rating: 4.9,
    reviews: 32,
    subject: "Maths",
    yearLevels: "Years 7–12",
    tags: [
      { label: "Confidence Building", tone: "violet" },
      { label: "Exam Stress Support", tone: "amber" },
    ],
    hourlyRate: 75,
    availability: "Online & In-Person",
  },
  {
    id: "daniel-k",
    name: "Daniel K.",
    photoUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=240&h=240&fit=crop&crop=faces",
    rating: 4.8,
    reviews: 22,
    subject: "English",
    yearLevels: "Years 5–12",
    tags: [
      { label: "Study Skills Support", tone: "emerald" },
      { label: "Patient Teaching", tone: "violet" },
    ],
    hourlyRate: 60,
    availability: "Online Only",
  },
  {
    id: "jessica-l",
    name: "Jessica L.",
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop&crop=faces",
    rating: 4.9,
    reviews: 45,
    subject: "Science",
    yearLevels: "Years 7–12",
    tags: [
      { label: "Confidence Building", tone: "violet" },
      { label: "Exam Prep Specialist", tone: "amber" },
    ],
    hourlyRate: 70,
    availability: "Online & In-Person",
  },
  {
    id: "michael-t",
    name: "Michael T.",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=faces",
    rating: 4.7,
    reviews: 19,
    subject: "Physics",
    yearLevels: "Years 10–12",
    tags: [
      { label: "Study Skills Support", tone: "emerald" },
      { label: "Patient Teaching", tone: "violet" },
    ],
    hourlyRate: 80,
    availability: "Online Only",
  },
  {
    id: "olivia-p",
    name: "Olivia P.",
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop&crop=faces",
    rating: 4.9,
    reviews: 37,
    subject: "History",
    yearLevels: "Years 7–12",
    tags: [
      { label: "Confidence Building", tone: "violet" },
      { label: "Beginner Friendly", tone: "amber" },
    ],
    hourlyRate: 65,
    availability: "Online & In-Person",
  },
];

export default function TutorsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="bg-slate-50 px-6 pb-16 md:px-10 md:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
              Meet Our Top Tutors
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Carefully vetted tutors helping students achieve their goals
              with confidence.
            </p>
          </div>
          <a
            href="#tutors"
            className="hidden items-center gap-1.5 text-sm font-semibold text-violet-600 transition hover:text-violet-700 sm:inline-flex"
          >
            View all tutors
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>

        <div className="relative mt-8">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous tutors"
            className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-100 transition hover:text-violet-600 md:grid"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next tutors"
            className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-600 shadow-md ring-1 ring-slate-100 transition hover:text-violet-600 md:grid"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {featuredTutors.map((tutor) => (
              <div key={tutor.id} className="snap-start">
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
