"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { LogIn, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import logo from "@/public/logo-uemguessr.webp"
import Image from "next/image";

const NAV_LINKS = [
  { href: "/jogar", label: "Jogar", external: true },
  { href: "#como-funciona", label: "Como funciona", external: false },
  { href: "/ranking", label: "Ranking", external: true },
];

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function Navbar({ className }: { className?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastScrollY = useRef(0);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const theme = useSyncExternalStore<"light" | "dark">(
    subscribeTheme,
    getThemeSnapshot,
    () => "light"
  );

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y <= 0) {
        setHidden(false);
      } else if (y > lastScrollY.current + 6 && !open) {
        setHidden(true);
      } else if (y < lastScrollY.current - 6) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  const handleThemeChange = (next: "light" | "dark") => {
    try {
      localStorage.setItem("uemguessr-theme", next);
    } catch {
      /* storage indisponível */
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={hidden ? { y: "-110%" } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
        scrolled
          ? "border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
          : "border-transparent bg-transparent",
        className
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex size-8 items-center justify-center rounded-lg bg-white text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
            <Image src={logo} alt="Logo do UEMGuessr" className="size-5 rounded-md" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            UEMGuessr
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const classes =
              "group relative rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground";
            const pill =
              "absolute inset-0 scale-90 rounded-full bg-muted opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100";
            return link.external ? (
              <Link key={link.label} href={link.href} className={classes}>
                <span className={pill} />
                <span className="relative">{link.label}</span>
              </Link>
            ) : (
              <a key={link.label} href={link.href} className={classes}>
                <span className={pill} />
                <span className="relative">{link.label}</span>
              </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {mounted ? (
            <AnimatedThemeToggler
              theme={theme}
              onThemeChange={handleThemeChange}
              aria-label="Alternar tema"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-[18px]"
            />
          ) : (
            <span aria-hidden className="size-9" />
          )}

          <div className="mx-1 h-4 w-px bg-border" />

          <Button
            render={<Link href="/login" />}
            className="h-9 gap-1.5 rounded-full px-4 text-xs font-semibold"
          >
            <LogIn className="size-3.5" />
            Entrar
          </Button>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-6 py-4">
              {NAV_LINKS.map((link) =>
                link.external ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </a>
                )
              )}

              <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-4">
                <AnimatedThemeToggler
                  theme={theme}
                  onThemeChange={handleThemeChange}
                  aria-label="Alternar tema"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-[18px]"
                />

                <Button
                  render={<Link href="/login" />}
                  className="h-9 gap-1.5 rounded-full px-4 text-xs font-semibold"
                >
                  <LogIn className="size-3.5" />
                  Entrar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
