"use client";

import { Eye, LocateFixed, Target, Trophy } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const STEPS = [
  {
    number: "01",
    icon: Eye,
    title: "Sua rodada começa",
    description:
      "Uma foto de um ponto do campus aparece na tela — pode ser um bloco, um pátio ou um canto escondido.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    number: "02",
    icon: LocateFixed,
    title: "Marque no mapa",
    description:
      "Arraste o marcador — ou digite o nome do local — até onde você acha que a foto foi tirada.",
    gradient: "from-violet-500 to-fuchsia-400",
  },
  {
    number: "03",
    icon: Target,
    title: "Pontue pela distância",
    description:
      "Quanto mais perto, mais pontos: até 5.000 por rodada. Mas atenção, erros gigantes cobram caro.",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Repita e some",
    description:
      "São 5 rodadas por partida. Ao final, some os pontos e descubra seu lugar no ranking.",
    gradient: "from-amber-500 to-orange-400",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="absolute left-[-15%] top-1/3 -z-10 size-[30rem] rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-500/15"
      />
      <div
        aria-hidden
        className="absolute right-[-10%] top-10 -z-10 size-[24rem] rounded-full bg-violet-500/10 blur-[120px] dark:bg-violet-500/15"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-grid-fade opacity-50 dark:opacity-40"
      />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal blur>
          <SectionHeading
            eyebrow="Como funciona"
            title="Uma foto, um palpite, pontos na conta"
            description="Três movimentos e você já está jogando. Sem cadastro complicado e sem tutorial extenso — em 30 segundos você entende tudo."
          />
        </Reveal>

        <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[27px] hidden h-px bg-linear-to-r from-transparent via-primary/25 to-transparent lg:block"
          />
          {STEPS.map((step, index) => (
            <Reveal
              key={step.number}
              delay={0.1 * index}
              blur
              className="relative flex flex-col items-start"
            >
              <div className="group relative z-10 w-full">
                <div className="relative flex flex-col items-start rounded-3xl border border-border bg-card p-6 shadow-lg shadow-foreground/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/[0.07] via-transparent to-violet-500/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="flex w-full items-start justify-between">
                    <div
                      className={`relative z-10 grid size-14 place-items-center rounded-2xl bg-linear-to-br ${step.gradient} text-white shadow-lg shadow-foreground/10 ring-4 ring-background`}
                    >
                      <step.icon className="size-5" />
                    </div>
                    <span className="text-3xl font-bold tracking-tighter text-foreground/10 transition-colors duration-300 group-hover:text-foreground/20">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-medium tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}