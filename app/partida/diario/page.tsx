import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { DailyGame } from "@/components/game/daily-game";

export const metadata: Metadata = {
  title: "Desafio Diário | UEMGuessr",
};

export default function DailyGamePage() {
  return (
    <RequireAuth>
      <DailyGame />
    </RequireAuth>
  );
}