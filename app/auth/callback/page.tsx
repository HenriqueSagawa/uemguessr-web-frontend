"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api, setAccessToken } from "@/lib/api";
import type { PublicUser } from "@/lib/api-types";
import { useSession } from "@/lib/session";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { completeAuth } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      await Promise.resolve();
      const params = new URLSearchParams(window.location.hash.slice(1));
      const token = params.get("accessToken");

      if (!token) {
        if (active) setError("O login do Google não foi concluído.");
        return;
      }

      setAccessToken(token);
      try {
        const me = await api<PublicUser>("/auth/me");
        if (!active) return;
        completeAuth(me);
        router.replace("/lobby");
      } catch {
        setAccessToken(null);
        if (active) setError("Não foi possível concluir o login do Google.");
      }
    })();
    return () => {
      active = false;
    };
  }, [completeAuth, router]);

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-3 bg-background p-6 text-center">
      {error ? (
        <>
          <p className="text-sm font-medium text-destructive">{error}</p>
          <button
            onClick={() => router.replace("/login")}
            className="no-underline text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            Voltar para o login
          </button>
        </>
      ) : (
        <>
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Entrando com o Google...
          </p>
        </>
      )}
    </div>
  );
}