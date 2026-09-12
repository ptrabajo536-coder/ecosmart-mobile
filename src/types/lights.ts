/**
 * Tipos de dominio — deben coincidir exactamente con el contrato que expone
 * el backend (ecosmart-web/src/types/lights.ts). Si el backend cambia la
 * forma de la respuesta, este archivo se actualiza junto con él.
 */

export type RelayState = "ON" | "OFF";
export type RelayAction = "ON" | "OFF";
export type DeviceMode = "simulation" | "real";

export interface Room {
  id: string;
  name: string;
}

export interface RoomsListResponse {
  success: true;
  rooms: (Room & { state: RelayState; updatedAt: string })[];
}

export interface LightUnit {
  id: number;
  name: string;
  state: RelayState;
  watts: number;
}

export interface HistoryEntry {
  id: string;
  action: RelayAction;
  timestamp: string;
  userEmail: string;
}

export interface LightsStatusResponse {
  success: true;
  mode: DeviceMode;
  relay: { state: RelayState };
  lights: {
    total: number;
    on: number;
    off: number;
    items: LightUnit[];
  };
  power: { watts: number };
  updatedAt: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export interface HistoryResponse {
  success: true;
  history: HistoryEntry[];
}
