"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, Loader2, Lock, MapPin, Timer, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { GameShell } from "@/components/game/game-shell";
import { PanoViewer } from "@/components/game/pano-viewer";
import { GuessMinimap } from "@/components/game/guess-minimap";
import { RoundResultView } from "@/components/game/round-result-view";
import { GameResult } from "@/components/game/game-result";
import { api, ApiError } from "@/lib/api";
import type { DailyCurrentData, DailySubmitData, LatLng } from "@/lib/api-types";
import { formatDistance, formatScore } from "@/lib/format";
import { toast } from "sonner";
import { playSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type Phase = "loading" | "intro" | "guess" | "roundResult" | "submitted" | "error";

const FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function DailyGame() {
  const attemptIdRef = useRef<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const submitRef = useRef<((latlng: LatLng | null) => void) | null>(null);
  const guessRef = useRef<LatLng | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [current, setCurrent] = useState<DailyCurrentData | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [result, setResult] = useState<{
    score: number;
    distanceMeters: number;
    elapsedSeconds: number;
    guess: LatLng;
    correct: LatLng;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  // keep guessRef in sync so timer can read latest guess
  useEffect(() => {
    guessRef.current = guess;
  }, [guess]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const current = await api<DailyCurrentData>("/daily-challenges/current");
        if (!active) return;
        setCurrent(current);
        const status = current.status;

        if (status.state === "submitted") {
          setResult({
            score: status.score ?? 0,
            distanceMeters: status.distanceMeters ?? 0,
            elapsedSeconds: 0,
            guess: status.guess ?? { latitude: 0, longitude: 0 },
            correct: status.correct ?? { latitude: 0, longitude: 0 },
          });
          setPhase("submitted");
          return;
        }

        // Resume in-progress attempt
        if (status.state === "in_progress") {
          attemptIdRef.current = status.attemptId;
          startedAtRef.current = Date.now() - (current.timeLimitSeconds - status.remainingSeconds) * 1000;
          setSecondsLeft(status.remainingSeconds);
          setPhase("guess");
          playSound("roundStart");
          return;
        }

        setPhase("intro");
      } catch (err) {
        if (!active) return;
        setPhase("error");
        toast(err instanceof ApiError ? err.message : "Falha ao carregar o desafio diário.");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const reload = () => {
    setPhase("loading");
    setGuess(null);
    setResult(null);
    void (async () => {
      try {
        const current = await api<DailyCurrentData>("/daily-challenges/current");
        setCurrent(current);
        const status = current.status;
        if (status.state === "submitted") {
          setResult({
            score: status.score ?? 0,
            distanceMeters: status.distanceMeters ?? 0,
            elapsedSeconds: 0,
            guess: status.guess ?? { latitude: 0, longitude: 0 },
            correct: status.correct ?? { latitude: 0, longitude: 0 },
          });
          setPhase("submitted");
          return;
        }
        setPhase("intro");
      } catch (err) {
        setPhase("error");
        toast(err instanceof ApiError ? err.message : "Falha ao carregar o desafio diário.");
      }
    })();
  };

  const startAttempt = async () => {
    if (!current) return;
    setBusy(true);
    try {
      const started = await api<{ attemptId: string; remainingSeconds: number }>(
        `/daily-challenges/${current.id}/start`,
        { method: "POST", body: JSON.stringify({}) }
      );
      attemptIdRef.current = started.attemptId;
      startedAtRef.current = Date.now();
      setSecondsLeft(started.remainingSeconds);
      setPhase("guess");
      playSound("roundStart");
    } catch (err) {
      setPhase("error");
      toast(err instanceof ApiError ? err.message : "Falha ao iniciar o desafio.");
    } finally {
      setBusy(false);
    }
  };

  const submitDaily = useCallback(
    async (latlng: LatLng | null) => {
      if (busy || !current) return;
      setBusy(true);
      try {
        const submitted = await api<DailySubmitData>(
          `/daily-challenges/${current.id}/submit`,
          {
            method: "POST",
            body: JSON.stringify({
              guessLatitude: latlng?.latitude ?? 0,
              guessLongitude: latlng?.longitude ?? 0,
            }),
          }
        );
        const elapsedSeconds = startedAtRef.current
          ? Math.round((Date.now() - startedAtRef.current) / 1000)
          : 0;
        setResult({
          score: submitted.score,
          distanceMeters: submitted.distanceMeters,
          guess: submitted.guess,
          correct: submitted.correct,
          elapsedSeconds,
        });
        setSecondsLeft(0);
        setPhase("roundResult");
        playSound("score");
      } catch (err) {
        setPhase("error");
        toast(err instanceof ApiError ? err.message : "Falha ao enviar o palpite.");
      } finally {
        setBusy(false);
      }
    },
    [busy, current]
  );

  // keep submitRef always pointing to the latest submitDaily (avoids stale closure in timer)
  useEffect(() => {
    submitRef.current = submitDaily;
  }, [submitDaily]);

  // Timer — deps only on phase, uses refs to avoid recreating every second
  useEffect(() => {
    if (phase !== "guess") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev == null) return prev;
        const next = Math.max(0, prev - 1);
        // Play tick sound in last 10 seconds
        if (next > 0 && next <= 10) {
          playSound("tick");
        }
        // Auto-submit when time is up — use guessRef to get current guess
        if (prev <= 1) {
          playSound("timeout");
          submitRef.current?.(guessRef.current);
          clearInterval(timer);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const timeLimit = current?.timeLimitSeconds ?? 60;
  const displaySeconds = secondsLeft ?? timeLimit;
  const isUrgent = displaySeconds <= 10;
  const isWarning = displaySeconds <= 30 && !isUrgent;

  if (phase === "loading") {
    return (
      <GameShell title="Desafio Diário" fullBleed>
        <div className="flex flex-1 items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm font-medium">Buscando o mapa do dia...</span>
        </div>
      </GameShell>
    );
  }

  if (phase === "error") {
    return (
      <GameShell title="Desafio Diário">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
          <Lock className="size-8 text-muted-foreground" />
          <p className="text-lg font-semibold tracking-tight">
            O desafio de hoje não está disponível.
          </p>
          <Button className="rounded-full" onClick={reload}>
            Tentar novamente
          </Button>
        </div>
      </GameShell>
    );
  }

  if (phase === "submitted" && result) {
    return (
      <GameShell title="Desafio Diário" showQuitButton={false}>
        <GameResult
          title="Desafio já concluído"
          subtitle="Você só tem uma chance por dia. Volte amanhã para outro canto do campus."
          score={result.score}
          maxScore={5000}
          guess={result.guess}
          correct={result.correct}
          stats={[
            {
              icon: MapPin,
              label: "Distância",
              value: formatDistance(result.distanceMeters),
            },
            {
              icon: Trophy,
              label: "Pontos",
              value: formatScore(result.score),
            },
          ]}
        />
      </GameShell>
    );
  }

  if (phase === "roundResult" && result) {
    return (
      <GameShell title="Desafio Diário" fullBleed showQuitButton={false}>
        <div className="h-full w-full p-4">
          <RoundResultView
            roundNumber={1}
            totalRounds={1}
            roundScore={result.score}
            gameScore={result.score}
            distanceMeters={result.distanceMeters}
            guess={result.guess}
            correct={result.correct}
            isLast
            onNext={() => {
              setPhase("submitted");
            }}
          />
        </div>
      </GameShell>
    );
  }

  if (phase === "intro") {
    return (
      <GameShell title="Desafio Diário">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 py-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays className="size-3.5 text-orange-500" />
            {FORMATTER.format(new Date())}
          </span>
          <h2 className="text-3xl font-semibold tracking-tight">
            Um único lugar.
            <br />
            Uma única chance.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Um canto da UEM foi sorteado para hoje. Você terá{" "}
            <span className="font-semibold text-foreground">
              {timeLimit} segundos
            </span>{" "}
            para localizá-lo no mapa. Depois do palpite, não tem volta.
          </p>
          <Button className="rounded-full" onClick={startAttempt} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            Aceitar desafio
          </Button>
        </motion.div>
      </GameShell>
    );
  }

  // Guess phase
  return (
    <GameShell title="Desafio Diário" fullBleed>
      <div className="relative h-full w-full overflow-hidden bg-black">
        {current?.location.imageUrl ? (
          <PanoViewer imageUrl={current.location.imageUrl} alt="Lugar do desafio diário" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Prominent Timer — top center */}
        <div className="pointer-events-none absolute left-1/2 top-4 z-[1001] -translate-x-1/2">
          <motion.div
            animate={isUrgent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={isUrgent ? { duration: 0.5, repeat: Infinity } : {}}
            className={cn(
              "flex items-center gap-2 rounded-full border px-5 py-2.5 text-lg font-bold tabular-nums shadow-xl backdrop-blur-md transition-colors",
              isUrgent
                ? "border-red-500/60 bg-red-950/85 text-red-400"
                : isWarning
                ? "border-orange-500/40 bg-orange-950/80 text-orange-300"
                : "border-white/20 bg-black/65 text-white"
            )}
          >
            <Timer className="size-5" />
            {formatTime(displaySeconds)}
          </motion.div>
        </div>

        {/* Urgency vignette — red glow when < 10s */}
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="pointer-events-none absolute inset-0 z-[1000]"
            style={{
              boxShadow: "inset 0 0 80px 20px rgba(239,68,68,0.35)",
            }}
          />
        )}

        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
          <span className="w-fit rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm">
            Desafio Diário
          </span>
        </div>

        {!guess && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            Onde fica isso?
          </div>
        )}

        <GuessMinimap
          guess={guess}
          onGuess={(pt) => {
            setGuess(pt);
            playSound("confirm");
          }}
          onClear={() => setGuess(null)}
          onConfirm={() => {
            if (guess) {
              playSound("confirm");
              submitDaily(guess);
            }
          }}
          submitting={busy}
          disabled={phase !== "guess"}
          timeLeft={displaySeconds}
          totalTime={timeLimit}
        />
      </div>
    </GameShell>
  );
}