import { api } from "@/lib/api";
import type {
  AdminLocation,
  AdminSeason,
  AdminSeasonCreateInput,
} from "@/lib/api-types";

// ---------- Temporadas (ranked) ----------
// GET  /ranked/seasons
// POST /ranked/seasons
// POST /ranked/seasons/current/end
// O backend não expõe edição (PATCH) nem exclusão (DELETE) de temporadas.

export async function fetchSeasons(): Promise<AdminSeason[]> {
  return api<AdminSeason[]>("/ranked/seasons");
}

export async function createSeason(
  input: AdminSeasonCreateInput
): Promise<AdminSeason> {
  return api<AdminSeason>("/ranked/seasons", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function endCurrentSeason(): Promise<{
  id: string;
  name: string;
  status: string;
  endsAt: string;
}> {
  return api("/ranked/seasons/current/end", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

// ---------- Localizações ----------
// GET    /locations?page=&limit=  (paginado)
// POST   /locations               (multipart/form-data; imagem "image" obrigatória)
// PATCH  /locations/:id           (multipart/form-data; imagem opcional)
// DELETE /locations/:id

export async function fetchLocations(): Promise<AdminLocation[]> {
  return api<AdminLocation[]>("/locations?limit=100");
}

export async function createLocation(
  input: FormData
): Promise<AdminLocation> {
  return api<AdminLocation>("/locations", {
    method: "POST",
    body: input,
  });
}

export async function updateLocation(
  id: string,
  input: FormData
): Promise<AdminLocation> {
  return api<AdminLocation>(`/locations/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export async function deleteLocation(id: string): Promise<void> {
  await api<void>(`/locations/${id}`, { method: "DELETE" });
}