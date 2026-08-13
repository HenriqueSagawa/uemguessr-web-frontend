"use client";

import { Flame, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useSession } from "@/lib/session";
import { useLobbyData } from "@/lib/lobby-data";
import { divisionProgress, initialsOf } from "@/lib/ranked";
import { cn } from "@/lib/utils";

function StatBlock({
  value,
  prefix,
  label,
  isPoints,
}: {
  value: number;
  prefix?: string;
  label: string;
  isPoints?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 sm:items-start">
      <span className="flex items-baseline gap-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">
        {prefix ? (
          <span className="text-base text-muted-foreground">{prefix}</span>
        ) : null}
        {isPoints ? (
          <NumberTicker
            value={value}
            className="bg-gradient-to-br from-blue-400 to-violet-500 bg-clip-text text-transparent"
          />
        ) : (
          <span className="tabular-nums">{value.toLocaleString("pt-BR")}</span>
        )}
      </span>
      <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}

export function PlayerCard() {
  const { user } = useSession();
  const { profile, ranked, rankedStats, loading } = useLobbyData();

  const displayName = profile?.displayName || user?.username || "Explorador";
  const handle = user?.username ? `@${user.username}` : "";
  const avatarUrl = profile?.avatarUrl ?? user?.avatarUrl;
  const rating = ranked?.profile?.rating;
  const rank = rankedStats?.profile.rank;
  const matches = rankedStats?.profile.totalMatches;
  const division = rating != null ? divisionProgress(rating) : null;
  const streak = rankedStats?.profile.currentStreak;

  return (
    <section className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-blue-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="rounded-full bg-linear-to-br from-blue-500/20 to-violet-500/20 p-1">
            <Avatar className="size-16 sm:size-20">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
              <AvatarFallback
                className={cn(
                  "bg-gradient-to-br text-lg font-semibold text-white sm:text-xl",
                  "from-blue-500 to-violet-600"
                )}
              >
                {initialsOf(displayName)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
              Bem-vindo de volta
            </p>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {displayName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {handle}
              {profile?.bio ? ` · ${profile.bio}` : ""}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {division ? (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                  <Trophy className="size-3.5" />
                  {division.current}
                </span>
              ) : null}
              {streak?.direction === "win" ? (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400">
                  <Flame className="size-3.5" />
                  Em sequência
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 rounded-2xl border bg-muted/40 px-6 py-5 sm:gap-10 sm:px-10">
          <StatBlock value={rating ?? 0} isPoints label="Rating" />
          <StatBlock value={rank ?? 0} prefix="#" label="Ranking" />
          <StatBlock value={matches ?? 0} label="Partidas" />
        </div>
      </div>

      {division ? (
        <div className="relative mt-8 flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            {division.current}
          </span>
          <Progress value={division.progress} className="h-2 flex-1 bg-muted" />
          <span className="text-xs font-medium text-muted-foreground">
            {division.next}
          </span>
        </div>
      ) : loading ? null : (
        <p className="relative mt-6 text-sm text-muted-foreground">
          Nenhuma temporada ranqueada ativa no momento — seus números aparecem
          aqui assim que a arena reabrir.
        </p>
      )}
    </section>
  );
}