"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Play, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { icon: MapPin, value: "120+", label: "locais pelo campus" },
  { icon: Trophy, value: "5", label: "rodadas por partida" },
  { icon: Users, value: "1.000+", label: "jogadores" },
];

const ease = [0.16, 1, 0.3, 1] as const;
const drift = { duration: 16, repeat: Infinity, ease: "easeInOut" as const };

export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-35%] h-[80vh] w-[120vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(96,165,250,0.16),transparent_60%)]" />

        <motion.div
          className="absolute -top-1/3 left-[10%] h-[130%] w-44 -rotate-[24deg] bg-linear-to-b from-blue-500/20 via-blue-500/5 to-transparent blur-3xl"
          animate={reducedMotion ? undefined : { x: [0, 50, 0] }}
          transition={reducedMotion ? undefined : { ...drift, duration: 18 }}
        />
        <motion.div
          className="absolute -top-1/3 left-[32%] h-[130%] w-24 -rotate-[14deg] bg-linear-to-b from-violet-500/15 via-violet-500/5 to-transparent blur-3xl"
          animate={reducedMotion ? undefined : { x: [0, -40, 0] }}
          transition={reducedMotion ? undefined : { ...drift, duration: 22 }}
        />
        <motion.div
          className="absolute -top-1/3 right-[24%] h-[130%] w-32 rotate-[18deg] bg-linear-to-b from-cyan-500/15 via-cyan-500/5 to-transparent blur-3xl"
          animate={reducedMotion ? undefined : { x: [0, 40, 0] }}
          transition={reducedMotion ? undefined : { ...drift, duration: 20 }}
        />
        <motion.div
          className="absolute -top-1/3 right-[6%] h-[130%] w-20 rotate-[30deg] bg-linear-to-b from-blue-500/20 via-blue-500/5 to-transparent blur-3xl"
          animate={reducedMotion ? undefined : { x: [0, -30, 0] }}
          transition={reducedMotion ? undefined : { ...drift, duration: 17 }}
        />

        <motion.div
          className="absolute -left-40 top-1/4 size-[32rem] rounded-full bg-blue-500/15 blur-[130px] dark:bg-blue-500/20"
          animate={reducedMotion ? undefined : { x: [0, 50, 0], y: [0, 30, 0] }}
          transition={reducedMotion ? undefined : { ...drift, duration: 24 }}
        />
        <motion.div
          className="absolute -right-32 top-1/2 size-[28rem] rounded-full bg-violet-500/15 blur-[120px] dark:bg-violet-500/20"
          animate={reducedMotion ? undefined : { x: [0, -40, 0], y: [0, -24, 0] }}
          transition={reducedMotion ? undefined : { ...drift, duration: 26 }}
        />

        <div
          className="absolute inset-0 opacity-70 dark:opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
          }}
        />
      </div>

      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
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
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="mt-7 flex flex-col"
          >
            <span className="text-[clamp(2rem,4.5vw,3.5rem)] font-normal tracking-tight text-foreground/40">
              Você conhece
            </span>
            <span className="text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.9] tracking-tighter text-foreground">
              a{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-sky-400 dark:via-blue-400 dark:to-violet-400">
                UEM?
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            Explore o campus, teste sua memória e descubra cantos que você nunca
            percebeu. Cada rodada é uma nova aventura pela Universidade Estadual
            de Maringá.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
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

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease }}
            className="mt-14 flex items-center gap-10 sm:gap-12"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-start gap-1">
                <span className="flex items-center gap-1.5 text-lg font-semibold tracking-tight text-foreground">
                  <stat.icon className="size-4 text-muted-foreground" />
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
          className="relative"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-br from-blue-500/20 via-violet-500/10 to-transparent blur-2xl dark:from-blue-500/30 dark:via-violet-500/20" />
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-2xl shadow-foreground/10">
            <div className="relative aspect-[4/5] w-full lg:aspect-[5/5.6]">
              <Image
                src="/foto-area.png"
                alt="Vista de satélite do campus sede da Universidade Estadual de Maringá"
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/10" />
            </div>
          </div>

          <p className="mt-3 text-right text-[10px] text-muted-foreground/70">
            Imagem: Esri, Maxar, Earthstar Geographics
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-foreground/20 p-1.5">
          <motion.span
            className="size-1 rounded-full bg-foreground/50"
            animate={reducedMotion ? undefined : { y: [0, 8, 0], opacity: [1, 0.2, 1] }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </div>
      </motion.div>
    </section>
  );
}
