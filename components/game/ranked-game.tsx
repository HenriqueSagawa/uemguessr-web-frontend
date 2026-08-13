"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Loader2,
  LogOut,
  Swords,
  Timer,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameShell } from "@/components/game/game-shell";
import { PanoViewer } from "@/components/game/pano-viewer";
import { GuessMinimap } from "@/components/game/guess-minimap";
import { GameResult } from "@/components/game/game-result";
import { createRankedSocket } from "@/lib/ranked-socket";
import type { LatLng, RankedMatchState } from "@/lib/api-types";
import { formatScore } from "@/lib/format";
import { toast } from "sonner";

type Screen = "connecting" | "idle" | "queue" | "match" | "result";

interface QueueInfo {
  queueId: string;
  rating: number;
  expiresAt: string;
}

const MAX_HEALTH = 5000;

function HealthBar({
  label,
  health,
  align = "left",
}: {
  label: string;
  health: number;
  align?: "left" | "right";
}) {
  const pct = Math.max(0, Math.min(100, (health / MAX_HEALTH) * 100));
  return (
    <div className={align === "right" ? "flex flex-col items-end gap-1.5" : "flex flex-col items-start gap-1.5"}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Heart className="size-3.5 text-red-500" />
        <span className="tabular-nums">{health.toLocaleString("pt-BR")}</span>
        <span className="opacity-70">/ {MAX_HEALTH.toLocaleString("pt-BR")}</span>
      </div>
      <div className="h-2 w-full min-w-24 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function RankedGame() {
  const router = useRouter();
  const socketRef = useRef<ReturnType<typeof createRankedSocket> | null>(null);
  const [screen, setScreen] = useState<Screen>("connecting");
  const [queue, setQueue] = useState<QueueInfo | null>(null);
  const [presence, setPresence] = useState({ playersOnline: 0, playersInQueue: 0 });
  const [state, setState] = useState<RankedMatchState | null>(null);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const didJoinRef = useRef(false);

  const handleMatchState = useCallback((next: RankedMatchState) => {
    setState(next);
    if (next.match.status === "FINISHED" || next.match.status === "ABANDONED") {
      setScreen("result");
      return;
    }
    setGuess(null);
    setSecondsLeft(next.currentRound.timeRemainingSeconds);
    setScreen("match");
  }, []);

  useEffect(() => {
    const socket = createRankedSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("queue:status");
      const ping = setInterval(() => socket.emit("dev:ping"), 25000);
      socket.on("dev:pong", () => {});
      socket.on("disconnect", () => clearInterval(ping));
    });

    socket.on("presence:update", (data: { playersOnline: number; playersInQueue: number }) => {
      setPresence(data);
    });

    socket.on("queue:joining", (data: QueueInfo) => {
      didJoinRef.current = true;
      setQueue(data);
      setScreen("queue");
    });

    socket.on("queue:canceled", () => {
      didJoinRef.current = false;
      setQueue(null);
      setScreen("idle");
    });

    socket.on("queue:status", (data: { status: string; queueId?: string; rating?: number; expiresAt?: string; matchId?: string }) => {
      if (data.status === "queued" && data.queueId) {
        didJoinRef.current = true;
        setQueue({ queueId: data.queueId, rating: data.rating ?? 0, expiresAt: data.expiresAt ?? "" });
        setScreen("queue");
      } else if (data.status === "matched" && data.matchId) {
        socket.emit("match:state", { matchId: data.matchId });
      } else if (data.status === "not_queued") {
        didJoinRef.current = false;
        setScreen((prev) => (prev === "connecting" ? "idle" : prev === "idle" ? "idle" : prev));
      }
    });

    socket.on("match:found", handleMatchState);
    socket.on("match:state", handleMatchState);
    socket.on("match:round", handleMatchState);
    socket.on("match:answered", handleMatchState);
    socket.on("match:finished", handleMatchState);

    socket.on("error", (data: { code?: number; message?: string }) => {
      toast(data.message ?? "Ocorreu um erro na partida.");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [handleMatchState]);

  useEffect(() => {
    if (screen !== "match" || secondsLeft == null) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev == null ? prev : Math.max(0, prev - 1)));
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, secondsLeft]);

  const joinQueue = () => {
    socketRef.current?.emit("queue:join");
  };

  const cancelQueue = () => {
    socketRef.current?.emit("queue:cancel");
  };

  const submitGuess = () => {
    const socket = socketRef.current;
    if (!socket || !state || !guess) return;
    setBusy(true);
    socket.emit("match:answer", {
      matchId: state.match.id,
      roundNumber: state.currentRound.roundNumber,
      guessLatitude: guess.latitude,
      guessLongitude: guess.longitude,
    });
    setGuess(null);
    setBusy(false);
  };

  const leaveMatch = () => {
    socketRef.current?.disconnect();
    router.push("/lobby");
  };

  const myAnswered = state?.currentRound.myAnswered ?? false;
  const opponentAnswered = state?.currentRound.opponentAnswered ?? false;
  const last = state?.lastResult;

  const resultWinner = state?.match.winnerId;
  const resultWin =
    state && state.match.status === "FINISHED" ? resultWinner === state.me.id : null;

  return (
    <GameShell title="Ranqueado" fullBleed={screen === "match"}>
      {screen === "connecting" ? (
        <div className="flex flex-1 items-center justify-center gap-3 py-24 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm font-medium">Conectando na arena...</span>
        </div>
      ) : null}

      {screen === "idle" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
          <span className="grid size-16 place-items-center rounded-full border border-violet-500/30 bg-violet-500/10">
            <Swords className="size-7 text-violet-500" />
          </span>
          <h2 className="text-3xl font-semibold tracking-tight">Duelo ranqueado</h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Enfrente outro jogador do seu nível. Quem zerar a vida do adversário
            primeiro vence — e leva pontos de Elo.
          </p>
          <Button className="rounded-full" onClick={joinQueue}>
            Entrar na fila
            <Loader2 className="size-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {presence.playersOnline} online · {presence.playersInQueue} na fila
          </span>
        </div>
      ) : null}

      {screen === "queue" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
          <div className="flex items-center gap-3">
            <Loader2 className="size-6 animate-spin text-violet-500" />
            <h2 className="text-2xl font-semibold tracking-tight">Procurando adversário...</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {presence.playersInQueue} jogador(es) esperando. Pareando por rating
            similar{queue ? ` · seu rating ${queue.rating}` : ""}.
          </p>
          <Button variant="outline" className="rounded-full" onClick={cancelQueue}>
            <LogOut />
            Sair da fila
          </Button>
        </div>
      ) : null}

      {screen === "match" && state ? (
        <div className="relative h-full w-full overflow-hidden bg-black">
          <div className="absolute inset-x-0 top-0 z-[1001] flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b bg-background/90 px-4 py-2.5 backdrop-blur-sm">
            <HealthBar
              label={state.me.displayName ?? state.me.username}
              health={state.match.myHealth}
            />
            <div className="flex flex-col items-center gap-0.5">
              <span
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tabular-nums " +
                  (secondsLeft != null && secondsLeft <= 10
                    ? "border-red-500/40 text-red-500"
                    : "border-border")
                }
              >
                <Timer className="size-3.5" />
                {secondsLeft ?? 0}s
              </span>
              <span className="text-[11px] text-muted-foreground">
                Rodada {state.currentRound.roundNumber} · x
                {state.match.multiplier.toFixed(1)}
              </span>
            </div>
            <HealthBar
              label={state.opponent.displayName ?? state.opponent.username}
              health={state.match.opponentHealth}
              align="right"
            />
          </div>

          <div className="h-full w-full pt-20">
            {state.currentRound.location.imageUrl ? (
              <PanoViewer
                imageUrl={state.currentRound.location.imageUrl}
                alt={`Lugar da rodada ${state.currentRound.roundNumber}`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            Onde fica isso?
          </div>

          <GuessMinimap
            guess={guess}
            onGuess={setGuess}
            onClear={() => setGuess(null)}
            onConfirm={submitGuess}
            submitting={busy}
            disabled={myAnswered}
          />

          {myAnswered ? (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-background/95 px-6 py-5 shadow-xl">
                <Loader2 className="size-5 animate-spin text-violet-500" />
                <p className="text-sm font-medium">
                  Aguardando o adversário responder...
                </p>
                <p className="text-xs text-muted-foreground">
                  {opponentAnswered
                    ? "Adversário já respondeu. Resolvendo rodada."
                    : "Você respondeu. Boa sorte!"}
                </p>
              </div>
            </div>
          ) : null}

          {last ? (
            <div className="pointer-events-none absolute bottom-20 left-1/2 z-[1000] -translate-x-1/2 rounded-full border bg-background/90 px-4 py-2 text-center text-xs text-muted-foreground shadow-lg backdrop-blur-sm">
              Rodada {last.roundNumber}: você{" "}
              <span className="font-semibold tabular-nums text-foreground">
                {formatScore(last.myScore)}
              </span>{" "}
              pts (dano {last.myDamage}) · adversário{" "}
              <span className="font-semibold tabular-nums text-foreground">
                {formatScore(last.opponentScore)}
              </span>{" "}
              pts (dano {last.opponentDamage})
            </div>
          ) : null}
        </div>
      ) : null}

      {screen === "result" && state ? (
        <GameResult
          title={
            resultWin === true
              ? "Vitória!"
              : resultWin === false
                ? "Derrota"
                : "Partida encerrada"
          }
          subtitle={
            state.match.myRatingDelta != null
              ? `Seu Elo ${state.match.myRatingDelta >= 0 ? "+" : ""}${state.match.myRatingDelta}`
              : undefined
          }
          score={state.match.myHealth}
          stats={[
            {
              icon: Heart,
              label: "Vida restante",
              value: state.match.myHealth.toLocaleString("pt-BR"),
            },
            {
              icon: Swords,
              label: "Rodadas",
              value: String(state.history.length),
            },
            {
              icon: User,
              label: "Adversário",
              value: state.opponent.username,
            },
          ]}
          onReplay={joinQueue}
          replayLabel="Jogar de novo"
        >
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full" onClick={leaveMatch}>
              <LogOut />
              Sair da arena
            </Button>
          </div>
        </GameResult>
      ) : null}
    </GameShell>
  );
}