"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
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
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando ranking...
          </div>
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