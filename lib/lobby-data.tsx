"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type {
  DailyCurrentData,
  RankedLeaderboardData,
  RankedProfileData,
  RankedStatsData,
  UserProfile,
} from "@/lib/api-types";
import { useSession } from "@/lib/session";

type LobbyDataState = {
  profile: UserProfile | null;
  ranked: RankedProfileData | null;
  rankedStats: RankedStatsData | null;
  leaderboard: RankedLeaderboardData | null;
  daily: DailyCurrentData | null;
};

type LobbyDataContextValue = LobbyDataState & {
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const LobbyDataContext = createContext<LobbyDataContextValue | null>(null);

export function LobbyDataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthed, loading: sessionLoading } = useSession();
  const [data, setData] = useState<LobbyDataState>({
    profile: null,
    ranked: null,
    rankedStats: null,
    leaderboard: null,
    daily: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const load = useCallback(async () => {
    if (!isAuthed || sessionLoading) return;
    setLoading(true);
    setError(null);
    const [profile, ranked, rankedStats, leaderboard, daily] = await Promise.allSettled([
      api<UserProfile>("/users/profile"),
      api<RankedProfileData>("/ranked/me"),
      api<RankedStatsData>("/ranked/me/stats"),
      api<RankedLeaderboardData>("/ranked/leaderboard?limit=100"),
      api<DailyCurrentData>("/daily-challenges/current"),
    ]);
    setData({
      profile: profile.status === "fulfilled" ? profile.value : null,
      ranked: ranked.status === "fulfilled" ? ranked.value : null,
      rankedStats: rankedStats.status === "fulfilled" ? rankedStats.value : null,
      leaderboard:
        leaderboard.status === "fulfilled" ? leaderboard.value : null,
      daily: daily.status === "fulfilled" ? daily.value : null,
    });
    const rejected = [profile, ranked, rankedStats, leaderboard, daily].filter(
      (result) => result.status === "rejected"
    );
    if (rejected.length > 0) {
      setError("Alguns dados do lobby não puderam ser carregados.");
    }
    setLoading(false);
  }, [isAuthed, sessionLoading]);

  useEffect(() => {
    (async () => {
      await Promise.resolve();
      await load();
    })();
  }, [load, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return (
    <LobbyDataContext.Provider
      value={{ ...data, loading, error, refresh }}
    >
      {children}
    </LobbyDataContext.Provider>
  );
}

export function useLobbyData() {
  const context = useContext(LobbyDataContext);
  if (!context) {
    throw new Error("useLobbyData must be used within a LobbyDataProvider");
  }
  return context;
}