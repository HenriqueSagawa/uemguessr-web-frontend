"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Heart,
  Loader2,
  LogOut,
  Swords,
  Timer,
  User,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GameShell } from "@/components/game/game-shell";
import { PanoViewer } from "@/components/game/pano-viewer";
import { GuessMinimap } from "@/components/game/guess-minimap";
import { GameResult } from "@/components/game/game-result";
import { createRankedSocket } from "@/lib/ranked-socket";
import { api } from "@/lib/api";
import type {
  LatLng,
  RankedMatchState,
  RankedProfileData,
  UserProfile,
} from "@/lib/api-types";
import { formatScore } from "@/lib/format";
import { initialsOf } from "@/lib/ranked";
import { playSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { RankedRoundResultScreen } from "./ranked-round-result";

type Screen = "connecting" | "queue" | "found" | "match" | "result";

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
  const [damage, setDamage] = useState<number | null>(null);
  const prevHealthRef = useRef(health);

  useEffect(() => {
    if (health < prevHealthRef.current) {
      setDamage(prevHealthRef.current - health);
      const t = setTimeout(() => setDamage(null), 2000);
      prevHealthRef.current = health;
      return () => clearTimeout(t);
    }
    prevHealthRef.current = health;
  }, [health]);

  const pct = Math.max(0, Math.min(100, (health / MAX_HEALTH) * 100));

  return (
    <div className={align === "right" ? "flex flex-col items-end gap-1.5" : "flex flex-col items-start gap-1.5"}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground relative">
        {align === "right" ? (
          <>
            <span className="opacity-70">{MAX_HEALTH.toLocaleString("pt-BR")} /</span>
            <span className="tabular-nums">{health.toLocaleString("pt-BR")}</span>
            <Heart className="size-3.5 text-red-500" />
          </>
        ) : (
          <>
            <Heart className="size-3.5 text-red-500" />
            <span className="tabular-nums">{health.toLocaleString("pt-BR")}</span>
            <span className="opacity-70">/ {MAX_HEALTH.toLocaleString("pt-BR")}</span>
          </>
        )}
        <AnimatePresence>
          {damage !== null && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={cn("absolute text-red-500 font-bold", align === "right" ? "right-0" : "left-0")}
            >
              -{damage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="h-2 w-full min-w-24 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-700", align === "right" ? "ml-auto" : "")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

function DuelCard({
  name,
  avatarUrl,
  divisionLabel,
  rating,
  searching = false,
  accent = false,
}: {
  name?: string;
  avatarUrl?: string | null;
  divisionLabel?: string | null;
  rating?: number | null;
  searching?: boolean;
  accent?: boolean;
}) {
  const displayName = name || (searching ? "?" : "Adversário");
  const ratingText =
    rating != null ? rating.toLocaleString("pt-BR") : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center gap-3 rounded-3xl border p-6 sm:p-8",
        accent
          ? "border-violet-500/30 bg-violet-500/5"
          : "border-border bg-card"
      )}
    >
      <div className="relative">
        <Avatar className="size-20 sm:size-24">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
          <AvatarFallback
            className={cn(
              "bg-gradient-to-br text-xl font-semibold text-white sm:text-2xl",
              accent ? "from-violet-500 to-fuchsia-600" : "from-blue-500 to-violet-600"
            )}
          >
            {initialsOf(displayName)}
          </AvatarFallback>
        </Avatar>
        {searching ? (
          <span className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full border border-white/20 bg-violet-600">
            <Loader2 className="size-4 animate-spin text-white" />
          </span>
        ) : null}
      </div>

      <span className="text-lg font-semibold tracking-tight sm:text-xl">
        {displayName}
      </span>

      {searching ? (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="inline-flex gap-1">
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className="size-1.5 rounded-full bg-muted-foreground"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: dot * 0.2,
                }}
              />
            ))}
          </span>
          Buscando adversário...
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            {divisionLabel ?? "Sem divisão"}
          </span>
          <span className="text-2xl font-black tabular-nums">
            {ratingText}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            rating
          </span>
        </div>
      )}
    </motion.div>
  );
}

