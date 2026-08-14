"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface GameTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  className?: string;
}

export function GameTimer({ secondsLeft, totalSeconds, className }: GameTimerProps) {
  const percentage = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
  
  let colorClass = "text-green-500 stroke-green-500";
  if (percentage <= 20) {
    colorClass = "text-red-500 stroke-red-500";
  } else if (percentage <= 50) {
    colorClass = "text-yellow-500 stroke-yellow-500";
  }

  const isLowTime = secondsLeft < 10 && secondsLeft > 0;
  
  const m = Math.floor(secondsLeft / 60);
  const s = Math.floor(secondsLeft % 60);
  const formatted = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <span className="mb-2 text-sm font-bold tracking-widest text-muted-foreground">TEMPO</span>
      
      <motion.div
        className="relative flex items-center justify-center"
        animate={isLowTime ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{
          duration: 1,
          repeat: isLowTime ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="6"
            className="stroke-muted/30"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={colorClass}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "linear" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-2xl font-black font-mono", colorClass.split(' ')[0])}>
            {formatted}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
