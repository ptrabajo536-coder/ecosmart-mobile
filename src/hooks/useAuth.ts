import { useCallback, useEffect, useState } from "react";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type UserRole = "student" | "teacher";

interface UseAuthResult {
  session: Session | null;
  loading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string, role: UserRole) => Promise<string | null>;
  resetPassword: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const ROLE_KEY = "ecosmart-user-role";
const ADMIN_EMAIL = "josesclashflorez2@gmail.com";

function isAllowedTeacherEmail(email: string) {
  const normalized = email.trim().toLowerCase();

  if (!normalized) return false;
  if (normalized === ADMIN_EMAIL) return true;

  return /(maestro|maestra)/i.test(normalized);
}

async function readStoredRole(): Promise<UserRole | null> {
  const stored = await AsyncStorage.getItem(ROLE_KEY);
  return stored === "student" || stored === "teacher" ? stored : null;
}

async function persistRole(role: UserRole) {
  await AsyncStorage.setItem(ROLE_KEY, role);
}

async function handleAuthUrl(url: string) {
  const parsedUrl = new URL(url);
  const params = new URLSearchParams(
    parsedUrl.hash.startsWith("#")
      ? parsedUrl.hash.slice(1)
      : parsedUrl.search
  );
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (accessToken && refreshToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }
}

export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const applyRoleFromSession = useCallback(async (nextSession: Session | null) => {
    const sessionRole = nextSession?.user?.user_metadata?.role;
    const resolvedRole =
      sessionRole === "student" || sessionRole === "teacher"
        ? sessionRole
        : await readStoredRole();

    if (resolvedRole) {
      setUserRole(resolvedRole);
      await persistRole(resolvedRole);
      return;
    }

    setUserRole(null);
    await AsyncStorage.removeItem(ROLE_KEY);
  }, []);

  useEffect(() => {
    async function loadSession() {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) await handleAuthUrl(initialUrl);

      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      await applyRoleFromSession(data.session);
      setLoading(false);
    }

    loadSession();

    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      void handleAuthUrl(url);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        await applyRoleFromSession(newSession);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, [applyRoleFromSession]);

  const signIn = useCallback(async (email: string, password: string, role: UserRole) => {
    if (!isAllowedTeacherEmail(email)) {
      return "Solo se permiten correos de profesor. Contacta al administrador.";
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return "Correo o contraseña incorrectos.";

    await persistRole(role);
    setUserRole(role);
    return null;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const redirectTo = Linking.createURL("reset-password");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    return error ? error.message : null;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return error ? error.message : null;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name: string, role: UserRole) => {
      if (!isAllowedTeacherEmail(email)) {
        return "Solo pueden registrarse correos de profesor. La única excepción es el administrador.";
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || null,
            role,
          },
        },
      });

      if (error) return error.message;

      await persistRole(role);
      setUserRole(role);
      return null;
    },
    []
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(ROLE_KEY);
    setUserRole(null);
    await supabase.auth.signOut();
  }, []);

  return {
    session,
    loading,
    userRole,
    signIn,
    resetPassword,
    updatePassword,
    signUp,
    signOut,
  };
}
