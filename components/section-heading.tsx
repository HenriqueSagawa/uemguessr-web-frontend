import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  icon?: LucideIcon;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  icon: Icon,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
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
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "max-w-xl text-base leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}