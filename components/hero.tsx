"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight, MapPin, Play, Trophy } from "lucide-react";
import { AuroraText } from "./ui/aurora-text";
import { TextAnimate } from "./ui/text-animate";
import { WordRotate } from "./ui/word-rotate";
import { ShineBorder } from "./ui/shine-border";
import { Safari } from "./ui/safari";
import { Iphone } from "./ui/iphone";
import { Marquee } from "./ui/marquee";
import { Button } from "@/components/ui/button";

const ease = [0.16, 1, 0.3, 1] as const;

const SPOTS = [
  "BCE",
  "Bloco C56",
  "Restaurante Universitário",
  "Bloco D34",
];

const MARQUEE_ITEMS = [
  "Biblioteca Central",
  "Restaurante Universitário",
  "Bloco C56",
  "Hospital Regional",
  "Bloco D34",
  "Centro de Tecnologia",
  "Bloco B33",
  "Ginásio de Esportes",
  "Cantina Central",
  "Bloco E46",
];

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade opacity-50 dark:opacity-40" />
        <div className="absolute left-[-15%] top-1/3 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-500/15" />
        <div className="absolute right-[-10%] top-10 h-[24rem] w-[24rem] rounded-full bg-violet-500/10 blur-[120px] dark:bg-violet-500/15" />
      </div>

      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-16 px-6 pb-24 pt-28 lg:grid-cols-2 lg:gap-16 lg:pb-20">
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            <MapPin className="size-3" />
            Universidade Estadual de Maringá
          </motion.div>

          <motion.h1
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="mt-7 flex flex-col"
          >
            <span className="text-[clamp(2rem,4.5vw,3.5rem)] font-normal tracking-tight text-foreground/40">
              Você conhece
            </span>
            <span className="mt-1 text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-tighter text-foreground">
              a <AuroraText>UEM?</AuroraText>
            </span>
          </motion.h1>

          <TextAnimate
            by="word"
            animation="blurInUp"
            duration={0.4}
            delay={0.45}
            startOnView={false}
            once
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            Explore o campus, teste sua memória e descubra cantos que você nunca
            percebeu. Cada rodada é uma nova aventura pela Universidade Estadual
            de Maringá.
          </TextAnimate>

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
            className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span>Próximo palpite:</span>
            <WordRotate
              words={SPOTS}
              className="text-sm font-semibold text-foreground"
            />
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              render={<Link href="/lobby" />}
              className="group relative h-12 overflow-hidden rounded-full px-8 text-sm font-semibold shadow-lg shadow-foreground/10"
            >
              <span className="relative z-10 flex items-center gap-2">
                Começar a jogar
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-primary-foreground/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            </Button>

            <Button
              render={<a href="#como-funciona" />}
              variant="outline"
              className="h-12 gap-2 rounded-full px-6 text-sm font-semibold"
            >
              <Play className="size-3.5" />
              Como funciona
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
          className="relative mx-auto w-full max-w-[37rem] pt-8 pb-16 sm:pt-10 sm:pb-20"
        >
          <div
            aria-hidden
            className="absolute -inset-8 -z-10 rounded-[3.5rem] bg-linear-to-br from-blue-500/25 via-violet-500/15 to-cyan-500/20 blur-3xl dark:from-blue-500/30 dark:via-violet-500/20 dark:to-cyan-500/25"
          />

          <div className="relative rounded-[14px]">
            <Safari
              url="uemguessr.app"
              imageSrc="/foto-area.png"
              mode="default"
              className="drop-shadow-[0_24px_48px_rgba(0,0,0,0.25)]"
            />
            <ShineBorder
              shineColor={["#3b82f6", "#8b5cf6", "#06b6d4", "#3b82f6"]}
              borderWidth={1.5}
              duration={12}
            />
          </div>

          <motion.div
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 30, x: -10, rotate: -2 }
            }
            animate={{ opacity: 1, y: 0, x: 0, rotate: -2 }}
            transition={{ duration: 0.9, delay: 0.9, ease }}
            className="absolute -bottom-4 -left-4 z-20 w-[42%] min-w-[9.5rem] sm:-left-10 sm:w-[37%]"
          >
            <Iphone
              src="/foto-uem.webp"
              className="drop-shadow-[0_36px_48px_rgba(0,0,0,0.35)]"
            />
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.15, ease }}
            className="absolute -top-5 -right-3 z-30 flex items-center gap-3 rounded-2xl border border-border/60 bg-white/80 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur-md dark:bg-black/50"
          >
            <div className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/30">
              <Trophy className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none text-foreground">
                4.850 pts
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Recorde da rodada
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.3, ease }}
            className="absolute -top-6 -left-2 z-30 hidden items-center gap-2 rounded-full border border-border/60 bg-white/80 px-3.5 py-2 shadow-lg shadow-black/5 backdrop-blur-md sm:flex dark:bg-black/50"
          >
            <MapPin className="size-3.5 text-blue-500" />
            <span className="text-xs font-medium text-foreground">
              Campus Sede
            </span>
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.45, ease }}
            className="absolute -bottom-2 right-2 z-30 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 backdrop-blur-md sm:right-6"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Acertou em 12 m
            </span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="relative border-y border-border/60 bg-background/60 py-4 backdrop-blur-sm"
      >
        <div className="relative flex items-center overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent"
          />
          <Marquee repeat={2} pauseOnHover className="[--gap:3rem] [--duration:45s]">
            {MARQUEE_ITEMS.map((item) => (
              <span
                key={item}
                className="flex items-center gap-3 text-sm font-medium text-muted-foreground"
              >
                <MapPin className="size-4 text-blue-500/70" />
                {item}
              </span>
            ))}
          </Marquee>
        </div>
      </motion.div>
    </section>
  );
}