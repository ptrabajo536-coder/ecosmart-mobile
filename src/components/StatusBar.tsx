import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import type { DeviceMode } from "@/types/lights";
import { colors, fonts } from "@/theme";

interface StatusBarProps {
  roomName: string;
  mode: DeviceMode | null;
  connected: boolean;
  updatedAt: string | null;
  userEmail: string;
  onLogout: () => void;
}

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StatusBar({
  roomName,
  mode,
  connected,
  updatedAt,
  userEmail,
  onLogout,
}: StatusBarProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable onPress={() => router.push("/rooms")}>
          <Text style={styles.back}>‹ salones</Text>
        </Pressable>
        <Text style={styles.brand}>{roomName}</Text>
        <View
          style={[
            styles.dot,
            { backgroundColor: connected ? colors.on : colors.warn },
          ]}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.meta}>
          modo: {mode === "real" ? "dispositivo real" : "simulación"}
        </Text>
        <Text style={styles.meta}>· {formatTime(updatedAt)}</Text>
      </View>

      <View style={styles.userRow}>
        <Text style={styles.userEmail} numberOfLines={1}>
          {userEmail}
        </Text>
        <Pressable onPress={onLogout}>
          <Text style={styles.logout}>salir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 6,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  back: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  brand: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    color: colors.text,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginLeft: 4 },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  userEmail: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
    flexShrink: 1,
  },
  logout: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.primary,
    textDecorationLine: "underline",
  },
});
