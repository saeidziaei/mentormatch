import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "../firebase";

const requestSignupCodeCallable = httpsCallable<
  { email: string },
  { ok: true }
>(functions, "requestSignupCode");

const verifySignupCodeCallable = httpsCallable<
  { email: string; code: string; password: string },
  { ok: true; uid: string }
>(functions, "verifySignupCode");

const sendPasswordResetFn = httpsCallable<{ email: string }, { ok: true }>(
  functions,
  "sendPasswordReset",
);

const claimAdminRoleFn = httpsCallable<Record<string, never>, { ok: true }>(
  functions,
  "claimAdminRole",
);

interface AuthCtx {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  requestSignupCode: (email: string) => Promise<void>;
  verifySignupAndSignIn: (email: string, code: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  claimAdminRole: () => Promise<void>;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        const result = await u.getIdTokenResult();
        setIsAdmin(result.claims["admin"] === true);
      } else {
        setIsAdmin(false);
      }
      setUser(u);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      isAdmin,
      loading,
      async signIn(email, password) {
        await signInWithEmailAndPassword(auth, email, password);
      },
      async requestSignupCode(email) {
        await requestSignupCodeCallable({ email });
      },
      async verifySignupAndSignIn(email, code, password) {
        await verifySignupCodeCallable({ email, code, password });
        await signInWithEmailAndPassword(auth, email, password);
      },
      async sendPasswordReset(email) {
        await sendPasswordResetFn({ email });
      },
      async claimAdminRole() {
        await claimAdminRoleFn({});
        // Force-refresh token so the new claim is reflected immediately.
        const result = await auth.currentUser!.getIdTokenResult(true);
        setIsAdmin(result.claims["admin"] === true);
      },
      async refreshUser() {
        if (auth.currentUser) {
          const result = await auth.currentUser.getIdTokenResult(true);
          setIsAdmin(result.claims["admin"] === true);
          await auth.currentUser.reload();
        }
        setUser(auth.currentUser);
      },
      async signOut() {
        await fbSignOut(auth);
      },
    }),
    [user, isAdmin, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
