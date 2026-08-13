"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gauge, MapPin, Trophy } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

const STATS = [
  { icon: MapPin, value: "12.480", label: "partidas jogadas" },
  { icon: Gauge, value: "210 m", label: "erro médio no 1º chute" },
  { icon: Trophy, value: "24.920", label: "recorde em pontos" },
];

const SPOTS = [
  "BCE",
  "Bloco C56",
  "Restaurante Universitário",
  "Bloco D34",
];

export function Quiz() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-2xl shadow-foreground/10">
            <Image
              src="/campus-satellite.jpg"
              alt="Vista aérea do campus sede da Universidade Estadual de Maringá"
              fill
              sizes="(min-width: 1024px) 86vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-br from-[#0b1020]/95 via-[#111a33]/85 to-[#1a1440]/90" />
            <div
              aria-hidden
              className="absolute -left-24 -top-24 size-96 rounded-full bg-blue-500/25 blur-[120px]"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 -right-24 size-96 rounded-full bg-violet-500/25 blur-[120px]"
            />

            <div className="relative flex flex-col items-center px-6 py-20 text-center sm:py-28">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white/80 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Desafio aberto
              </span>

              <h2 className="mt-6 max-w-2xl text-[clamp(2.2rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter text-white">
                Você conhece a{" "}
                <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                  UEM?
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
                Reconheça cada canto em menos de cinco segundos por rodada. Se
                você já atravessou o campus correndo para a aula, chegou a hora
                de provar o quanto prestou atenção no caminho.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {SPOTS.map((spot) => (
                  <span
                    key={spot}
                    className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur-sm"
                  >
                    {spot}
                  </span>
                ))}
              </div>

              <div className="mt-12 flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-14">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1">
                    <span className="flex items-center gap-1.5 text-xl font-semibold tracking-tight text-white">
                      <stat.icon className="size-4 text-sky-300" />
                      {stat.value}
                    </span>
                    <span className="text-xs text-white/60">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button
                  render={<Link href="/lobby" />}
                  className="group h-12 rounded-full bg-white px-8 text-sm font-semibold text-slate-900 hover:bg-white/90"
                >
                  Eu conheço. Provar.
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
                <Button
                  render={<Link href="/lobby/ranking" />}
                  className="h-12 rounded-full border-white/20 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Ver ranking
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}