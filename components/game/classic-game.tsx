"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Gauge, Loader2, MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameShell } from "@/components/game/game-shell";
import { PanoViewer } from "@/components/game/pano-viewer";
import { GuessMinimap } from "@/components/game/guess-minimap";
import { RoundResultView } from "@/components/game/round-result-view";
import { GameResult } from "@/components/game/game-result";
import { api, ApiError } from "@/lib/api";
import type {
  GameCreateData,
  GameData,
  LatLng,
  NextRoundData,
  RoundResultData,
} from "@/lib/api-types";
import { formatDistance, formatScore } from "@/lib/format";
import { toast } from "sonner";

type Phase = "loading" | "guess" | "roundResult" | "result" | "error";

const TOTAL_ROUNDS = 5;

export function ClassicGame() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [round, setRound] = useState<NextRoundData | null>(null);
  const [guess, setGuess] = useState<LatLng | null>(null);
  const [lastRound, setLastRound] = useState<RoundResultData["round"] | null>(null);
  const [game, setGame] = useState<RoundResultData["game"] | null>(null);
  const [summary, setSummary] = useState<GameData | null>(null);
  const [busy, setBusy] = useState(false);
  const gameIdRef = useRef<string | null>(null);
  const locationIdRef = useRef<string | null>(null);

  const loadCurrentRound = useCallback(async (gameId: string) => {
    const current = await api<NextRoundData>(`/games/${gameId}/next-round`);
    setRound(current);
    locationIdRef.current = current.location.id;
    setPhase("guess");
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const created = await api<GameCreateData>("/games", { method: "POST" });
        if (!active) return;
        gameIdRef.current = created.id;
        await loadCurrentRound(created.id);
      } catch (err) {
        if (!active) return;
        setPhase("error");
        toast(err instanceof ApiError ? err.message : "Não foi possível iniciar a partida.");
      }
    })();
    return () => {
      active = false;
    };
  }, [loadCurrentRound]);

  const submitGuess = async () => {
    if (!gameIdRef.current || !guess) return;
    setBusy(true);
    try {
      const result = await api<RoundResultData>(`/games/${gameIdRef.current}/rounds`, {
        method: "POST",
        body: JSON.stringify({
          locationId: locationIdRef.current,
          guessLatitude: guess.latitude,
          guessLongitude: guess.longitude,
        }),
      });
      setLastRound(result.round);
      setGame(result.game);
      setGuess(null);
      setPhase("roundResult");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Falha ao enviar o palpite.");
    } finally {
      setBusy(false);
    }
  };

  const nextRound = async () => {
    if (!gameIdRef.current) return;
    setPhase("loading");
    setLastRound(null);
    try {
      const finished = game?.finishedAt != null;
      if (finished) {
        const detail = await api<GameData>(`/games/${gameIdRef.current}`).catch(
          () => null
        );
        setSummary(detail);
        setPhase("result");
        return;
      }
      await loadCurrentRound(gameIdRef.current);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Falha ao carregar a próxima rodada.");
      setPhase("guess");
    }
  };

  const replay = () => {
    setPhase("loading");
    setGuess(null);
    setLastRound(null);
    setSummary(null);
    setGame(null);
    void (async () => {
      try {
        const created = await api<GameCreateData>("/games", { method: "POST" });
        gameIdRef.current = created.id;
        await loadCurrentRound(created.id);
      } catch (err) {
        setPhase("error");
        toast(err instanceof ApiError ? err.message : "Não foi possível iniciar a partida.");
      }
    })();
  };

  const retry = () => {
    setPhase("loading");
    void (async () => {
      try {
        const created = await api<GameCreateData>("/games", { method: "POST" });
        gameIdRef.current = created.id;
        await loadCurrentRound(created.id);
      } catch (err) {
        setPhase("error");
        toast(err instanceof ApiError ? err.message : "Não foi possível iniciar a partida.");
      }
    })();
  };

  if (phase === "error") {
    return (
      <GameShell title="Partida clássica">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
          <p className="text-lg font-semibold tracking-tight">
            Não foi possível iniciar a partida.
          </p>
          <Button className="rounded-full" onClick={retry}>
            Tentar novamente
          </Button>
          <Button
            variant="ghost"
            className="rounded-full text-muted-foreground"
            onClick={() => router.push("/lobby")}
          >
            Voltar ao lobby
          </Button>
        </div>
      </GameShell>
    );
  }

  if (phase === "loading") {
    return (
      <GameShell title="Partida clássica" fullBleed>
        <div className="flex flex-1 items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-sm font-medium">Carregando campus...</span>
        </div>
      </GameShell>
    );
  }

  if (phase === "roundResult" && lastRound) {
    return (
      <GameShell title="Partida clássica" fullBleed>
        <div className="h-full w-full p-4">
          <RoundResultView
            roundNumber={lastRound.roundNumber}
            totalRounds={TOTAL_ROUNDS}
            roundScore={lastRound.score}
            gameScore={game?.score ?? 0}
            distanceMeters={lastRound.distanceMeters}
            guess={lastRound.guess}
            correct={lastRound.correct}
            isLast={game != null && game.roundsPlayed >= game.totalRounds}
            onNext={nextRound}
          />
        </div>
      </GameShell>
    );
  }

  if (phase === "result" && game) {
    const stats = [];
    const avg = summary
      ? summary.rounds.reduce((acc, r) => acc + Number(r.distanceMeters), 0) /
        Math.max(summary.rounds.length, 1)
      : null;
    const best = summary
      ? summary.rounds.reduce((acc, r) => (r.score > acc ? r.score : acc), 0)
      : null;
    if (summary && summary.rounds.length > 0) {
      stats.push({
        icon: MapPin,
        label: "Rodadas",
        value: `${summary.rounds.length}/${TOTAL_ROUNDS}`,
      });
    }
    if (avg != null) {
      stats.push({ icon: Gauge, label: "Distância média", value: formatDistance(avg) });
    }
    if (best != null) {
      stats.push({ icon: Trophy, label: "Melhor rodada", value: formatScore(best) });
    }
    return (
      <GameShell title="Partida clássica">
        <GameResult
          title="Partida concluída"
          subtitle="Você mapeou mais um pedaço do campus de cor."
          score={game.score}
          stats={stats}
          onReplay={replay}
        />
      </GameShell>
    );
  }

  return (
    <GameShell title="Partida clássica" fullBleed>
      <div className="relative h-full w-full overflow-hidden rounded-none bg-black">
        {round?.location.imageUrl ? (
          <PanoViewer imageUrl={round.location.imageUrl} alt="Lugar a ser adivinhado" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
          <span className="w-fit rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm">
            Rodada {round?.roundNumber} de {round?.totalRounds}
          </span>
          <span className="w-fit rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium tabular-nums shadow-sm backdrop-blur-sm">
            Placar: {formatScore(game?.score ?? 0)} pts
          </span>
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
          disabled={phase !== "guess"}
        />
      </div>
    </GameShell>
  );
}