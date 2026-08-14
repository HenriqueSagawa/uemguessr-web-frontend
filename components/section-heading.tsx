import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  icon?: LucideIcon;
  gradient?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  icon: Icon,
  gradient = false,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered && "items-center text-center",
        className
      )}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-500 opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-blue-500" />
        </span>
        {Icon ? <Icon className="size-3" /> : null}
        {eyebrow}
      </span>

      <h2 className="max-w-2xl text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tighter text-foreground">
        {gradient ? (
          <AnimatedGradientText
            speed={0.8}
            colorFrom="#3b82f6"
            colorTo="#8b5cf6"
            className="inline text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tighter"
          >
            {title}
          </AnimatedGradientText>
        ) : (
          title
        )}
      </h2>

      {description ? (
        <p
          className={cn(
            "max-w-xl text-base leading-relaxed text-muted-foreground",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}