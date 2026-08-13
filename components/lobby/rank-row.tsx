import { Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { initialsOf } from "@/lib/ranked";
import { cn } from "@/lib/utils";

const POSITION_CLASS: Record<number, string> = {
  1: "text-amber-500",
  2: "text-slate-400",
  3: "text-orange-500",
};

export interface RankRowEntry {
  id: string;
  name: string;
  rating: number;
  divisionLabel?: string;
  avatarUrl?: string | null;
}

export function RankRow({
  entry,
  position,
  highlighted,
}: {
  entry: RankRowEntry;
  position: number;
  highlighted?: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2.5 sm:gap-4 sm:px-4",
        highlighted
          ? "bg-linear-to-r from-blue-500/10 to-violet-500/5 ring-1 ring-primary/30"
          : "border-b border-border/50 last:border-0 hover:bg-muted/50"
      )}
    >
      <span className="flex w-7 shrink-0 items-center justify-center">
        {position === 1 ? (
          <Crown className="size-4 text-amber-500" />
        ) : (
          <span
            className={cn(
              "font-mono text-sm font-semibold tabular-nums",
              POSITION_CLASS[position] ?? "text-muted-foreground"
            )}
          >
            {position}
          </span>
        )}
      </span>
      <Avatar className="size-8 shrink-0">
        {entry.avatarUrl ? (
          <AvatarImage src={entry.avatarUrl} alt={entry.name} />
        ) : null}
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-[10px] font-semibold text-white">
          {initialsOf(entry.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm",
            highlighted ? "font-medium" : "text-muted-foreground"
          )}
        >
          {entry.name}
        </p>
        {entry.divisionLabel ? (
          <p className="truncate text-xs text-muted-foreground/70">
            {entry.divisionLabel}
          </p>
        ) : null}
      </div>
      {highlighted ? <Badge>Você</Badge> : null}
      <span className="font-mono text-sm text-muted-foreground tabular-nums">
        {entry.rating.toLocaleString("pt-BR")}
      </span>
    </li>
  );
}