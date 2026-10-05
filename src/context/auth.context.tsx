"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Session = {
  username: string;
  createdAt: number;
  expiresAt: number; // ms epoch
};

export type AuthContextType = {
  user: Session | null;
  error: string | null;
  signin: (creds: { username: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TTL_MS = 6 * 60 * 60 * 1000;
const STORAGE_KEY = "ayidh_industry_auth_session";

function isSessionObj(obj: unknown): obj is Session {
  if (typeof obj !== "object" || obj === null) return false;
  const candidate = obj as Partial<Record<keyof Session, unknown>>;
  return (
    typeof candidate.username === "string" &&
    typeof candidate.createdAt === "number" &&
    typeof candidate.expiresAt === "number"
  );
}

/** Robust loader: returns a Session or null (does NOT remove storage on parse failures) */
function loadSessionFromStorage(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // tolerant coercion: sometimes values may be stored as strings, coerce them
    if (parsed && typeof parsed === "object") {
      const candidate = {
        username: parsed.username,
        createdAt: typeof parsed.createdAt === "string" ? Number(parsed.createdAt) : parsed.createdAt,
        expiresAt: typeof parsed.expiresAt === "string" ? Number(parsed.expiresAt) : parsed.expiresAt,
      };

      if (isSessionObj(candidate)) {
        return candidate;
      } else {
        // Not a valid session; don't remove immediately — return null and log for debugging.
        // If you want to clean up stale/clearly-corrupt storage, do that in an explicit cleanup path.
        console.warn("Auth: session in storage failed validation", parsed);
        return null;
      }
    }

    return null;
  } catch (err) {
    console.warn("Auth: failed to parse session from storage", err);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Restore the session after mount: localStorage is unavailable during
  // server rendering, so reading it in the initial state would cause a
  // hydration mismatch.
  useEffect(() => {
    const session = loadSessionFromStorage();
    if (!session) return;

    if (session.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from browser storage
    setUser(session);
  }, []);

  const signin = async ({ username, password }: { username: string; password: string }) => {
    setError(null);
    try {
      const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER ?? "";
      const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS ?? "";

      if (username === ADMIN_USER && password === ADMIN_PASS) {
        const now = Date.now();
        const session: Session = {
          username,
          createdAt: now,
          expiresAt: now + TTL_MS,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setUser(session);
        return { ok: true };
      }

      setError("Invalid credentials");
      return { ok: false, error: "Invalid credentials" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      return { ok: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  // Expired sessions are never set (checked on load) and are cleared by the
  // background checker below, so a present user is an active session.
  const isAuthenticated = user !== null;

  // background checker only when a session exists (reduces accidental removals when nothing is present)
  useEffect(() => {
    if (!user) return; // only check while logged in

    const interval = setInterval(() => {
      try {
        const session = loadSessionFromStorage();
        if (!session) {
          // if storage missing or malformed while we had a user, log and clear
          console.warn("Auth: session disappeared or malformed in storage; logging out.");
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
          return;
        }
        if (session.expiresAt <= Date.now()) {
          localStorage.removeItem(STORAGE_KEY);
          setUser(null);
        }
      } catch {
        // ignore errors here
      }
    }, 60_000); // every 60s

    return () => clearInterval(interval);
  }, [user]);

  const value = useMemo(() => ({ user, error, signin, logout, isAuthenticated }), [user, error, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
