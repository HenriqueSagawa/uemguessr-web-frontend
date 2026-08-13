"use client";

import { ArrowRight, CheckCircle2, Sparkles, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameMap } from "@/components/game/game-map";
import type { LatLng } from "@/lib/api-types";
import { formatDistance, formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RoundResultViewProps {
  roundNumber: number;
  totalRounds: number;
  roundScore: number;
  gameScore: number;
  distanceMeters: number;
  guess: LatLng;
  correct: LatLng;
  isLast: boolean;
  onNext: () => void;
}

export function RoundResultView({
  roundNumber,
  totalRounds,
  roundScore,
  gameScore,
  distanceMeters,
  guess,
  correct,
  isLast,
  onNext,
}: RoundResultViewProps) {
  const perfect = distanceMeters < 15;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm">
        <span className="text-sm font-medium tracking-tight">
          Rodada {roundNumber} de {totalRounds}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold tabular-nums text-amber-600 dark:text-amber-500">
          <Trophy className="size-3.5" />
          {formatScore(gameScore)} pts
        </span>
      </div>

      <div className="relative min-h-[24rem] flex-1 overflow-hidden rounded-3xl border bg-muted shadow-inner">
        <GameMap
          guess={guess}
          correct={correct}
          disabled
          className="h-full w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-4">
          <span className="rounded-full bg-black/70 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md">
            O lugar real ficava a{" "}
            <span className="font-bold tabular-nums">
              {formatDistance(distanceMeters)}
            </span>{" "}
            do seu palpite
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-500">
            <Target className="size-4" />
          </span>
          <div className="text-left">
            <p className="font-mono text-lg font-semibold leading-none tabular-nums">
              {formatDistance(distanceMeters)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">de distância</p>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border bg-card px-4 py-3",
            perfect && "border-emerald-500/30"
          )}
        >
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full",
              perfect
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-primary/10 text-primary"
            )}
          >
            {perfect ? <Sparkles className="size-4" /> : <CheckCircle2 className="size-4" />}
          </span>
          <div className="text-left">
            <p className="font-mono text-lg font-semibold leading-none tabular-nums">
              +{formatScore(roundScore)} pts
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {perfect ? "Palpite perfeito!" : "pontos ganhos"}
            </p>
          </div>
        </div>
      </div>

      <Button className="h-11 w-full rounded-2xl text-base" onClick={onNext}>
        {isLast ? "Ver resultado final" : "Próxima rodada"}
        <ArrowRight />
      </Button>
    </div>
  );
}