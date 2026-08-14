import type { SVGProps } from "react";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.24 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        {...props}
      >
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
      </svg>
    ),
  },
  {
    label: "E-mail",
    href: "mailto:uemguessr@gmail.com",
    icon: (props: SVGProps<SVGSVGElement>) => <Mail aria-hidden {...props} />,
  },
];

const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Modos de jogo", href: "#modos" },
      { label: "Demonstração", href: "#demonstracao" },
      { label: "Ranking", href: "/lobby/ranking" },
    ],
  },
  {
    title: "Jogo",
    links: [
      { label: "Jogar", href: "/jogar" },
      { label: "Ranking", href: "/lobby/ranking" },
      { label: "Desafio diário", href: "/jogar" },
      { label: "Entrar", href: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Termos de uso", href: "#" },
      { label: "Política de privacidade", href: "#" },
      { label: "Contato", href: "mailto:contato@uemguessr.dev" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-grid-fade opacity-40 dark:opacity-30"
      />
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -z-10 h-64 w-2/3 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-500/15"
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="relative flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
                <MapPin className="size-4" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                UEMGuessr
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Um jogo de adivinhação de lugares feito por quem vive, estuda e
              sonha dentro da Universidade Estadual de Maringá.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted hover:text-foreground hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} UEMGuessr. Desenvolvido por{" "}
            <Link
              href="https://www.instagram.com/henriquetutomu/"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Henrique Sagawa
            </Link>
          </p>
          <p className="max-w-md text-center sm:text-right">
            Não é um projeto oficial da Universidade Estadual de Maringá.
          </p>
        </div>
      </div>
    </footer>
  );
}