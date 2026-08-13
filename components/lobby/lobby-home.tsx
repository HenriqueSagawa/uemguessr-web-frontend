"use client";

import { PlayerCard } from "@/components/lobby/player-card";
import { GameModes } from "@/components/lobby/game-modes";
import { RankingPreview } from "@/components/lobby/ranking-preview";

export function LobbyHome() {
  return (
    <div className="flex flex-col gap-10">
      <PlayerCard />
      <GameModes />
      <RankingPreview />
    </div>
  );
}