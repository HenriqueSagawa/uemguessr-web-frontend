"use client";

import Link from "next/link";
import { ArrowRight, Crown, Medal, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RANKINGS = [
  {
    position: 1,
    initials: "BJ",
    name: "Beatriz Januário",
    city: "Maringá · BCB",
    points: 41.32,
    accent: "from-amber-400 to-yellow-500",
    icon: Crown,
  },
  {
    position: 2,
    initials: "RS",
    name: "Rafael Salmon",
    city: "Maringá · DBI",
    points: 39.87,
    accent: "from-slate-300 to-slate-400",
    icon: Medal,
  },
  {
    position: 3,
    initials: "LT",
    name: "Letícia Tomé",
    city: "Sarandi · CCN",
    points: 38.9,
    accent: "from-orange-400 to-amber-600",
    icon: Medal,
  },
  {
    position: 4,
    initials: "Vo",
    name: "Você",
    city: "Tem espaço no topo",
    points: 24.15,
    accent: "from-blue-500 to-violet-500",
    highlight: true,
  },
];

export function Competitive() {
  return (
    <section
      id="competitivo"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="absolute left-[-16%] top-1/2 -z-10 size-[30rem] rounded-full bg-indigo-500/10 blur-[140px] dark:bg-indigo-500/15"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="flex flex-col items-start gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-500 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-violet-500" />
              </span>
              Modo competitivo
            </span>

            <h2 className="max-w-lg text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tighter text-foreground">
              O ranking{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-400 dark:to-violet-400">
                não perdoa
              </span>
            </h2>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Cada palpite soma pontos, e cada ponto te empurra para mais perto
              do topo. Temporadas mensais, divisões escalonadas e um ranking
              geral que mostra quem realmente conhece a UEM.
            </p>

            <ul className="mt-2 flex flex-col gap-3 text-sm text-muted-foreground">
              {[
                "Pontos por rodada alimentam seu total na temporada",
                "Divisões evoluem conforme o seu desempenho",
                "Rankings geral, semanal e diário para acompanhar",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 size-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              render={<Link href="/ranking" />}
              className="group mt-4 rounded-full px-6"
            >
              Entrar no ranking
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-br from-indigo-500/15 via-violet-500/10 to-transparent blur-2xl dark:from-indigo-500/20 dark:via-violet-500/15"
            />
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-foreground/10">
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold tracking-tight text-foreground">
                    Ranking geral
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Temporada 3 · em andamento
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  <Sparkles className="size-3 text-violet-500" />
                  12.480 jogadores
                </span>
              </div>

              <ul className="divide-y divide-border/70">
                {RANKINGS.map((row) => (
                  <li
                    key={row.position}
                    className={
                      "flex items-center gap-3.5 px-5 py-3.5 transition-colors" +
                      (row.highlight
                        ? " bg-linear-to-r from-blue-500/10 via-violet-500/5 to-transparent"
                        : "")
                    }
                  >
                    <span className="w-5 text-center font-mono text-sm font-semibold text-muted-foreground">
                      {row.position}
                    </span>
                    <Avatar>
                      <AvatarFallback
                        className={`bg-linear-to-br ${row.accent} font-semibold text-white`}
                      >
                        {row.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p
                        className={
                          "truncate text-sm font-medium tracking-tight" +
                          (row.highlight
                            ? " text-foreground"
                            : " text-foreground/80")
                        }
                      >
                        {row.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {row.city}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                        {row.points.toFixed(2).replace(".", ",")}k
                      </span>
                      {row.icon ? (
                        <row.icon className="size-3.5 text-muted-foreground/70" />
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border bg-muted/40 px-5 py-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Fim da temporada em 12 dias</span>
                  <span>+12.480 no ranking</span>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[68%] rounded-full bg-linear-to-r from-blue-500 to-violet-500" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}