"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  api,
  getAccessToken,
  restoreSessionFromCookie,
  setAccessToken,
} from "@/lib/api";
import type { PublicUser } from "@/lib/api-types";

type SessionContextValue = {
  user: PublicUser | null;
  isAuthed: boolean;
  loading: boolean;
  completeAuth: (user: PublicUser) => void;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!getAccessToken()) {
          await restoreSessionFromCookie();
        }
        const me = await api<PublicUser>("/auth/me");
        if (active) setUser(me);
      } catch {
        setAccessToken(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const completeAuth = useCallback((next: PublicUser) => {
    setUser(next);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/auth/logout", { method: "POST", body: JSON.stringify({}) });
    } catch {
      // idempotente — segue mesmo se o token já estiver inválido
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        isAuthed: user !== null,
        loading,
        completeAuth,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}