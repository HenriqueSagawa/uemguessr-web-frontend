"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, Crosshair, MapPin, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

const CONCEPT_CARDS = [
  {
    icon: Camera,
    title: "Fotos reais do campus",
    description:
      "Cada rodada começa com uma imagem real de um ponto da universidade — nada de ilustrações.",
  },
  {
    icon: Crosshair,
    title: "Pontos por precisão",
    description:
      "Quanto mais perto você marca no mapa, mais pontos ganha. A régua de distância decide o placar.",
  },
];

export function Idea() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute right-[-20%] top-1/4 -z-10 size-[36rem] rounded-full bg-violet-500/10 blur-[140px] dark:bg-violet-500/15"
      />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="A ideia"
            title={
              <>
                A UEM virou um{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-400 dark:to-violet-400">
                  jogo
                </span>
              </>
            }
            description="Aquele passeio pelo campus virou um jogo de memória, mapa e precisão. Se você sabe a diferença entre o bloco H10 e o G80, essa é a sua chance de provar."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <Reveal className="lg:col-span-2 lg:row-span-2">
            <div className="relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl border border-border shadow-xl shadow-foreground/5">
              <Image
                src="/campus-satellite.jpg"
                alt="Vista de satélite do campus sede da Universidade Estadual de Maringá"
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/5" />
              <div className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                <MapPin className="size-4 text-emerald-300" />
              </div>

              <div className="relative p-6 sm:p-8">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles className="size-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-wider">
                    +4.850 pontos
                  </span>
                </div>
                <h3 className="mt-2 max-w-md text-2xl font-semibold leading-tight tracking-tight text-white">
                  Do BCE ao complexo de salas de aula, tudo vira uma pista.
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
                  Você é solto em um ponto do campus, olha ao redor e marca no
                  mapa onde acha que está. É isso. O resto é memória.
                </p>
              </div>
            </div>
          </Reveal>

          {CONCEPT_CARDS.map((card, index) => (
            <Reveal key={card.title} delay={0.1 * (index + 1)}>
              <div className="group flex h-full flex-col justify-between gap-6 rounded-3xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/30">
                <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500/15 via-indigo-500/15 to-violet-500/15 ring-1 ring-primary/10">
                  <card.icon className="size-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium tracking-tight text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.3} className="lg:col-span-3">
            <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-card px-6 py-5 sm:flex-row">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Bora testar essa memória?
                </span>{" "}
                A primeira partida é sua.
              </p>
              <Button
                render={<Link href="/jogar" />}
                className="rounded-full px-6"
              >
                Jogar agora
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}