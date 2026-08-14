"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLobbyData } from "@/lib/lobby-data";
import { SectionHeading } from "@/components/lobby/section-heading";
import { RankRow, type RankRowEntry } from "@/components/lobby/rank-row";

export function RankingPreview() {
  const { leaderboard, loading } = useLobbyData();
  const top = leaderboard?.top ?? [];
  const visible = top.slice(0, 10);
  const userRank = leaderboard?.user?.rank;
  const userInVisible = userRank != null && userRank <= visible.length;

  const userEntry: RankRowEntry | null = leaderboard?.user
    ? {
        id: "me",
        name: "Você",
        rating: leaderboard.user.rating,
        divisionLabel: leaderboard.user.divisionLabel,
      }
    : null;

  const gap = userRank != null && !userInVisible ? userRank - visible.length - 1 : 0;

  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Ranking ranqueado"
        title="Quem manda no mapa?"
        description="A disputa da temporada pelo título de melhor mapa mental do campus."
        action={
          <Link
            href="/lobby/ranking"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            Ver ranking completo
            <ArrowRight className="size-4" />
          </Link>
        }
      />

      <div className="rounded-3xl border bg-card p-4 sm:p-6">
        {loading ? (
          <ol className="flex flex-col">
            {Array.from({ length: 8 }).map((_, index) => (
              <li
                key={index}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 sm:gap-4 sm:px-4"
              >
                <Skeleton className="size-7 shrink-0" />
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-12" />
              </li>
            ))}
          </ol>
        ) : visible.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            O ranking ainda não tem jogadores. Seja o primeiro a dominar o mapa.
          </p>
        ) : (
          <ol className="flex flex-col">
            {visible.map((entry, index) => (
              <RankRow
                key={entry.userId}
                entry={{
                  id: entry.userId,
                  name: entry.displayName || entry.username,
                  rating: entry.rating,
                  divisionLabel: entry.divisionLabel,
                  avatarUrl: entry.avatarUrl,
                }}
                position={index + 1}
              />
            ))}

            {userEntry && !userInVisible ? (
              <li className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border/60" />
                {gap > 0
                  ? `e mais ${gap} jogadores separam você do top ${visible.length}`
                  : "apertado, hein?"}
                <span className="h-px flex-1 bg-border/60" />
              </li>
            ) : null}

            {userEntry && !userInVisible ? (
              <RankRow
                entry={userEntry}
                position={userRank ?? 0}
                highlighted
              />
            ) : null}
          </ol>
        )}
      </div>
    </section>
  );
}