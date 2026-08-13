"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/session";

export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { isAuthed, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthed) {
      router.replace("/lobby");
    }
  }, [loading, isAuthed, router]);

  if (loading || isAuthed) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Indo para o lobby...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}