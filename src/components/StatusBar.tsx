import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import type { DeviceMode } from "@/types/lights";
import { colors, fonts } from "@/theme";

interface StatusBarProps {
  roomName: string;
  mode: DeviceMode | null;
  connected: boolean;
  updatedAt: string | null;
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
  onLogout,
}: StatusBarProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.push("/rooms")}
            style={({ pressed }) => [styles.headerButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.back}>‹ salones</Text>
          </Pressable>

          <Pressable
            onPress={onLogout}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.logout}>Salir</Text>
          </Pressable>
        </View>

        <View style={styles.brandRow}>
          <View>
            <Text style={styles.label}>SALÓN</Text>
            <Text style={styles.brand}>{roomName}</Text>
          </View>

          <View style={[styles.statusPill, connected ? styles.statusPillOn : styles.statusPillOff]}>
            <View style={[styles.dot, connected ? styles.dotOn : styles.dotOff]} />
            <Text style={[styles.statusText, connected ? styles.statusTextOn : styles.statusTextOff]}>
              {connected ? "Conectado" : "Sin conexión"}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Modo</Text>
            <Text style={styles.metaValue}>{mode === "real" ? "Dispositivo real" : "Simulación"}</Text>
          </View>

          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Última actualización</Text>
            <Text style={styles.metaValue}>{formatTime(updatedAt)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headerButton: {
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: { opacity: 0.75, transform: [{ scale: 0.97 }] },
  back: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.surface,
  },
  logout: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.text,
  },
  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  brand: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 24,
    color: colors.text,
    marginTop: 4,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillOn: {
    backgroundColor: "rgba(45, 180, 100, 0.12)",
    borderColor: "rgba(45, 180, 100, 0.35)",
  },
  statusPillOff: {
    backgroundColor: "rgba(255, 181, 72, 0.12)",
    borderColor: "rgba(255, 181, 72, 0.35)",
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotOn: { backgroundColor: colors.on },
  dotOff: { backgroundColor: colors.warn },
  statusText: { fontFamily: fonts.monoMedium, fontSize: 10 },
  statusTextOn: { color: colors.on },
  statusTextOff: { color: colors.warn },
  metaRow: {
    flexDirection: "row",
    gap: 10,
  },
  metaBox: {
    flex: 1,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  metaLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metaValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.text,
    marginTop: 4,
  },
});
