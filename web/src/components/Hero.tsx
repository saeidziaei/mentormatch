import { useNavigate } from "react-router-dom";
import {
  BadgeCheckIcon,
  IdCardIcon,
  MonitorIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  StarOutlineIcon,
} from "./icons";
import SearchBar from "./SearchBar";

const trustSignals = [
  { icon: ShieldCheckIcon, title: "WWCC", subtitle: "Verified" },
  { icon: BadgeCheckIcon, title: "Qualification", subtitle: "Checked" },
  { icon: IdCardIcon, title: "Identity", subtitle: "Verified" },
  { icon: MonitorIcon, title: "Online &", subtitle: "In-Person Learning" },
  { icon: StarOutlineIcon, title: "Rated by", subtitle: "Students & Parents" },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/wavysea.jpg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-indigo-800/90 to-indigo-950/95"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.25),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-12 md:px-10 md:pb-32 md:pt-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-100 backdrop-blur-sm">
            <PlusIcon className="h-3.5 w-3.5 text-violet-200" />
            <span>Elevate Your Learning</span>
          </div>

          <h1 className="mt-8 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
            Trusted Tutoring for{" "}
            <span className="text-violet-300">Modern Learning</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 md:text-lg">
            Helping students improve results, confidence, and study habits.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-violet-500 px-7 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-900/40 ring-1 ring-violet-400/30 transition hover:bg-violet-600 active:scale-[0.98]"
            >
              Find a Tutor
              <SearchIcon className="h-4 w-4 transition group-hover:scale-110" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/tutor/onboard")}
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/10 active:scale-[0.98]"
            >
              Become a Tutor
            </button>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
            {trustSignals.map(({ icon: Icon, title, subtitle }) => (
              <li key={title} className="flex items-center gap-2.5">
                <Icon className="h-6 w-6 shrink-0 text-violet-200" />
                <div className="text-xs font-medium leading-tight text-white/90">
                  <div>{title}</div>
                  <div>{subtitle}</div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-6 flex items-center gap-2 text-xs text-white/70">
            <ShieldCheckIcon className="h-4 w-4 text-violet-200" />
            All tutors are reviewed and approved before joining MentorMatch.
          </p>
        </div>
      </div>

      {/* Search card overlapping hero bottom */}
      <div className="relative z-20 mx-auto -mt-16 max-w-6xl px-6 md:px-10">
        <SearchBar />
      </div>
    </section>
  );
}
