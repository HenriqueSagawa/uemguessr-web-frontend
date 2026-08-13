import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { ClassicGame } from "@/components/game/classic-game";

export const metadata: Metadata = {
  title: "Partida Clássica | UEMGuessr",
};

export default function ClassicGamePage() {
  return (
    <RequireAuth>
      <ClassicGame />
    </RequireAuth>
  );
}