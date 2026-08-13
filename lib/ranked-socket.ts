import { io, type Socket } from "socket.io-client";
import { API_URL, getAccessToken } from "@/lib/api";

export type RankedSocket = Socket;

export function createRankedSocket(): RankedSocket {
  return io(`${API_URL}/ranked`, {
    path: "/socket.io",
    transports: ["websocket"],
    auth: { token: getAccessToken() },
  });
}