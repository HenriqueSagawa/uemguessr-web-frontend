"use client";

import { Loader2, Trophy } from "lucide-react";
import { useLobbyData } from "@/lib/lobby-data";
import { SectionHeading } from "@/components/lobby/section-heading";
import { RankRow, type RankRowEntry } from "@/components/lobby/rank-row";

export function RankingView() {
  const { leaderboard, loading, error } = useLobbyData();
  const top = leaderboard?.top ?? [];
  const userRank = leaderboard?.user?.rank;

  const userEntry: RankRowEntry | null = leaderboard?.user
    ? {
        id: "me",
        name: "Você",
        rating: leaderboard.user.rating,
        divisionLabel: leaderboard.user.divisionLabel,
      }
    : null;

  const userBeyond = userRank != null && userRank > top.length;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Ranking ranqueado"
        title="Temporada · Elite do mapa"
        description="Todos os jogadores da temporada, do primeiro ao último. A tabela é atualizada a cada duelo."
        action={
          userRank != null ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
              <Trophy className="size-3.5" />
              Você está em #{userRank}
            </span>
          ) : null
        }
      />

      <div className="rounded-3xl border bg-card p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando ranking...
          </div>
        ) : error && top.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Não foi possível carregar o ranking agora. Tente de novo em instantes.
          </p>
        ) : top.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            O ranking ainda não tem jogadores. Seja o primeiro a dominar o mapa.
          </p>
        ) : (
          <ol className="flex flex-col">
            {top.map((entry, index) => (
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
                highlighted={userRank === index + 1}
              />
            ))}
            {userEntry && userBeyond ? (
              <>
                <li className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border/60" />
                  você por aqui
                  <span className="h-px flex-1 bg-border/60" />
                </li>
                <RankRow
                  entry={userEntry}
                  position={userRank ?? 0}
                  highlighted
                />
              </>
            ) : null}
          </ol>
        )}
      </div>
    </div>
  );
}