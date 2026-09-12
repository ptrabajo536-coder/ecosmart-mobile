import { API_BASE_URL } from "@/config/env";
import { supabase } from "@/lib/supabase";
import type { ApiErrorResponse } from "@/types/lights";

/**
 * Toda la comunicación con el backend pasa por aquí. NO se implementa
 * ninguna lógica del Sonoff dentro de la app Android — solo se llama a la
 * misma API que usa la web (GET/POST /lights, GET /history), adjuntando el
 * token de sesión de Supabase para que el backend sepa quién es el usuario.
 */
async function authorizedFetch(path: string, init?: RequestInit) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  return fetch(`${API_BASE_URL}${path}`, { ...init, headers });
}

export function isErrorResponse(body: unknown): body is ApiErrorResponse {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    (body as { success: unknown }).success === false
  );
}

export async function apiGet<T>(path: string): Promise<T | ApiErrorResponse> {
  try {
    const res = await authorizedFetch(path, { method: "GET" });
    return (await res.json()) as T | ApiErrorResponse;
  } catch {
    return {
      success: false,
      error: "No fue posible comunicarse con el servidor.",
    };
  }
}

export async function apiPost<T>(
  path: string,
  body: unknown
): Promise<T | ApiErrorResponse> {
  try {
    const res = await authorizedFetch(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return (await res.json()) as T | ApiErrorResponse;
  } catch {
    return {
      success: false,
      error: "No fue posible comunicarse con el servidor.",
    };
  }
}
