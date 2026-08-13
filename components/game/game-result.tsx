"use client";

import Link from "next/link";
import { ArrowRight, Gauge, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ResultStat {
  icon: typeof Gauge;
  label: string;
  value: string;
}

interface GameResultProps {
  title: string;
  subtitle?: string;
  score: number;
  stats: ResultStat[];
  onReplay?: () => void;
  replayLabel?: string;
  children?: React.ReactNode;
}

export function GameResult({
  title,
  subtitle,
  score,
  stats,
  onReplay,
  replayLabel = "Jogar novamente",
  children,
}: GameResultProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-8 py-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-amber-500/20 blur-2xl" />
          <span className="relative grid size-20 place-items-center rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-orange-500/10 shadow-lg shadow-amber-500/10">
            <MapPin className="size-8 text-amber-500" />
          </span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? (
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="relative w-full overflow-hidden rounded-3xl border bg-card p-8 shadow-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <p className="relative text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Pontuação final
        </p>
        <p className="relative mt-3 font-mono text-7xl font-bold tabular-nums tracking-tight">
          {score.toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group flex flex-col items-center gap-2.5 rounded-2xl border bg-card px-4 py-6 transition-colors hover:bg-muted/40"
          >
            <span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <stat.icon className="size-5" />
            </span>
            <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {children}

      <div className="flex flex-wrap items-center justify-center gap-3">
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
      </div>
    </div>
  );
}