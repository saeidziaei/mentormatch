import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";
import TutorCard, { TutorCardSkeleton } from "./TutorCard";
import type { PublicTutor } from "../lib/tutors";
import { useRef } from "react";

const searchTutorsFn = httpsCallable<
  Record<string, never>,
  { tutors: PublicTutor[] }
>(functions, "searchTutors");

export default function TutorsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [tutors, setTutors] = useState<PublicTutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchTutorsFn({})
      .then((res) => setTutors(res.data.tutors.slice(0, 8)))
      .catch(() => {/* silently hide the section */})
      .finally(() => setLoading(false));
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 304, behavior: "smooth" });
  };

  if (!loading && tutors.length === 0) return null;

  return (
    <section className="bg-slate-50 px-6 pb-16 md:px-10 md:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
              Meet Our Top Tutors
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Carefully vetted tutors helping students achieve their goals with
              confidence.
            </p>
          </div>
          <Link
            to="/find-a-tutor"
            className="hidden items-center gap-1.5 text-sm font-semibold text-violet-600 transition hover:text-violet-700 sm:inline-flex"
          >
            View all tutors
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
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
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-72 shrink-0 snap-start">
                    <TutorCardSkeleton />
                  </div>
                ))
              : tutors.map((tutor) => (
                  <div key={tutor.uid} className="w-72 shrink-0 snap-start">
                    <TutorCard tutor={tutor} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
