import type { Metadata } from "next";
import { LobbyShell } from "@/components/lobby/lobby-shell";
import { LobbyDataProvider } from "@/lib/lobby-data";

export const metadata: Metadata = {
  title: "Lobby | UEMGuessr",
  description: "Seu ponto de partida no campus: modos de jogo, ranking e perfil.",
};

export default function LobbyLayout({ children }: { children: React.ReactNode }) {
  return (
    <LobbyDataProvider>
      <LobbyShell>{children}</LobbyShell>
    </LobbyDataProvider>
  );
}