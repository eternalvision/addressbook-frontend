"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { apiRequest } from "@/lib/api";
import { auth } from "@/lib/firebase";
import type { AuthData, AuthResponse, Credentials } from "@/lib/types";

type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthContextValue = {
  session: AuthData | null;
  status: AuthStatus;
  login: (credentials: Credentials) => Promise<void>;
  signup: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
};

const storageKey = "addressbook-session";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthData | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const persistSession = useCallback(async (nextSession: AuthData) => {
    await signInWithCustomToken(auth, nextSession.firebaseToken);
    localStorage.setItem(storageKey, JSON.stringify(nextSession));
    setSession(nextSession);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    const restore = async () => {
      const stored = localStorage.getItem(storageKey);

      if (!stored) {
        setStatus("anonymous");
        return;
      }

      try {
        const parsed = JSON.parse(stored) as AuthData;
        await persistSession(parsed);
      } catch {
        localStorage.removeItem(storageKey);
        setSession(null);
        setStatus("anonymous");
      }
    };

    void restore();
  }, [persistSession]);

  const authenticate = useCallback(
    async (path: "/auth/login" | "/auth/signup", credentials: Credentials) => {
      const response = await apiRequest<AuthResponse>(path, {
        method: "POST",
        body: credentials,
      });

      await persistSession(response.data);
    },
    [persistSession],
  );

  const login = useCallback(
    (credentials: Credentials) => authenticate("/auth/login", credentials),
    [authenticate],
  );

  const signup = useCallback(
    (credentials: Credentials) => authenticate("/auth/signup", credentials),
    [authenticate],
  );

  const logout = useCallback(async () => {
    localStorage.removeItem(storageKey);
    await signOut(auth);
    setSession(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo(
    () => ({ session, status, login, signup, logout }),
    [session, status, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
