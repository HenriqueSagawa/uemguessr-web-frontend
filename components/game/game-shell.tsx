"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameShellProps {
  title: string;
  fullBleed?: boolean;
  children: React.ReactNode;
}

export function GameShell({ title, fullBleed = false, children }: GameShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/lobby"
            aria-label="Voltar ao lobby"
            className="grid size-9 cursor-pointer place-items-center rounded-full border bg-background text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="size-4" />
          </Link>
          <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
        </div>
        <Button
          render={<Link href="/lobby" />}
          variant="ghost"
          className="rounded-full text-muted-foreground"
        >
          Desistir
        </Button>
      </header>
      <main
        className={
          fullBleed
            ? "flex h-[calc(100dvh-3.5rem)] w-full flex-col"
            : "mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 sm:p-6"
        }
      >
        {children}
      </main>
    </div>
  );
}