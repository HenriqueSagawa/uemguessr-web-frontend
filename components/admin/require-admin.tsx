"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/session";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, isAuthed, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthed) {
      router.replace("/login");
    } else if (user?.role !== "ADMIN") {
      router.replace("/lobby");
    }
  }, [loading, isAuthed, user, router]);

  if (loading || !isAuthed || user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}