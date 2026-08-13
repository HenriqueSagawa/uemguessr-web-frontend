"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Flame,
  User,
  Users,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const MODES = [
  {
    value: "solo",
    icon: User,
    label: "Solo",
    kicker: "Treine no seu ritmo",
    description:
      "Partidas sem pressão, do seu jeito. Abra o jogo, respire e explore o campus com calma.",
    features: [
      "Jogue quando e quantas vezes quiser",
      "Sem relógio contra você",
      "Ideal para conhecer cantos novos da UEM",
    ],
    cta: "Jogar solo",
    href: "/jogar",
  },
  {
    value: "multiplayer",
    icon: Users,
    label: "Multiplayer",
    kicker: "Desafie seus amigos",
    description:
      "Chame a galera para a mesma foto. Cada um chuta onde acha que está — o placar atualiza ao vivo.",
    features: [
      "Partidas simultâneas na mesma rodada",
      "Placar ao vivo durante a partida",
      "Quem chegar mais perto leva a rodada",
    ],
    cta: "Jogar multiplayer",
    href: "/jogar",
  },
  {
    value: "diario",
    icon: CalendarDays,
    label: "Diário",
    kicker: "Um desafio por dia",
    description:
      "Todo dia, os mesmos locais para todo mundo. Um único palpite vale sua posição no ranking do dia.",
    features: [
      "Novos locais a cada 24 horas",
      "Ranking do dia abre para todos",
      "Volte amanhã para defender sua marca",
    ],
    cta: "Ver desafio de hoje",
    href: "/jogar",
  },
] as const;

export function GameModes() {
  return (
    <section
      id="modos"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="absolute right-[-18%] bottom-0 -z-10 size-[32rem] rounded-full bg-blue-500/10 blur-[140px] dark:bg-blue-500/15"
      />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Modos de Jogo"
            title="Do treino ao desafio do dia"
            description="Escolha como você quer viver a UEM hoje: sozinho, com a galera ou contra o relógio do calendário."
          />
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <Tabs defaultValue="solo" className="gap-8">
            <TabsList className="mx-auto h-auto gap-1 rounded-full bg-muted/70 p-1.5 backdrop-blur-sm">
              {MODES.map((mode) => (
                <TabsTrigger
                  key={mode.value}
                  value={mode.value}
                  className="h-11 rounded-full px-6 text-sm font-semibold"
                >
                  <mode.icon className="size-4" />
                  {mode.label}
                  {mode.value === "diario" ? (
                    <Flame className="size-3.5 text-orange-500" />
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>

            {MODES.map((mode) => (
              <TabsContent
                key={mode.value}
                value={mode.value}
                className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-xl shadow-foreground/5 sm:p-10"
              >
                <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500/15 via-indigo-500/15 to-violet-500/15 ring-1 ring-primary/10">
                    <mode.icon className="size-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        {mode.kicker}
                      </h3>
                      {mode.value === "diario" ? (
                        <Badge className="bg-orange-500/15 text-orange-600 ring-1 ring-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400">
                          Mais popular
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {mode.description}
                    </p>
                  </div>
                </div>

                <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                  {mode.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-muted/40 px-3.5 py-3 text-[13px] leading-snug text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs text-muted-foreground">
                    Sem cadastro obrigatório para começar
                  </span>
                  <Button
                    render={<Link href={mode.href} />}
                    className="group rounded-full px-6"
                  >
                    {mode.cta}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}