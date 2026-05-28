import { useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, claimAdminRole } = useAuth();
  const location = useLocation();
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(false);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0b0a2a] text-white/70">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (!isAdmin) {
    const handleClaim = async () => {
      setClaimError(null);
      setClaiming(true);
      try {
        await claimAdminRole();
        setClaimed(true);
      } catch (err) {
        setClaimError(err instanceof Error ? err.message : "Access denied.");
      } finally {
        setClaiming(false);
      }
    };

    if (claimed) {
      return <>{children}</>;
    }

    return (
      <div className="grid min-h-screen place-items-center bg-[#0b0a2a] px-6">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20 text-3xl">
            🔐
          </div>
          <h1 className="font-display text-xl font-bold text-white">Admin Access</h1>
          <p className="mt-2 text-sm text-white/60">
            Your account needs admin privileges to view this page.
          </p>
          {claimError && (
            <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {claimError}
            </p>
          )}
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="mt-6 w-full rounded-full bg-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:bg-violet-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {claiming ? "Checking…" : "Activate Admin Access"}
          </button>
          <p className="mt-3 text-xs text-white/40">
            Signed in as {user.email}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
