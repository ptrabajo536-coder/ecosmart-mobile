import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/config/env";

/**
 * Cliente de Supabase para la app Android.
 *
 * A diferencia de la web (que guarda la sesión en cookies), React Native
 * la guarda en AsyncStorage — por eso se configura `storage` explícitamente.
 * Esta es la MISMA cuenta de Supabase que usa la web: un estudiante puede
 * registrarse desde el navegador o desde el celular indistintamente.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
