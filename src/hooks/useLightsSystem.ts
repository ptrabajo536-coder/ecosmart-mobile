import { useCallback, useEffect, useState } from "react";
import { apiGet, apiPost, isErrorResponse } from "@/lib/api";
import type {
  HistoryEntry,
  HistoryResponse,
  LightsStatusResponse,
  RelayAction,
} from "@/types/lights";

type ConnectionState = "connecting" | "connected" | "disconnected";
type CommandState = "idle" | "sending" | "error";

interface UseLightsSystemResult {
  status: LightsStatusResponse | null;
  history: HistoryEntry[];
  connection: ConnectionState;
  command: CommandState;
  message: string | null;
  refresh: () => Promise<void>;
  sendAction: (action: RelayAction) => Promise<void>;
}

/** Controla el panel de UN salón específico, identificado por roomId. */
export function useLightsSystem(roomId: string): UseLightsSystemResult {
  const [status, setStatus] = useState<LightsStatusResponse | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [command, setCommand] = useState<CommandState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const refreshHistory = useCallback(async () => {
    const body = await apiGet<HistoryResponse>(`/rooms/${roomId}/history`);
    if (!isErrorResponse(body)) setHistory(body.history);
  }, [roomId]);

  const refreshStatus = useCallback(async () => {
    const body = await apiGet<LightsStatusResponse>(`/rooms/${roomId}/lights`);
    if (isErrorResponse(body)) {
      setConnection("disconnected");
      setMessage(body.error);
      return;
    }
    setStatus(body);
    setConnection("connected");
  }, [roomId]);

  const refresh = useCallback(async () => {
    await Promise.all([refreshStatus(), refreshHistory()]);
  }, [refreshStatus, refreshHistory]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial al montar
    refresh();
  }, [refresh]);

  const sendAction = useCallback(
    async (action: RelayAction) => {
      setCommand("sending");
      setMessage(action === "ON" ? "Encendiendo luces..." : "Apagando luces...");

      const body = await apiPost<LightsStatusResponse>(`/rooms/${roomId}/lights`, { action });

      if (isErrorResponse(body)) {
        setCommand("error");
        setConnection("disconnected");
        setMessage(body.error);
        return;
      }

      setStatus(body);
      setConnection("connected");
      setCommand("idle");
      setMessage(
        action === "ON"
          ? "Luces encendidas correctamente."
          : "Luces apagadas correctamente."
      );
      refreshHistory();
    },
    [roomId, refreshHistory]
  );

  return { status, history, connection, command, message, refresh, sendAction };
}
