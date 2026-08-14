"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistance, formatScore } from "@/lib/format";
import { playSound } from "@/lib/sounds";
import type { RankedRoundResult } from "@/lib/api-types";

interface RankedRoundResultProps {
  result: RankedRoundResult;
  myName: string;
  opponentName: string;
  myHealth: number;
  opponentHealth: number;
  myPrevHealth: number;
  opponentPrevHealth: number;
  maxHealth: number;
  onContinue: () => void;
  myGuess?: { latitude: number; longitude: number } | null;
  opponentGuess?: { latitude: number; longitude: number } | null;
  correct?: { latitude: number; longitude: number } | null;
}

export function RankedRoundResultScreen({
  result,
  myName,
  opponentName,
  myHealth,
  opponentHealth,
  myPrevHealth,
  opponentPrevHealth,
  maxHealth,
  onContinue,
}: RankedRoundResultProps) {
  const [timeLeft, setTimeLeft] = useState(3);
  const [animatedMyHealth, setAnimatedMyHealth] = useState(myPrevHealth);
  const [animatedOppHealth, setAnimatedOppHealth] = useState(opponentPrevHealth);

  const myWin = result.myScore > result.opponentScore;
  const oppWin = result.opponentScore > result.myScore;
  const isDraw = result.myScore === result.opponentScore;

  useEffect(() => {
    playSound("roundEnd");
    
    const t = setTimeout(() => {
      setAnimatedMyHealth(myHealth);
      setAnimatedOppHealth(opponentHealth);
      if (myPrevHealth !== myHealth || opponentPrevHealth !== opponentHealth) {
        playSound("damage");
      }
    }, 1000);

    return () => clearTimeout(t);
  }, [myHealth, opponentHealth, myPrevHealth, opponentPrevHealth]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onContinue();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onContinue]);

  const myHealthPct = Math.max(0, Math.min(100, (animatedMyHealth / maxHealth) * 100));
  const oppHealthPct = Math.max(0, Math.min(100, (animatedOppHealth / maxHealth) * 100));

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[2000] flex flex-col items-center justify-center bg-black/95 text-white p-6"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl font-bold mb-2">Resultado da Rodada {result.roundNumber}</h2>
        <div className="inline-flex items-center justify-center rounded-full bg-violet-600/20 border border-violet-500/30 px-3 py-1 text-sm text-violet-300">
          Multiplicador x{result.multiplier.toFixed(1)}
        </div>
      </motion.div>

      <div className="grid w-full max-w-4xl grid-cols-[1fr_auto_1fr] gap-8 mb-16">
        {/* You */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "flex flex-col items-center rounded-2xl p-6 border-2 transition-colors relative",
            myWin ? "border-amber-500/50 bg-amber-500/10 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]" : "border-white/10 bg-white/5"
          )}
        >
          <span className="text-xl font-medium mb-4">{myName}</span>
          <span className="text-5xl font-black mb-2 tabular-nums">{formatScore(result.myScore)}</span>
          <span className="text-sm text-white/50 mb-6">pontos</span>
          
          <div className="flex flex-col gap-2 w-full text-sm">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/70">Distância</span>
              <span className="font-medium">{result.myDistanceMeters != null ? formatDistance(result.myDistanceMeters) : "Tempo esgotado"}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-red-400/80">Dano recebido</span>
              <span className="font-bold text-red-400">-{result.myDamage}</span>
            </div>
          </div>
          {myWin && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-4 -right-4 bg-amber-500 p-2 rounded-full shadow-lg">
              <Trophy className="size-5 text-black" />
            </motion.div>
          )}
        </motion.div>

        {/* VS */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-white/10 font-black italic text-white/50">
            VS
          </div>
        </motion.div>

        {/* Opponent */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "flex flex-col items-center rounded-2xl p-6 border-2 transition-colors relative",
            oppWin ? "border-amber-500/50 bg-amber-500/10 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]" : "border-white/10 bg-white/5"
          )}
        >
          <span className="text-xl font-medium mb-4">{opponentName}</span>
          <span className="text-5xl font-black mb-2 tabular-nums">{formatScore(result.opponentScore)}</span>
          <span className="text-sm text-white/50 mb-6">pontos</span>
          
          <div className="flex flex-col gap-2 w-full text-sm">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/70">Distância</span>
              <span className="font-medium">{result.opponentDistanceMeters != null ? formatDistance(result.opponentDistanceMeters) : "Tempo esgotado"}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-red-400/80">Dano recebido</span>
              <span className="font-bold text-red-400">-{result.opponentDamage}</span>
            </div>
          </div>
          {oppWin && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-4 -right-4 bg-amber-500 p-2 rounded-full shadow-lg">
              <Trophy className="size-5 text-black" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Health Bars */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-2xl flex flex-col gap-6 mb-10"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Vida de {myName}</span>
            <span className="tabular-nums">{animatedMyHealth} / {maxHealth}</span>
          </div>
          <div className="h-4 w-full rounded-full bg-white/10 overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${myHealthPct}%` }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Vida de {opponentName}</span>
            <span className="tabular-nums">{animatedOppHealth} / {maxHealth}</span>
          </div>
          <div className="h-4 w-full rounded-full bg-white/10 overflow-hidden relative flex justify-end">
            <motion.div 
              className="absolute top-0 right-0 h-full bg-gradient-to-l from-red-500 to-rose-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${oppHealthPct}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Countdown */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full"
      >
        <Clock className="size-5 text-white/70" />
        <span className="font-medium">Próxima rodada em {timeLeft}s</span>
      </motion.div>
    </motion.div>
  );
}
