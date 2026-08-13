import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { RankedGame } from "@/components/game/ranked-game";

export const metadata: Metadata = {
  title: "Ranqueado | UEMGuessr",
};

export default function RankedGamePage() {
  return (
    <RequireAuth>
      <RankedGame />
    </RequireAuth>
  );
}