import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageBackground from "../components/PageBackground";
import { SparkleIcon } from "../components/icons";
import { useAuth } from "../lib/auth";

type Step = "details" | "code";

const RESEND_COOLDOWN_SECS = 30;

export default function SignUp() {
  const { requestSignupCode, verifySignupAndSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/tutor/onboard";

  const [step, setStep] = useState<Step>("details");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  useEffect(() => {
    if (step === "code") {
      codeRefs.current[0]?.focus();
    }
  }, [step]);

  const onSubmitDetails = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await requestSignupCode(email.trim(), displayName.trim() || undefined);
      setStep("code");
      setResendIn(RESEND_COOLDOWN_SECS);
      setCode(Array(6).fill(""));
    } catch (err) {
      setError(friendlyError(err, "Couldn't send the code. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const joined = code.join("");
    if (joined.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setSubmitting(true);
    try {
      await verifySignupAndSignIn(
        email.trim(),
        joined,
        password,
        displayName.trim() || undefined,
      );
      navigate(from, { replace: true });
    } catch (err) {
      setError(friendlyError(err, "Verification failed. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (resendIn > 0 || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await requestSignupCode(email.trim(), displayName.trim() || undefined);
      setResendIn(RESEND_COOLDOWN_SECS);
      setCode(Array(6).fill(""));
      codeRefs.current[0]?.focus();
    } catch (err) {
      setError(friendlyError(err, "Couldn't resend. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const setDigit = (i: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      codeRefs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) codeRefs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = Array(6).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setCode(next);
    codeRefs.current[Math.min(text.length, 5)]?.focus();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white font-body text-slate-900">
      <Navbar />
      <PageBackground>
        <div className="mx-auto flex max-w-md flex-col px-6 py-16 md:py-24">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200 backdrop-blur-sm">
            <SparkleIcon className="h-3.5 w-3.5 text-violet-300" />
            <span>{step === "details" ? "Become a Tutor" : "Verify your email"}</span>
          </div>

          {step === "details" ? (
            <>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
                Create your{" "}
                <span className="italic text-violet-300">tutor</span> account.
              </h1>
              <p className="mt-3 max-w-md text-sm text-white/70">
                Start building your profile in minutes. Approval is required before
                students can find you.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
                Check your{" "}
                <span className="italic text-violet-300">inbox</span>.
              </h1>
              <p className="mt-3 max-w-md text-sm text-white/70">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-white">{email}</span>. It
                expires in 10 minutes.
              </p>
            </>
          )}

          {step === "details" ? (
            <form
              onSubmit={onSubmitDetails}
              className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-sm"
            >
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70">
                Full name
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Jane Smith"
                  className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-violet-400/60 focus:bg-white/10"
                />
              </label>

              <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-white/70">
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
                {submitting ? "Sending code…" : "Send verification code"}
              </button>

              <p className="mt-4 text-center text-xs text-white/60">
                Already have an account?{" "}
                <Link to="/signin" className="font-semibold text-violet-300 hover:text-violet-200">
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <form
              onSubmit={onSubmitCode}
              className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-sm"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Verification code
              </div>
              <div className="mt-3 flex justify-between gap-2" onPaste={onPaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      codeRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    className="h-14 w-12 rounded-lg border border-white/15 bg-white/5 text-center font-display text-2xl font-semibold text-white outline-none transition focus:border-violet-400/60 focus:bg-white/10"
                  />
                ))}
              </div>

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
                {submitting ? "Verifying…" : "Verify & create account"}
              </button>

              <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                <button
                  type="button"
                  onClick={() => {
                    setStep("details");
                    setError(null);
                  }}
                  className="font-semibold text-violet-300 hover:text-violet-200"
                >
                  ← Edit details
                </button>
                <button
                  type="button"
                  onClick={onResend}
                  disabled={resendIn > 0 || submitting}
                  className="font-semibold text-violet-300 transition hover:text-violet-200 disabled:cursor-not-allowed disabled:text-white/40"
                >
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </PageBackground>
    </div>
  );
}

function friendlyError(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    const msg = err.message;
    const cleaned = msg.replace(/^Firebase: /, "").replace(/\s*\(.*\)\s*\.?$/, "");
    return cleaned || fallback;
  }
  return fallback;
}
