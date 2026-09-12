import { useCallback, useEffect, useState } from "react";
import * as Linking from "expo-linking";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface UseAuthResult {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  resetPassword: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
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

  useEffect(() => {
    async function loadSession() {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) await handleAuthUrl(initialUrl);

      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    }

    loadSession();

    const linkingSubscription = Linking.addEventListener("url", ({ url }) => {
      void handleAuthUrl(url);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
      linkingSubscription.remove();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error ? "Correo o contraseña incorrectos." : null;
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
    async (email: string, password: string, name: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name || null } },
      });
      return error ? error.message : null;
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    session,
    loading,
    signIn,
    resetPassword,
    updatePassword,
    signUp,
    signOut,
  };
}
