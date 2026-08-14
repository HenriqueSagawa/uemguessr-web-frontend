import type { ReactNode } from "react";
import Image from "next/image";
import logo from "@/public/logo-uemguessr.webp";
import Link from "next/link";
import { ArrowLeft, Crosshair, MapPin, Trophy } from "lucide-react";

const FEATURES = [
  { icon: MapPin, text: "Diversos locais espalhados pelo campus" },
  { icon: Crosshair, text: "Pontuação calculada pela distância do palpite" },
  { icon: Trophy, text: "Ranking geral, semanal e desafio diário" },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="/campus-satellite.jpg"
          alt="Vista de satélite do campus sede da UEM"
          fill
          priority
          sizes="(min-width: 1024px) 51vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-[#0b1020]/95 via-[#111a33]/88 to-[#1a1440]/92" />
        <div
          aria-hidden
          className="absolute -left-24 -top-24 size-96 rounded-full bg-blue-500/25 blur-[120px]"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-24 size-96 rounded-full bg-violet-500/25 blur-[120px]"
        />

        <div className="relative flex h-full min-h-dvh flex-col justify-between p-12">
          <Link href="/" className="flex w-fit items-center gap-2.5">
            <span className="relative flex size-8 items-center justify-center rounded-lg bg-white text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
            <Image src={logo} alt="Logo do UEMGuessr" className="size-5 rounded-md" />
          </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              UEMGuessr
            </span>
          </Link>

          <div>
            <h2 className="max-w-md text-[clamp(1.75rem,2.6vw,2.5rem)] font-semibold leading-[1.08] tracking-tighter text-white">
              Conheça a UEM como você{" "}
              <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                nunca viu
              </span>
            </h2>
            <ul className="mt-8 space-y-3.5">
              {FEATURES.map((feature) => (
                <li
                  key={feature.text}
                  className="flex items-center gap-3 text-sm text-white/75"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 backdrop-blur-sm">
                    <feature.icon className="size-3.5 text-sky-300" />
                  </span>
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <ArrowLeft className="size-3.5" />
            Voltar para a home
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}