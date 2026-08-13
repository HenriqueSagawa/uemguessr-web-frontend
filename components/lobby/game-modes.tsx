"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  Hourglass,
  MapPin,
  Swords,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { useLobbyData } from "@/lib/lobby-data";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/lobby/section-heading";

const MODES = [
  {
    id: "classico",
    name: "Clássico",
    tagline: "O formato raiz: 5 lugares escondidos pelo campus.",
    features: ["5 rodadas por partida", "Pontuação pela distância", "Sem pressão de tempo"],
    info: "5 rodadas",
    cta: "Jogar agora",
    href: "/partida/classico",
    icon: Compass,
    accentBg: "bg-sky-500/10",
    accentText: "text-sky-500",
  },
  {
    id: "ranqueado",
    name: "Ranqueado",
    tagline: "Prove seu mapa mental em um duelo contra outro jogador.",
    features: ["Duelo em tempo real", "Elo e divisão por temporada", "Sobe de vida a cada rodada"],
    info: "Temporada ativa",
    cta: "Entrar na fila",
    href: "/partida/ranqueado",
    icon: Swords,
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-500",
  },
  {
    id: "diario",
    name: "Desafio Diário",
    tagline: "Um mapa misterioso por dia. Uma única chance.",
    features: ["Só uma chance", "60 segundos para responder", "Pontos em dobro"],
    info: "Recompensa do dia",
    cta: "Aceitar desafio",
    href: "/partida/diario",
    icon: CalendarDays,
    accentBg: "bg-orange-500/10",
    accentText: "text-orange-500",
  },
] as const;

function ModeCard({
  mode,
  featured,
  dailyStatus,
}: {
  mode: (typeof MODES)[number];
  featured?: boolean;
  dailyStatus?: string;
}) {
  const router = useRouter();
  const Icon = mode.icon;

  return (
    <div className={cn("relative rounded-3xl", featured && "overflow-hidden")}>
      {featured ? (
        <BorderBeam
          size={240}
          duration={9}
          colorFrom="#38bdf8"
          colorTo="#a855f7"
          borderWidth={1.5}
        />
      ) : null}
      <div
        className={cn(
          "relative flex h-full flex-col gap-5 rounded-3xl border p-6 sm:p-7",
          featured
            ? "border-primary/30 bg-linear-to-br from-blue-500/10 via-indigo-500/[0.06] to-violet-500/10"
            : "border-border bg-card"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-2xl",
              mode.accentBg,
              mode.accentText
            )}
          >
            <Icon className="size-5" />
          </span>
          {featured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
              <span className="size-1.5 animate-pulse rounded-full bg-current" />
              {dailyStatus ?? "Hoje"}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {mode.info}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{mode.name}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {mode.tagline}
          </p>
          <ul className="mt-1 space-y-2">
            {mode.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check
                  className={cn(
                    "size-4 shrink-0",
                    featured ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {feature}
              </li>
            ))}
          </ul>
          {featured ? (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-2xl border border-dashed border-border bg-card/60 px-4 py-3 text-sm">
              <MapPin className="size-4 shrink-0 text-primary" />
              <span className="font-medium">Um canto novo da UEM</span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                · <Hourglass className="size-3.5" /> janela diária de 24h
              </span>
            </div>
          ) : null}
        </div>

        <Button
          variant={featured ? "default" : "outline"}
          className="w-full rounded-full sm:w-auto"
          onClick={() => router.push(mode.href)}
        >
          {mode.cta}
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

const DAILY_STATUS_LABEL = {
  not_started: "Novo hoje",
  in_progress: "Em andamento",
  submitted: "Concluído",
} as const;

export function GameModes() {
  const { daily } = useLobbyData();
  const dailyState = daily?.status?.state
    ? DAILY_STATUS_LABEL[daily.status.state]
    : undefined;

  const classic = MODES[0];
  const ranked = MODES[1];
  const dailyMode = MODES[2];

  return (
    <section className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Modos de jogo"
        title="Como você quer jogar hoje?"
        description="Escolha seu terreno. Cada modo tem sua própria pegada dentro do campus."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <ModeCard mode={dailyMode} featured dailyStatus={dailyState} />
        <ModeCard mode={classic} />
        <ModeCard mode={ranked} />
      </div>
    </section>
  );
}