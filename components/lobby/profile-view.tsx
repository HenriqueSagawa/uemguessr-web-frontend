"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Loader2, Trash2, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, ApiError } from "@/lib/api";
import type { UserProfile } from "@/lib/api-types";
import { useSession } from "@/lib/session";
import { useLobbyData } from "@/lib/lobby-data";
import { divisionProgress, initialsOf } from "@/lib/ranked";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/lobby/section-heading";

type ProfileFormState = {
  username: string;
  displayName: string;
  bio: string;
  themeColor: string;
};

function formFrom(profile: UserProfile | null): ProfileFormState {
  return {
    username: profile?.username ?? "",
    displayName: profile?.displayName ?? "",
    bio: profile?.bio ?? "",
    themeColor: profile?.themeColor ?? "#7C3AED",
  };
}

function ProfileForm({
  profile,
  onSaved,
}: {
  profile: UserProfile | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProfileFormState>(() => formFrom(profile));
  const [saving, setSaving] = useState(false);

  const update =
    (field: keyof ProfileFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api("/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          username: form.username,
          displayName: form.displayName || "",
          bio: form.bio || "",
          themeColor: form.themeColor || "",
        }),
      });
      toast("Perfil salvo.");
      onSaved();
    } catch (err) {
      toast(
        err instanceof ApiError ? err.message : "Não foi possível salvar o perfil."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-3xl border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-username" className="text-[13px]">
            Apelido
          </Label>
          <Input
            id="profile-username"
            value={form.username}
            onChange={update("username")}
            className="h-11 rounded-xl px-3.5"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-display" className="text-[13px]">
            Nome de exibição
          </Label>
          <Input
            id="profile-display"
            maxLength={50}
            value={form.displayName}
            onChange={update("displayName")}
            className="h-11 rounded-xl px-3.5"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="profile-bio" className="text-[13px]">
            Bio
          </Label>
          <Input
            id="profile-bio"
            maxLength={280}
            placeholder="Explorador do campus..."
            value={form.bio}
            onChange={update("bio")}
            className="h-11 rounded-xl px-3.5"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="profile-email" className="text-[13px]">
            Email (não editável)
          </Label>
          <Input
            id="profile-email"
            type="email"
            readOnly
            value={profile?.email ?? ""}
            className="h-11 rounded-xl px-3.5 opacity-70"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-color" className="text-[13px]">
            Cor do tema
          </Label>
          <div className="flex h-11 items-center gap-3 rounded-xl border bg-background px-3.5">
            <input
              id="profile-color"
              type="color"
              value={form.themeColor}
              onChange={update("themeColor")}
              className="size-6 cursor-pointer rounded-md border-none bg-transparent p-0"
            />
            <span className="font-mono text-sm text-muted-foreground">
              {form.themeColor}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-3">
        <Button type="submit" disabled={saving} className="rounded-full sm:w-auto">
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}

export function ProfileView() {
  const { user } = useSession();
  const { profile, ranked, refresh } = useLobbyData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const displayName = profile?.displayName || user?.username || "Você";
  const avatarUrl = profile?.avatarUrl ?? user?.avatarUrl;
  const rating = ranked?.profile?.rating;
  const division = rating != null ? divisionProgress(rating) : null;

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("avatar", file);
      await api("/users/profile/avatar", { method: "PUT", body });
      toast("Avatar atualizado.");
      refresh();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Falha ao enviar o avatar.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleAvatarRemove = async () => {
    try {
      await api("/users/profile/avatar", { method: "DELETE" });
      toast("Avatar removido.");
      refresh();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Falha ao remover o avatar.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Perfil"
        title="Seu crachá de explorador"
        description="É assim que o campus te reconhece antes de cada partida."
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="flex flex-col items-center gap-5 rounded-3xl border bg-card p-8 text-center">
          <div className="relative">
            <div className="rounded-full bg-linear-to-br from-blue-500/20 to-violet-500/20 p-1.5">
              <Avatar className="size-24">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
                <AvatarFallback
                  className={cn(
                    "bg-gradient-to-br text-2xl font-semibold text-white",
                    "from-blue-500 to-violet-600"
                  )}
                >
                  {initialsOf(displayName)}
                </AvatarFallback>
              </Avatar>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Alterar avatar"
              className="absolute -right-1 -bottom-1 grid size-8 cursor-pointer place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Camera className="size-3.5" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold tracking-tight">{displayName}</p>
            <p className="text-sm text-muted-foreground">
              @{profile?.username ?? user?.username}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            {division ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Trophy className="size-3.5" />
                {division.current}
              </span>
            ) : null}
            <span className="text-xs text-muted-foreground">
              {profile
                ? `Membro desde ${new Date(profile.createdAt).getFullYear()}`
                : "Membro do campus"}
            </span>
            {avatarUrl ? (
              <button
                type="button"
                onClick={handleAvatarRemove}
                className="inline-flex cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="size-3" />
                Remover avatar
              </button>
            ) : null}
          </div>
        </aside>

        <ProfileForm
          key={profile?.id ?? "empty"}
          profile={profile}
          onSaved={refresh}
        />
      </div>
    </div>
  );
}