function VersusBadge() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="flex items-center justify-center"
    >
      <span className="grid size-14 place-items-center rounded-full border border-violet-500/40 bg-violet-500/10 text-xl font-black italic text-violet-500 shadow-[0_0_25px_-5px_rgba(139,92,246,0.4)]">
        vs
      </span>
    </motion.div>
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
  const stateRef = useRef<RankedMatchState | null>(null);
  const roundNumberRef = useRef(0);

  const [showRoundResult, setShowRoundResult] = useState(false);
  const [prevHealth, setPrevHealth] = useState({ my: MAX_HEALTH, opponent: MAX_HEALTH });
  const [duelCountdown, setDuelCountdown] = useState(3);

  const [myProfile, setMyProfile] = useState<UserProfile | null>(null);
  const [myRanked, setMyRanked] = useState<RankedProfileData | null>(null);

  const opponentAnsweredNotified = useRef(false);

  const myName = myProfile?.displayName ?? myProfile?.username ?? "Você";
  const myAvatarUrl = myProfile?.avatarUrl ?? null;
  const myDivisionLabel = myRanked?.profile?.divisionLabel ?? null;
  const myRating = myRanked?.profile?.rating ?? null;

  useEffect(() => {
    (async () => {
      const [profile, ranked] = await Promise.allSettled([
        api<UserProfile>("/users/profile"),
        api<RankedProfileData>("/ranked/me"),
      ]);
      if (profile.status === "fulfilled") setMyProfile(profile.value);
      if (ranked.status === "fulfilled") setMyRanked(ranked.value);
    })();
  }, []);

  const handleMatchState = useCallback((next: RankedMatchState, fromFound = false) => {
    stateRef.current = next;
    setState((prev) => {
      if (
        prev &&
        prev.currentRound.roundNumber !== next.currentRound.roundNumber &&
        next.lastResult
      ) {
        setPrevHealth({ my: prev.match.myHealth, opponent: prev.match.opponentHealth });
        setShowRoundResult(true);
      } else if (!prev && next.match.status === "IN_PROGRESS") {
        playSound("roundStart");
      }
      return next;
    });

    setBusy(false);

    if (next.match.status === "FINISHED" || next.match.status === "ABANDONED") {
      setScreen("result");
      if (next.match.winnerId === next.me.id) playSound("win");
      else if (next.match.status === "FINISHED") playSound("lose");
      return;
    }

    if (fromFound) {
      roundNumberRef.current = next.currentRound.roundNumber;
      setScreen("found");
      setDuelCountdown(3);
      setShowRoundResult(false);
      playSound("found");
      return;
    }

    const isNewRound = roundNumberRef.current !== next.currentRound.roundNumber;
    roundNumberRef.current = next.currentRound.roundNumber;
    if (isNewRound) setGuess(null);
    setSecondsLeft(next.currentRound.timeRemainingSeconds);
    opponentAnsweredNotified.current = false;
    setScreen((prev) => (prev === "found" ? prev : "match"));
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
      setQueue(data);
      setScreen("queue");
    });

    socket.on("queue:canceled", () => {
      setQueue(null);
      setScreen("queue");
    });

    socket.on("queue:status", (data: { status: string; queueId?: string; rating?: number; expiresAt?: string; matchId?: string }) => {
      if (data.status === "queued" && data.queueId) {
        setQueue({ queueId: data.queueId, rating: data.rating ?? 0, expiresAt: data.expiresAt ?? "" });
        setScreen("queue");
      } else if (data.status === "matched" && data.matchId) {
        socket.emit("match:state", { matchId: data.matchId });
      } else if (data.status === "not_queued") {
        socket.emit("queue:join");
      }
    });

    socket.on("match:found", (payload: RankedMatchState) => handleMatchState(payload, true));
    socket.on("match:state", (payload: RankedMatchState) => handleMatchState(payload));
    socket.on("match:round", (payload: RankedMatchState) => handleMatchState(payload));
    socket.on("match:answered", (payload: RankedMatchState) => handleMatchState(payload));
    socket.on("match:finished", (payload: RankedMatchState) => handleMatchState(payload));

    socket.on("error", (data: { code?: number; message?: string }) => {
      toast(data.message ?? "Ocorreu um erro na partida.");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [handleMatchState]);

  useEffect(() => {
    if (screen !== "match") return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev == null || prev <= 0) return prev;
        const next = prev - 1;
        if (next <= 10 && next > 0) playSound("tick");
        if (next === 0) playSound("timeout");
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== "found") return;
    playSound("countdown");
    const timer = setTimeout(() => {
      if (duelCountdown <= 1) {
        const st = stateRef.current;
        setScreen("match");
        setShowRoundResult(false);
        setGuess(null);
        setSecondsLeft(st?.currentRound.timeRemainingSeconds ?? null);
        opponentAnsweredNotified.current = false;
        playSound("roundStart");
      } else {
        setDuelCountdown((prev) => prev - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [screen, duelCountdown]);

  useEffect(() => {
    if (state?.currentRound.opponentAnswered && !state.currentRound.myAnswered && !opponentAnsweredNotified.current) {
      opponentAnsweredNotified.current = true;
      playSound("opponent");
    }
  }, [state?.currentRound.opponentAnswered, state?.currentRound.myAnswered]);

  const joinQueue = () => {
    socketRef.current?.emit("queue:join");
    setScreen("queue");
  };

  const cancelQueue = () => {
    socketRef.current?.emit("queue:cancel");
    router.push("/lobby");
  };

  const continueFromRoundResult = useCallback(() => {
    setShowRoundResult(false);
    playSound("roundStart");
  }, []);

  const submitGuess = () => {
    const socket = socketRef.current;
    if (!socket || !state || !guess) return;
    playSound("confirm");
    setBusy(true);
    socket.emit("match:answer", {
      matchId: state.match.id,
      roundNumber: state.currentRound.roundNumber,
      guessLatitude: guess.latitude,
      guessLongitude: guess.longitude,
    });
    setGuess(null);
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

      {(screen === "queue" || screen === "found") ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-10 text-center">
          <div className="flex flex-col items-center gap-2">
            {screen === "found" ? (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-500"
              >
                <Trophy className="size-4" />
                Adversário encontrado!
              </motion.div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <Loader2 className="size-6 text-violet-500" />
                </motion.div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Procurando adversário...
                </h2>
              </div>
            )}
            {queue ? (
              <p className="text-sm text-muted-foreground">
                Pareando por rating similar · seu rating{" "}
                <span className="font-medium text-foreground">
                  {queue.rating.toLocaleString("pt-BR")}
                </span>
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {presence.playersOnline} online · {presence.playersInQueue} na fila
            </p>
          </div>

          <div className="grid w-full max-w-3xl items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
            <DuelCard
              name={myName}
              avatarUrl={myAvatarUrl}
              divisionLabel={myDivisionLabel}
              rating={myRating}
              accent
            />

            <VersusBadge />

            {screen === "found" && state ? (
              <DuelCard
                name={state.opponent.displayName ?? state.opponent.username}
                avatarUrl={state.opponent.avatarUrl}
                divisionLabel={state.opponent.divisionLabel}
                rating={state.opponent.rating}
              />
            ) : (
              <DuelCard searching />
            )}
          </div>

          {screen === "found" ? (
            <div className="flex items-center gap-3">
              <motion.span
                key={duelCountdown}
                initial={{ scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-6xl font-black tabular-nums text-violet-500"
              >
                {duelCountdown}
              </motion.span>
              <span className="text-sm text-muted-foreground">
                A partida começa em instantes...
              </span>
            </div>
          ) : (
            <Button variant="outline" className="rounded-full" onClick={cancelQueue}>
              <LogOut className="size-4 mr-2" />
              Sair da fila
            </Button>
          )}
        </div>
      ) : null}

      {screen === "match" && state ? (
        <div className="relative h-full w-full overflow-hidden bg-black">
          {showRoundResult && state.lastResult && (
            <RankedRoundResultScreen
              result={state.lastResult}
              myName={state.me.displayName ?? state.me.username}
              opponentName={state.opponent.displayName ?? state.opponent.username}
              myHealth={state.match.myHealth}
              opponentHealth={state.match.opponentHealth}
              myPrevHealth={prevHealth.my}
              opponentPrevHealth={prevHealth.opponent}
              maxHealth={MAX_HEALTH}
              onContinue={continueFromRoundResult}
            />
          )}

          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1001]">
            <div className={cn(
              "flex items-center gap-2 rounded-full border px-5 py-2.5 text-xl font-bold tabular-nums backdrop-blur-md shadow-lg transition-all",
              secondsLeft !== null && secondsLeft <= 10
                ? "border-red-500/50 bg-red-950/80 text-red-400 animate-pulse scale-110"
                : secondsLeft !== null && secondsLeft <= 30
                ? "border-orange-500/30 bg-orange-950/70 text-orange-400"
                : "border-white/20 bg-black/60 text-white"
            )}>
              <Timer className="size-5" />
              {formatTime(secondsLeft ?? 0)}
            </div>
          </div>

          <div className="absolute inset-x-0 top-0 z-[1001] flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b bg-background/90 px-4 py-2.5 backdrop-blur-sm">
            <HealthBar
              label={state.me.displayName ?? state.me.username}
              health={state.match.myHealth}
            />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Rodada {state.currentRound.roundNumber}
              </span>
              <span className="text-xs font-bold text-foreground">
                Multiplicador x{state.match.multiplier.toFixed(1)}
              </span>
            </div>
            <HealthBar
              label={state.opponent.displayName ?? state.opponent.username}
              health={state.match.opponentHealth}
              align="right"
            />
          </div>

          {opponentAnswered && !myAnswered ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute right-4 top-16 z-[1001] flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/80 px-4 py-2 text-xs font-semibold text-emerald-400 backdrop-blur-sm shadow-lg"
            >
              <Check className="size-3.5" />
              Adversário marcou o palpite
            </motion.div>
          ) : null}

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

          {last && !showRoundResult ? (
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
          <div className="flex flex-col items-center gap-6 mt-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex size-20 items-center justify-center rounded-full bg-muted border shadow-lg"
            >
              {resultWin === true ? (
                <Trophy className="size-10 text-amber-500" />
              ) : (
                <Swords className="size-10 text-muted-foreground" />
              )}
            </motion.div>

            {state.match.myRatingDelta != null && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "text-3xl font-black tabular-nums",
                  state.match.myRatingDelta >= 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {state.match.myRatingDelta >= 0 ? "+" : ""}{state.match.myRatingDelta} ELO
              </motion.div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full" onClick={leaveMatch}>
                <LogOut className="size-4 mr-2" />
                Sair da arena
              </Button>
            </div>
          </div>
        </GameResult>
      ) : null}
    </GameShell>
  );
}