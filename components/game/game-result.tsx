"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Gauge, MapPin, Home } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { LatLng } from "@/lib/api-types";
import { playSound } from "@/lib/sounds";

const GameMapLazy = dynamic(() => import("@/components/game/game-map").then(m => ({ default: m.GameMap })), { ssr: false });

export interface ResultStat {
  icon: typeof Gauge;
  label: string;
  value: string;
}

interface GameResultProps {
  title: string;
  subtitle?: string;
  score: number;
  maxScore?: number;
  stats: ResultStat[];
  guess?: LatLng | null;
  correct?: LatLng | null;
  onReplay?: () => void;
  replayLabel?: string;
  children?: React.ReactNode;
}

export function GameResult({
  title,
  subtitle,
  score,
  maxScore = 5000,
  stats,
  guess,
  correct,
  onReplay,
  replayLabel = "Jogar novamente",
  children,
}: GameResultProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    // Start animation at 0.5s delay
    timeoutId = setTimeout(() => {
      // Intentionally ignoring return of playSound for simplicity
      // and checking if function exists to be safe
      if (typeof playSound === 'function') {
        playSound("score");
      }
      
      let start = 0;
      const duration = 1500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutQuad)
        const easeOut = 1 - (1 - progress) * (1 - progress);
        setDisplayScore(Math.floor(easeOut * score));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayScore(score);
        }
      };

      requestAnimationFrame(animate);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [score]);

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-8 py-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <motion.div 
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="absolute -inset-4 rounded-full bg-amber-500/20 blur-2xl" />
          <span className="relative grid size-20 place-items-center rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-lg shadow-amber-500/10">
            <MapPin className="size-8 text-amber-500" />
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          {subtitle ? (
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </motion.div>
      </div>

      <motion.div 
        className="relative w-full overflow-hidden rounded-3xl border bg-card p-8 shadow-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <p className="relative text-xs font-medium uppercase tracking-widest text-muted-foreground">
          PONTUAÇÃO FINAL
        </p>
        <div className="relative mt-3 flex items-baseline justify-center gap-2">
          <p className="font-mono text-7xl font-bold tabular-nums tracking-tight">
            {displayScore.toLocaleString("pt-BR")}
          </p>
          {maxScore ? (
            <p className="text-xl font-medium text-muted-foreground">
              / {maxScore.toLocaleString("pt-BR")}
            </p>
          ) : null}
        </div>
      </motion.div>

      {guess && correct && (
        <motion.div
          className="relative h-64 w-full overflow-hidden rounded-3xl border shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <GameMapLazy 
            guess={guess} 
            correct={correct} 
            disabled 
            className="h-full w-full" 
          />
        </motion.div>
      )}

      <div className="grid w-full gap-3 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border bg-card px-4 py-6 transition-colors hover:bg-muted/40"
          >
            <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <stat.icon className="size-5" />
            </span>
            <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {children}

      <motion.div 
        className="flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2 }}
      >
        {onReplay ? (
          <Button
            size="lg"
            className="rounded-full"
            onClick={onReplay}
          >
            {replayLabel}
            <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
          </Button>
        ) : null}
        <Button
          render={<Link href="/lobby" />}
          variant="outline"
          size="lg"
          className="rounded-full"
        >
          <Home />
          Voltar ao lobby
        </Button>
      </motion.div>
    </div>
  );
}