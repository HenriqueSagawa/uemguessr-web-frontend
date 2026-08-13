"use client";

import { cn } from "@/lib/utils";

export function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

const LEVELS = [
  { label: "Muito fraca", bar: "bg-red-500", text: "text-red-500" },
  { label: "Fraca", bar: "bg-orange-500", text: "text-orange-500" },
  { label: "Razoável", bar: "bg-amber-500", text: "text-amber-500" },
  { label: "Boa", bar: "bg-sky-500", text: "text-sky-500" },
  { label: "Forte", bar: "bg-emerald-500", text: "text-emerald-500" },
] as const;

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = passwordScore(password);
  const level = LEVELS[score];

  return (
    <div className="mt-2">
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full bg-muted transition-colors duration-300",
              index < score && level.bar
            )}
          />
        ))}
      </div>
      <p className={cn("mt-1.5 text-xs font-medium", level.text)}>
        {level.label}
      </p>
    </div>
  );
}