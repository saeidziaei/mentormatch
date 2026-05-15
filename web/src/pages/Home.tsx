import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";
import { SearchIcon, SparkleIcon } from "../components/icons";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col bg-white font-body text-slate-900">
      <Navbar />

      <PageBackground>
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200 backdrop-blur-sm">
            <SparkleIcon className="h-3.5 w-3.5 text-violet-300" />
            <span>Elevate Your Learning</span>
          </div>

          <h1 className="mt-8 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            Unlock Your Potential with{" "}
            <span className="italic text-violet-300">Expert</span> Mentors.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Connect with vetted, professional tutors for personalized
            learning experiences that fit your schedule.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-violet-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-900/40 ring-1 ring-violet-400/30 transition hover:bg-violet-600 active:scale-[0.98]"
            >
              Find a Tutor
              <SearchIcon className="h-4 w-4 transition group-hover:scale-110" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/tutor/onboard")}
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10 active:scale-[0.98]"
            >
              Become a Tutor
            </button>
          </div>
        </div>
      </PageBackground>
    </div>
  );
}
