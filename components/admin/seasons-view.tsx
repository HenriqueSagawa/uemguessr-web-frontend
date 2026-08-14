"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarRange, Loader2, Plus, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/lobby/section-heading";
import { createSeason, endCurrentSeason, fetchSeasons } from "@/lib/admin";
import type { AdminSeason, SeasonStatus } from "@/lib/api-types";

const STATUS_LABEL: Record<SeasonStatus, { label: string; active: boolean }> = {
  PREVIEW: { label: "Prévia", active: false },
  ACTIVE: { label: "Ativa", active: true },
  ENDED: { label: "Encerrada", active: false },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function SeasonsView() {
  const [seasons, setSeasons] = useState<AdminSeason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [ending, setEnding] = useState(false);

  const activeSeason = seasons.find((season) => season.status === "ACTIVE");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSeasons(await fetchSeasons());
    } catch {
      setError("Não foi possível carregar as temporadas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await Promise.resolve();
      await load();
    })();
  }, [load]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const season = await createSeason({ name: name.trim() || undefined });
      toast.success(`Temporada "${season.name}" criada e ativada.`);
      setShowCreate(false);
      setName("");
      await load();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao criar temporada."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEnd = async () => {
    setEnding(true);
    try {
      await endCurrentSeason();
      toast.success("Temporada atual encerrada.");
      await load();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao encerrar temporada."
      );
    } finally {
      setEnding(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Administração"
        title="Temporadas"
        description="Gerencie as temporadas do ranking ranqueado. Criar uma temporada encerra a anterior."
        action={
          <div className="flex items-center gap-2">
            {activeSeason ? (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={handleEnd}
                disabled={ending}
              >
                {ending ? <Loader2 className="animate-spin" /> : <Square />}
                {ending ? "Encerrando..." : "Encerrar atual"}
              </Button>
            ) : null}
            {!showCreate ? (
              <Button className="rounded-full" onClick={() => setShowCreate(true)}>
                <Plus />
                Nova temporada
              </Button>
            ) : null}
          </div>
        }
      />

      {showCreate ? (
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight">
                Nova temporada
              </h3>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowCreate(false)}
                aria-label="Fechar editor"
              >
                <X />
              </Button>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="season-name">Nome</Label>
              <Input
                id="season-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Temporada 2026"
                maxLength={80}
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para usar um nome automático. A temporada é
                criada como ativa e com início imediato.
              </p>
            </div>
            <div>
              <Button
                className="rounded-full"
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? <Loader2 className="animate-spin" /> : <Plus />}
                {saving ? "Criando..." : "Criar temporada"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="rounded-3xl border bg-card p-4 sm:p-6">
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : error && seasons.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" className="rounded-full" onClick={load}>
              Tentar novamente
            </Button>
          </div>
        ) : seasons.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma temporada criada ainda. Crie a primeira para começar.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border/60">
            {seasons.map((season) => {
              const status = STATUS_LABEL[season.status];
              return (
                <li key={season.id} className="flex items-center gap-4 py-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                    <CalendarRange className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {season.name}
                      </p>
                      {status.active ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          {status.label}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{status.label}</Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Início em {formatDate(season.startsAt)}
                      {season.endsAt
                        ? ` · encerrada em ${formatDate(season.endsAt)}`
                        : ""}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}