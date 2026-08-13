"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, Loader2, Lock, MapPin, Trophy } from "lucide-react";
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

type Phase = "loading" | "intro" | "guess" | "roundResult" | "submitted" | "error";

const FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function DailyGame() {
  const attemptIdRef = useRef<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
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

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const current = await api<DailyCurrentData>("/daily-challenges/current");
        if (!active) return;
        setCurrent(current);
        const state = current.status.state;

        if (state === "submitted") {
          setResult({
            score: current.status.score ?? 0,
            distanceMeters: current.status.distanceMeters ?? 0,
            elapsedSeconds: 0,
            guess: current.status.guess ?? { latitude: 0, longitude: 0 },
            correct: current.status.correct ?? { latitude: 0, longitude: 0 },
          });
          setPhase("submitted");
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
        const state = current.status.state;
        if (state === "submitted") {
          setResult({
            score: current.status.score ?? 0,
            distanceMeters: current.status.distanceMeters ?? 0,
            elapsedSeconds: 0,
            guess: current.status.guess ?? { latitude: 0, longitude: 0 },
            correct: current.status.correct ?? { latitude: 0, longitude: 0 },
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
      } catch (err) {
        setPhase("error");
        toast(err instanceof ApiError ? err.message : "Falha ao enviar o palpite.");
      } finally {
        setBusy(false);
      }
    },
    [busy, current]
  );

  useEffect(() => {
    if (phase !== "guess" || secondsLeft == null) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev == null) return prev;
        if (prev <= 1) {
          submitDaily(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, secondsLeft, submitDaily]);

  const timeLimit = current?.timeLimitSeconds ?? 60;

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
      <GameShell title="Desafio Diário">
        <GameResult
          title="Desafio já concluído"
          subtitle="Você só tem uma chance por dia. Volte amanhã para outro canto do campus."
          score={result.score}
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
      <GameShell title="Desafio Diário" fullBleed>
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
            onNext={() => setPhase("submitted")}
          />
        </div>
      </GameShell>
    );
  }

  if (phase === "intro") {
    return (
      <GameShell title="Desafio Diário">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
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
        </div>
      </GameShell>
    );
  }

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

        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
          <span className="w-fit rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm">
            Desafio Diário
          </span>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium tabular-nums shadow-sm backdrop-blur-sm">
            <CalendarDays className="size-3.5 text-orange-500" />
            {secondsLeft ?? timeLimit}s
          </span>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          Onde fica isso?
        </div>

        <GuessMinimap
          guess={guess}
          onGuess={setGuess}
          onClear={() => setGuess(null)}
          onConfirm={() => submitDaily(guess)}
          submitting={busy}
          disabled={phase !== "guess"}
        />
      </div>
    </GameShell>
  );
}