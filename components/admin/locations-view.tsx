"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Loader2, MapPin, MousePointerClick, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/lobby/section-heading";
import { LocationPickerMap } from "@/components/admin/location-picker-map";
import {
  createLocation,
  deleteLocation,
  fetchLocations,
  updateLocation,
} from "@/lib/admin";
import type { AdminLocation, LatLng } from "@/lib/api-types";

type EditorState =
  | { mode: "create" }
  | { mode: "edit"; location: AdminLocation }
  | null;

type LocationDraft = {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  file: File | null;
};

const EMPTY_DRAFT: LocationDraft = {
  name: "",
  description: "",
  latitude: "",
  longitude: "",
  file: null,
};

function draftFromLocation(location: AdminLocation): LocationDraft {
  return {
    name: location.name,
    description: location.description ?? "",
    latitude: location.latitude,
    longitude: location.longitude,
    file: null,
  };
}

export function LocationsView() {
  const [locations, setLocations] = useState<AdminLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorState>(null);
  const [draft, setDraft] = useState<LocationDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLocations(await fetchLocations());
    } catch {
      setError("Não foi possível carregar as localizações.");
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

  const openCreate = () => {
    setDraft(EMPTY_DRAFT);
    setEditor({ mode: "create" });
  };

  const openEdit = (location: AdminLocation) => {
    setDraft(draftFromLocation(location));
    setEditor({ mode: "edit", location });
  };

  const closeEditor = () => {
    setEditor(null);
    setDraft(EMPTY_DRAFT);
    if (fileRef.current) fileRef.current.value = "";
  };

  const buildFormData = (): FormData | null => {
    const name = draft.name.trim();
    const latitude = parseFloat(draft.latitude.replace(",", "."));
    const longitude = parseFloat(draft.longitude.replace(",", "."));
    if (!name) {
      toast.error("Dê um nome à localização.");
      return null;
    }
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      toast.error("Informe latitude e longitude válidas.");
      return null;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("description", draft.description.trim());
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));

    if (draft.file) {
      data.append("image", draft.file);
    } else if (editor?.mode === "create") {
      toast.error("A imagem do local é obrigatória.");
      return null;
    }
    return data;
  };

  const point = useMemo<LatLng | null>(() => {
    const latitude = parseFloat(draft.latitude.replace(",", "."));
    const longitude = parseFloat(draft.longitude.replace(",", "."));
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return { latitude, longitude };
  }, [draft.latitude, draft.longitude]);

  const handleMapSelect = (selected: LatLng) => {
    setDraft((prev) => ({
      ...prev,
      latitude: selected.latitude.toFixed(6),
      longitude: selected.longitude.toFixed(6),
    }));
  };

  const handleSave = async () => {
    const data = buildFormData();
    if (!data) return;
    try {
      setSaving(true);
      if (editor?.mode === "create") {
        await createLocation(data);
        toast.success("Localização adicionada.");
      } else if (editor?.mode === "edit") {
        await updateLocation(editor.location.id, data);
        toast.success("Localização atualizada.");
      }
      closeEditor();
      await load();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar localização."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (location: AdminLocation) => {
    setDeletingId(location.id);
    try {
      await deleteLocation(location.id);
      toast.success("Localização removida.");
      await load();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao remover localização."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const currentImagePreview = editor
    ? editor.mode === "edit" && !draft.file
      ? editor.location.imageUrl
      : draft.file
        ? URL.createObjectURL(draft.file)
        : null
    : null;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Administração"
        title="Localizações"
        description="Adicione, edite ou remova os pontos do campus usados nas partidas. Cada local precisa de uma imagem."
        action={
          editor ? null : (
            <Button className="rounded-full" onClick={openCreate}>
              <Plus />
              Nova localização
            </Button>
          )
        }
      />

      {editor ? (
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight">
                {editor.mode === "create"
                  ? "Nova localização"
                  : `Editar · ${editor.location.name}`}
              </h3>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={closeEditor}
                aria-label="Fechar editor"
              >
                <X />
              </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="location-name">Nome</Label>
                  <Input
                    id="location-name"
                    value={draft.name}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ex.: Biblioteca Central"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="location-description">Descrição</Label>
                  <textarea
                    id="location-description"
                    value={draft.description}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Uma pista opcional sobre o local"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 md:text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Imagem</Label>
                  <label className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30">
                    <ImagePlus className="size-4" />
                    <span className="min-w-0 flex-1 truncate">
                      {draft.file
                        ? draft.file.name
                        : editor.mode === "create"
                          ? "Selecionar imagem (obrigatória)"
                          : "Trocar imagem (opcional)"}
                    </span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          file: e.target.files?.[0] ?? null,
                        }))
                      }
                    />
                  </label>
                  {currentImagePreview ? (
                    <img
                      src={currentImagePreview}
                      alt="Prévia"
                      className="mt-1 h-20 w-full rounded-lg object-cover"
                    />
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="location-lat">Latitude</Label>
                    <Input
                      id="location-lat"
                      value={draft.latitude}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                      placeholder="Ex.: -23.4098"
                      inputMode="decimal"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="location-lng">Longitude</Label>
                    <Input
                      id="location-lng"
                      value={draft.longitude}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      placeholder="Ex.: -51.9388"
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div className="flex items-end pt-1">
                  <Button
                    className="w-full rounded-full sm:w-auto"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="animate-spin" /> : <Plus />}
                    {saving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <LocationPickerMap
                  point={point}
                  onSelect={handleMapSelect}
                  className="h-80 rounded-2xl lg:h-[26rem]"
                />
                <p className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
                  <MousePointerClick className="size-3.5 shrink-0" />
                  Clique no mapa para marcar o local exato — os campos de
                  latitude e longitude são preenchidos automaticamente.
                </p>
              </div>
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
        ) : error && locations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" className="rounded-full" onClick={load}>
              Tentar novamente
            </Button>
          </div>
        ) : locations.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma localização cadastrada ainda. Adicione a primeira.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border/60">
            {locations.map((location) => (
              <li key={location.id} className="flex items-center gap-4 py-4">
                {location.imageUrl ? (
                  <Image
                    src={location.imageUrl}
                    alt={location.name}
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                    <MapPin className="size-5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{location.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {location.latitude}, {location.longitude}
                    {location.description ? ` · ${location.description}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEdit(location)}
                    aria-label={`Editar ${location.name}`}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(location)}
                    disabled={deletingId === location.id}
                    aria-label={`Remover ${location.name}`}
                  >
                    {deletingId === location.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}