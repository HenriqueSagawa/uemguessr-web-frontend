"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  scale?: number;
  className?: string;
  as?: "div" | "span";
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  scale = 1,
  className,
  as = "div",
}: RevealProps) {
  const reducedMotion = useReducedMotion();
  const MotionTag = as === "span" ? motion.span : motion.div;

  return (
    <MotionTag
      initial={reducedMotion ? { opacity: 0, scale } : { opacity: 0, y, scale }}
      whileInView={
        reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0, scale: 1 }
      }
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}