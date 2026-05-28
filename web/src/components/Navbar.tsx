import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { GraduationCapIcon } from "./icons";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="w-full bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-indigo-900 transition hover:opacity-90"
          aria-label="MentorMatch home"
        >
          <GraduationCapIcon className="h-7 w-7 text-indigo-700" />
          <span className="font-display text-xl font-bold tracking-tight">
            MentorMatch
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/find-a-tutor"
            className="text-sm font-semibold text-slate-600 transition hover:text-violet-600"
          >
            Find a Tutor
          </Link>
          {user ? (
            <>
              <span className="text-sm font-medium text-slate-600">
                {user.displayName || user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="rounded-full border border-violet-500 px-5 py-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-50 active:scale-[0.98]"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-violet-300/50 transition hover:bg-violet-600 active:scale-[0.98]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-slate-700 transition ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {mobileOpen && (
        <div className="mx-4 mb-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg md:hidden">
          <ul className="flex flex-col gap-2 text-sm">
            {user ? (
              <li>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Sign Out
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/signin"
                    className="block w-full rounded-full border border-violet-500 px-5 py-2.5 text-center text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="block w-full rounded-full bg-violet-500 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-violet-600"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
