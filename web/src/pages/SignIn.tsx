import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";
import { SparkleIcon } from "../components/icons";
import { useAuth } from "../lib/auth";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/tutor/onboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white font-body text-slate-900">
      <Navbar />
      <PageBackground>
        <div className="mx-auto flex max-w-md flex-col px-6 py-16 md:py-24">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200 backdrop-blur-sm">
            <SparkleIcon className="h-3.5 w-3.5 text-violet-300" />
            <span>Welcome Back</span>
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
            Sign in to <span className="italic text-violet-300">MentorMatch</span>.
          </h1>

          <form
            onSubmit={onSubmit}
            className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-sm"
          >
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-violet-400/60 focus:bg-white/10"
              />
            </label>

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-white/70">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-violet-400/60 focus:bg-white/10"
              />
            </label>

            {error && (
              <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-900/40 ring-1 ring-violet-400/30 transition hover:bg-violet-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>

            <p className="mt-4 text-center text-xs text-white/60">
              New here?{" "}
              <Link to="/signup" className="font-semibold text-violet-300 hover:text-violet-200">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </PageBackground>
    </div>
  );
}
