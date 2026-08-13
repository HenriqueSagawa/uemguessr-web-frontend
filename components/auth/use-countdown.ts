"use client";

import { useEffect, useState } from "react";

export function useCountdown(initialSeconds: number, autoStart = false) {
  const [seconds, setSeconds] = useState(autoStart ? initialSeconds : 0);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const start = () => setSeconds(initialSeconds);

  return { seconds, start };
}