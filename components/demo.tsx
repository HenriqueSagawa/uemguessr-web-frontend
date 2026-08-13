"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Clapperboard, MousePointerClick, Play } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

export function Demo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [started, setStarted] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    void video.play().catch(() => setFailed(true));
  };

  return (
    <section
      id="demonstracao"
      className="relative scroll-mt-20 overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-primary/30 to-transparent"
      />
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Demonstração"
            icon={Clapperboard}
            title="Veja o jogo em ação"
            description="Um minuto é o suficiente para entender a cara da partida: a foto, o mapa, o marcador e aquela pequena reviravolta no resultado."
          />
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-linear-to-br from-blue-500/15 via-violet-500/10 to-transparent blur-2xl dark:from-blue-500/25 dark:via-violet-500/15"
            />
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-foreground/10">
              <div className="relative">
                {failed ? (
                  <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-5 bg-card px-6 py-16 text-center sm:py-24">
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-muted/50">
                      <MousePointerClick className="size-6 text-muted-foreground" />
                    </div>
                    <div className="max-w-sm">
                      <p className="text-base font-medium text-foreground">
                        Demonstração em produção
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        O vídeo de demonstração ainda está sendo finalizado.
                        Enquanto isso, venha jogar uma partida de verdade.
                      </p>
                    </div>
                    <Button
                      render={<Link href="/lobby" />}
                      className="rounded-full px-6"
                    >
                      Começar a jogar
                    </Button>
                  </div>
                ) : (
                  <div className="group/player relative aspect-video overflow-hidden bg-black">
                    <video
                      ref={videoRef}
                      className="size-full object-contain"
                      poster="/campus-satellite.jpg"
                      controls
                      preload="none"
                      playsInline
                      muted={false}
                      onError={() => setFailed(true)}
                      onPlay={() => setStarted(true)}
                    >
                      <source src="/gameplay-uemguessr.mp4" type="video/mp4" />
                      Seu navegador não suporta vídeo.
                    </video>

                    {!started && !failed ? (
                      <>
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-black/30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={handlePlay}
                            aria-label="Reproduzir vídeo de demonstração"
                            className="group/play flex size-20 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 sm:size-24"
                          >
                            <Play className="ml-1 size-8 fill-white text-white" />
                          </button>
                        </div>
                        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm">
                          Pressione para assistir · 1 min
                        </span>
                      </>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-between gap-3 border-t border-border bg-card px-6 py-4 sm:flex-row">
                <span className="text-xs text-muted-foreground">
                  Partida exemplo · Modo solo · Campus Sede
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Vídeo demonstrativo
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}