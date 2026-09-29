import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import {
  useFonts,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
} from "@expo-google-fonts/ibm-plex-sans";
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from "@expo-google-fonts/ibm-plex-mono";
import { AuthProvider, useAuthContext } from "@/lib/AuthContext";
import { colors } from "@/theme";

const AUTH_ROUTES = ["login", "register", "forgot-password", "reset-password", "privacy-policy"];

/**
 * Protege las rutas por sesión, igual que src/proxy.ts en la web:
 * sin sesión -> manda a /login. Con sesión, no deja ver /login ni /register.
 */
function RouteGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = AUTH_ROUTES.includes(segments[0] ?? "");

    if (!session && !inAuthGroup) {
      router.replace("/login");
    } else if (session && inAuthGroup && segments[0] !== "reset-password") {
      router.replace("/");
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.on} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.on} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <RouteGuard>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        />
      </RouteGuard>
    </AuthProvider>
  );
}
