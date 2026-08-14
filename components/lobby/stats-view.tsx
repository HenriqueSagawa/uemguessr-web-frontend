"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Flame,
  Gamepad2,
  Gauge,
  Target,
  Trophy,
} from "lucide-react";
import { api } from "@/lib/api";
import type {
  GameSummary,
  RankedMatchHistoryEntry,
} from "@/lib/api-types";
import { Progress } from "@/components/ui/progress";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Skeleton } from "@/components/ui/skeleton";
import { useLobbyData } from "@/lib/lobby-data";
import { divisionProgress } from "@/lib/ranked";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/lobby/section-heading";

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  ticker,
  tickerClassName,
}: {
  icon: typeof Trophy;
  label: string;
  value: number;
  suffix?: string;
  ticker?: boolean;
  tickerClassName?: string;
}) {
  return (
    <div className="rounded-3xl border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {ticker ? (
          <NumberTicker
            value={value}
            className={cn("bg-clip-text text-transparent", tickerClassName)}
          />
        ) : (
          <span className="tabular-nums">{value.toLocaleString("pt-BR")}</span>
        )}
        {suffix ? (
          <span className="ml-1 text-base font-medium text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </p>
    </div>
  );
}

type RecentRow = {
  id: string;
  date: string;
  mode: string;
  meta: string;
  tone: "good" | "bad" | "neutral";
};

