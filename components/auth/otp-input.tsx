"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  className,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setValueAt = (index: number, char: string) => {
    const next = value.split("");
    next[index] = char;
    const nextValue = next.join("");
    onChange(nextValue);
    if (char && index < length - 1) refs.current[index + 1]?.focus();
    if (nextValue.replace(/\D/g, "").length >= length) onComplete?.(nextValue);
  };

  const handleChange = (index: number, raw: string) => {
    const char = raw.slice(-1).replace(/\D/g, "");
    setValueAt(index, char);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[index]) {
        setValueAt(index, "");
      } else if (index > 0) {
        setValueAt(index - 1, "");
        refs.current[index - 1]?.focus();
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      refs.current[Math.max(0, index - 1)]?.focus();
      return;
    }
    if (e.key === "ArrowRight") {
      refs.current[Math.min(length - 1, index + 1)]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    onChange(digits);
    refs.current[Math.max(0, digits.length - 1)]?.focus();
    if (digits.length >= length) onComplete?.(digits);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          value={value[index] ?? ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : undefined}
          aria-label={`Dígito ${index + 1} do código`}
          maxLength={1}
          disabled={disabled}
          className="h-12 w-full flex-1 rounded-xl border-border bg-background px-0 text-center text-lg font-semibold tabular-nums focus-visible:border-ring dark:bg-input/30 disabled:opacity-60"
        />
      ))}
    </div>
  );
}