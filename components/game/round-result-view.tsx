"use client";

import { motion } from "motion/react";
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
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex h-full flex-col gap-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 shadow-sm">
        <span className="text-sm font-medium tracking-tight">
          Rodada {roundNumber} de {totalRounds}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold tabular-nums text-amber-600 dark:text-amber-500">
          <Trophy className="size-3.5" />
          {formatScore(gameScore)} pts
        </span>
      </div>

      <div className="relative min-h-[30rem] flex-1 overflow-hidden rounded-3xl border bg-muted shadow-inner">
        <GameMap
          guess={guess}
          correct={correct}
          disabled
          className="h-full w-full"
        />
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-4"
        >
          <span className="rounded-full bg-black/80 px-6 py-3 text-sm font-medium text-white shadow-xl backdrop-blur-md border border-white/10">
            O lugar real ficava a{" "}
            <span className="font-bold tabular-nums text-primary-foreground">
              {formatDistance(distanceMeters)}
            </span>{" "}
            do seu palpite
          </span>
        </motion.div>
        
        {perfect && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden flex justify-center items-center">
             <div className="confetti-particle absolute top-[30%] left-[40%] text-2xl">✨</div>
             <div className="confetti-particle absolute top-[20%] left-[60%] text-3xl" style={{ animationDelay: "0.1s" }}>🎉</div>
             <div className="confetti-particle absolute top-[40%] left-[50%] text-xl" style={{ animationDelay: "0.2s" }}>🎊</div>
             <div className="confetti-particle absolute top-[25%] left-[45%] text-2xl" style={{ animationDelay: "0.15s" }}>⭐</div>
          </div>
        )}
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
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className={cn(
            "flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 relative overflow-hidden",
            perfect && "border-emerald-500/50 bg-emerald-500/5"
          )}
        >
          {perfect && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />}
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full relative z-10",
              perfect
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-primary/10 text-primary"
            )}
          >
            {perfect ? <Sparkles className="size-4" /> : <CheckCircle2 className="size-4" />}
          </span>
          <div className="text-left relative z-10">
            <p className="font-mono text-lg font-semibold leading-none tabular-nums">
              +{formatScore(roundScore)} pts
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {perfect ? "Palpite perfeito!" : "pontos ganhos"}
            </p>
          </div>
        </motion.div>
      </div>

      <Button className="h-12 w-full rounded-2xl text-base flex flex-col items-center justify-center gap-0.5 py-2" onClick={onNext}>
        <span className="flex items-center gap-2">
          {isLast ? "Ver resultado final" : "Próxima rodada"}
          <ArrowRight className="size-4" />
        </span>
        {!isLast && (
          <span className="text-[10px] font-normal opacity-70">
            Rodada {roundNumber} de {totalRounds} concluída
          </span>
        )}
      </Button>
    </motion.div>
  );
}