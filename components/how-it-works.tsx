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
  },
  {
    number: "02",
    icon: LocateFixed,
    title: "Marque no mapa",
    description:
      "Arraste o marcador — ou digite o nome do local — até onde você acha que a foto foi tirada.",
  },
  {
    number: "03",
    icon: Target,
    title: "Pontue pela distância",
    description:
      "Quanto mais perto, mais pontos: até 5.000 por rodada. Mas atenção, erros gigantes cobram caro.",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Repita e some",
    description:
      "São 5 rodadas por partida. Ao final, some os pontos e descubra seu lugar no ranking.",
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
        className="absolute inset-0 -z-20 bg-grid-mask opacity-60 dark:opacity-40"
      />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Como funciona"
            title="Uma foto, um palpite, pontos na conta"
            description="Três movimentos e você já está jogando. Sem cadastro complicado e sem tutorial extenso — em 30 segundos você entende tudo."
          />
        </Reveal>

        <div className="relative mt-16 grid gap-10 sm:gap-6 lg:grid-cols-4 lg:gap-4">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[27px] hidden h-px bg-linear-to-r from-transparent via-primary/25 to-transparent lg:block"
          />
          {STEPS.map((step, index) => (
            <Reveal
              key={step.number}
              delay={0.12 * index}
              className="relative flex flex-col items-start"
            >
              <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl border border-border bg-card shadow-lg shadow-foreground/5 ring-4 ring-background">
                <step.icon className="size-5 text-primary" />
              </div>

              <span className="mt-6 text-xs font-semibold tracking-widest text-muted-foreground">
                PASSO {step.number}
              </span>
              <h3 className="mt-2 font-medium tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}