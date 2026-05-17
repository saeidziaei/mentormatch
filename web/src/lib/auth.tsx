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
  { email: string; displayName?: string },
  { ok: true }
>(functions, "requestSignupCode");

const verifySignupCodeCallable = httpsCallable<
  { email: string; code: string; password: string; displayName?: string },
  { ok: true; uid: string }
>(functions, "verifySignupCode");

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  requestSignupCode: (email: string, displayName?: string) => Promise<void>;
  verifySignupAndSignIn: (
    email: string,
    code: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      async signIn(email, password) {
        await signInWithEmailAndPassword(auth, email, password);
      },
      async requestSignupCode(email, displayName) {
        await requestSignupCodeCallable({ email, displayName });
      },
      async verifySignupAndSignIn(email, code, password, displayName) {
        await verifySignupCodeCallable({ email, code, password, displayName });
        await signInWithEmailAndPassword(auth, email, password);
      },
      async signOut() {
        await fbSignOut(auth);
      },
    }),
    [user, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
