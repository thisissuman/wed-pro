"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { clearRecoveryCopies, setRecoveryOwner } from "@/lib/invitation-recovery";
import { createClient } from "@/utils/supabase/client";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createClient();
  }, []);
  const previousOwner = useRef<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    const syncSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!active) return;

      const sessionUser = sessionData.session?.user ?? null;
      if (previousOwner.current && previousOwner.current !== sessionUser?.id) clearRecoveryCopies();
      previousOwner.current = sessionUser?.id ?? null;
      setRecoveryOwner(sessionUser?.id ?? null);
      setUser(sessionUser);
      setStatus(sessionUser ? "authenticated" : "unauthenticated");
    };

    void syncSession();

    // Refresh session in the background during long editor sessions (no full page reload).
    const keepAlive = window.setInterval(() => {
      void supabase.auth.getSession();
    }, 10 * 60 * 1000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null;
      if (event === "SIGNED_OUT" || (previousOwner.current && previousOwner.current !== nextUser?.id)) clearRecoveryCopies();
      previousOwner.current = nextUser?.id ?? null;
      setRecoveryOwner(nextUser?.id ?? null);
      setUser(nextUser);
      setStatus(nextUser ? "authenticated" : "unauthenticated");
    });

    return () => {
      active = false;
      window.clearInterval(keepAlive);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setRecoveryOwner(null);
    clearRecoveryCopies();
    setUser(null);
    setStatus("unauthenticated");
  }, [supabase]);

  const value = useMemo(
    () => ({
      user,
      status,
      signOut,
    }),
    [user, status, signOut]
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
