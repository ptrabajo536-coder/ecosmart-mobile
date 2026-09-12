/**
 * URL base del backend ECOsmart (el mismo backend que usa la app web).
 *
 * NO se debe repartir esta URL escrita a mano por todo el código — todo
 * pasa por API_BASE_URL, definida aquí a partir de una sola variable de
 * entorno pública de Expo.
 *
 * Por qué es una variable de entorno y no un valor fijo:
 *   - En desarrollo, tu teléfono Android NO puede usar "localhost" para
 *     llegar al Next.js que corre en tu computador — "localhost" en el
 *     teléfono se refiere al teléfono mismo. Debes usar la IP local de tu
 *     computador en la misma red WiFi (ej: http://192.168.1.8:3000/api).
 *     Verás esa IP en la terminal cuando corras "npm run dev" en el proyecto
 *     web (aparece como "Network: http://192.168.1.8:3000").
 *   - En producción, apunta al dominio de Vercel.
 *
 * Cómo se configura (ver .env.example):
 *   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.8:3000/api
 *
 * Expo expone al bundle cualquier variable que empiece con EXPO_PUBLIC_ —
 * es la forma oficial de manejar configuración pública (no secreta) en
 * apps Expo, equivalente a NEXT_PUBLIC_ en Next.js.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api";

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
