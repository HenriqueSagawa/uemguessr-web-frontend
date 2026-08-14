"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";

export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { isAuthed, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthed) {
      router.replace("/lobby");
    }
  }, [loading, isAuthed, router]);

  if (isAuthed) {
    return null;
  }

  return <>{children}</>;
}