function formatDate(iso: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function StatsView() {
  const { ranked, rankedStats, daily, loading } = useLobbyData();
  const [classic, setClassic] = useState<GameSummary[] | null>(null);
  const [rankedMatches, setRankedMatches] = useState<RankedMatchHistoryEntry[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const classicRes = await api<GameSummary[]>("/games?limit=100").catch(
        () => null
      );
      const matchRes = await api<{ matches: RankedMatchHistoryEntry[] }>(
        "/ranked/me/matches?limit=10"
      ).catch(() => null);
      if (active) {
        setClassic(classicRes ?? null);
        setRankedMatches(matchRes?.matches ?? null);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const rating = ranked?.profile?.rating ?? 0;
  const wins = ranked?.profile?.wins ?? 0;
  const losses = ranked?.profile?.losses ?? 0;
  const bestRating = ranked?.profile?.bestRating ?? 0;
  const classicCount = classic?.length ?? 0;
  const totalMatches =
    (rankedStats?.profile.totalMatches ?? 0) +
    (classic?.filter((g) => g.finishedAt).length ?? 0);
  const division = rating > 0 ? divisionProgress(rating) : null;
  const seasonPercent = division?.progress ?? 0;

  const recent: RecentRow[] = [
    ...(classic ?? []).map((game) => ({
      id: game.id,
      date: formatDate(game.startedAt),
      mode: "Clássico",
      meta: `${game.score.toLocaleString("pt-BR")} pts`,
      tone: "neutral" as const,
    })),
    ...(rankedMatches ?? []).map((match) => ({
      id: match.matchId,
      date: formatDate(match.startedAt ?? match.finishedAt ?? ""),
      mode: "Ranqueado",
      meta: match.result === "win" ? "Vitória" : match.result === "loss" ? "Derrota" : "—",
      tone: (match.result === "win" ? "good" : match.result === "loss" ? "bad" : "neutral") as RecentRow["tone"],
    })),
  ]
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .slice(0, 8);

  const dailyState = daily?.status?.state;

  return (
    <div className="flex flex-col gap-10">
      <SectionHeading
        eyebrow="Estatísticas"
        title="Seus números no campus"
        description="Cada partida conta uma história. Aqui está o seu resumo."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-3xl border bg-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="size-4" />
              </div>
              <Skeleton className="mt-3 h-8 w-24" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              icon={Gauge}
              label="Rating atual"
              value={rating}
              ticker
              tickerClassName="bg-linear-to-br from-blue-400 to-violet-500"
            />
            <StatCard
              icon={Trophy}
              label="Melhor rating"
              value={bestRating}
              ticker
              tickerClassName="bg-linear-to-br from-amber-400 to-orange-500"
            />
            <StatCard
              icon={Target}
              label="Taxa de vitória"
              value={rankedStats?.profile.winRate ?? 0}
              suffix="%"
            />
            <StatCard
              icon={Gamepad2}
              label="Partidas"
              value={totalMatches}
            />
          </>
        )}
      </div>

      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Temporada ranqueada"
          title="Progresso do elo"
          description="Venceu segue subindo; perdeu, o mapa cobra. É assim que o ranking funciona."
          action={
            rankedStats?.profile.currentStreak.direction === "win" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-600 dark:text-orange-400">
                <Flame className="size-3.5" />
                Em sequência de vitórias
              </span>
            ) : rankedStats?.profile.currentStreak.direction === "loss" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                Em má fase
              </span>
            ) : null
          }
        />
        <div className="rounded-3xl border bg-card p-6">
          {loading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-2.5 w-full" />
              <Skeleton className="h-3 w-36" />
            </div>
          ) : division ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{division.current}</span>
                <span className="text-muted-foreground">
                  {division.progress}% para {division.next}
                </span>
              </div>
              <Progress value={seasonPercent} className="mt-3 h-2.5 bg-muted" />
              <p className="mt-4 text-xs text-muted-foreground">
                {wins} vitórias · {losses} derrotas
              </p>
            </>
          ) : (
            <p className="py-4 text-sm text-muted-foreground">
              Nenhuma temporada ranqueada ativa no momento.
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Por modo"
          title="Onde você rende mais?"
          description="Sua atividade em cada formato."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Clássico</span>
              <span className="text-xs text-muted-foreground">
                {classic ? `${classicCount} partidas` : "carregando..."}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              5 rodadas, até 1.000 pts por local
            </p>
          </div>
          <div className="rounded-3xl border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ranqueado</span>
              <span className="text-xs text-muted-foreground">
                {rankedStats ? `${rankedStats.profile.totalMatches} partidas` : "carregando..."}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {rankedStats
                ? `${rankedStats.profile.winRate}% de vitória`
                : "duelos em tempo real"}
            </p>
          </div>
          <div className="rounded-3xl border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <CalendarDays className="size-3.5 text-orange-500" />
                Desafio Diário
              </span>
              <span className="text-xs text-muted-foreground">hoje</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {dailyState === "submitted"
                ? "Concluído hoje — volta amanhã"
                : dailyState === "in_progress"
                  ? "Em andamento agora"
                  : dailyState === "not_started"
                    ? "Ainda não começou"
                    : "carregando..."}
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Histórico"
          title="Últimas partidas"
          description="Suas jogadas mais recentes, clássicas e ranqueadas."
        />
        <div className="overflow-hidden rounded-3xl border bg-card">
          {classic === null && rankedMatches === null ? (
            <ul className="flex flex-col">
              {Array.from({ length: 6 }).map((_, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 border-b border-border/50 px-4 py-3.5 last:border-0 sm:gap-4 sm:px-6"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24 flex-1" />
                  <Skeleton className="h-4 w-16" />
                </li>
              ))}
            </ul>
          ) : recent.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhuma partida ainda. O campus espera por você.
            </p>
          ) : (
            <ul className="flex flex-col">
              {recent.map((match) => (
                <li
                  key={match.id}
                  className="flex items-center gap-3 border-b border-border/50 px-4 py-3.5 last:border-0 sm:gap-4 sm:px-6"
                >
                  <span className="w-24 shrink-0 text-sm text-muted-foreground">
                    {match.date}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {match.mode}
                  </span>
                  <span
                    className={cn(
                      "text-sm capitalize",
                      match.tone === "good"
                        ? "font-medium text-emerald-500"
                        : match.tone === "bad"
                          ? "font-medium text-rose-500"
                          : "text-muted-foreground"
                    )}
                  >
                    {match.meta}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}