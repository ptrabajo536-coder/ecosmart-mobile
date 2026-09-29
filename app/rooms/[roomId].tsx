import { ScrollView, RefreshControl, StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthContext } from "@/lib/AuthContext";
import { useLightsSystem } from "@/hooks/useLightsSystem";
import { StatusBar } from "@/components/StatusBar";
import { PowerPanel } from "@/components/PowerPanel";
import { LightGrid } from "@/components/LightGrid";
import { HistoryLog } from "@/components/HistoryLog";
import { MessageBanner } from "@/components/MessageBanner";
import { colors, fonts } from "@/theme";

type RoomSection = "inicio" | "monitoreo" | "historial" | "configuracion";

const sections: { id: RoomSection; label: string; subtitle: string; icon: string }[] = [
  { id: "inicio", label: "Inicio", subtitle: "Control general", icon: "◉" },
  { id: "monitoreo", label: "Monitoreo", subtitle: "Luces particulares", icon: "◌" },
  { id: "historial", label: "Historial", subtitle: "Eventos recientes", icon: "▣" },
  { id: "configuracion", label: "Configuración", subtitle: "Ajustes del salón", icon: "⚙" },
];

export default function RoomDashboardScreen() {
  const { roomId, roomName } = useLocalSearchParams<{ roomId: string; roomName?: string }>();
  const { signOut } = useAuthContext();
  const router = useRouter();
  const { status, history, connection, command, message, refresh, sendAction } =
    useLightsSystem(roomId);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<RoomSection>("inicio");
  const [menuOpen, setMenuOpen] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.on}
          />
        }
      >
        <StatusBar
          roomName={roomName ?? roomId}
          mode={status?.mode ?? null}
          connected={connection === "connected"}
          updatedAt={status?.updatedAt ?? null}
          onLogout={signOut}
        />

        <MessageBanner
          message={message}
          tone={
            command === "error" || connection === "disconnected"
              ? "error"
              : "info"
          }
        />

        <View style={styles.topBar}>
          <Pressable
            onPress={() => setMenuOpen((value) => !value)}
            style={styles.hamburgerButton}
            accessibilityLabel="Abrir menú"
          >
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </Pressable>
        </View>

        <View style={styles.dashboardLayout}>
          {menuOpen && (
            <>
              <Pressable
                accessibilityLabel="Cerrar menú"
                onPress={() => setMenuOpen(false)}
                style={styles.menuBackdrop}
              />
              <View style={styles.menu}>
                <Text style={styles.menuTitle}>Navegación</Text>
                {sections.map((section) => (
                  <Pressable
                    key={section.id}
                    onPress={() => {
                      setActiveSection(section.id);
                      setMenuOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.menuItem,
                      activeSection === section.id && styles.menuItemActive,
                      pressed && styles.menuItemPressed,
                    ]}
                  >
                    <View style={[styles.iconBadge, activeSection === section.id && styles.iconBadgeActive]}>
                      <Text style={[styles.iconText, activeSection === section.id && styles.iconTextActive]}>
                        {section.icon}
                      </Text>
                    </View>

                    <View style={styles.menuTextWrap}>
                      <Text style={[styles.menuLabel, activeSection === section.id && styles.menuLabelActive]}>
                        {section.label}
                    </Text>
                      <Text style={[styles.menuSubtitle, activeSection === section.id && styles.menuSubtitleActive]}>
                        {section.subtitle}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          <View style={styles.content}>
            {activeSection === "inicio" && (
              <PowerPanel
                status={status}
                sending={command === "sending"}
                onAction={sendAction}
              />
            )}

            {activeSection === "monitoreo" && (
              <LightGrid lights={status?.lights.items ?? null} readOnly={false} />
            )}

            {activeSection === "historial" && <HistoryLog entries={history} />}

            {activeSection === "configuracion" && (
              <View style={styles.settings}>
                <Text style={styles.settingsTitle}>Configuración del salón</Text>
                <View style={styles.settingsCard}>
                  <Text style={styles.settingsLabel}>SALÓN</Text>
                  <Text style={styles.settingsValue}>{roomName ?? roomId}</Text>
                  <Text style={styles.settingsLabel}>MODO DEL DISPOSITIVO</Text>
                  <Text style={styles.settingsValue}>
                    {status?.mode === "real" ? "Dispositivo real" : "Simulación"}
                  </Text>
                  <Text style={styles.settingsLabel}>CONEXIÓN</Text>
                  <Text style={styles.settingsValue}>
                    {connection === "connected" ? "Conectado" : "Sin conexión"}
                  </Text>
                </View>
                <Pressable style={styles.settingsButton} onPress={onRefresh}>
                  <Text style={styles.settingsButtonText}>Actualizar datos</Text>
                </Pressable>
                <Pressable style={styles.settingsButton} onPress={() => router.replace("/")}>
                  <Text style={styles.settingsButtonText}>Volver a mis salones</Text>
                </Pressable>
                <Pressable style={styles.logoutButton} onPress={signOut}>
                  <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: "flex-start",
  },
  hamburgerButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  hamburgerLine: {
    width: 18,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  dashboardLayout: { position: "relative", flexDirection: "row", alignItems: "flex-start" },
  menuBackdrop: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
    backgroundColor: "rgba(31, 43, 61, 0.24)",
  },
  menu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "82%",
    maxWidth: 300,
    zIndex: 2,
    elevation: 5,
    alignItems: "stretch",
    gap: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuTitle: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  menuItem: {
    width: "100%",
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  menuItemPressed: { opacity: 0.9 },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadgeActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  iconText: { fontSize: 14, color: colors.primary, fontFamily: fonts.sansSemiBold },
  iconTextActive: { color: colors.surface },
  menuTextWrap: { flex: 1, justifyContent: "center" },
  menuLabel: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.text },
  menuLabelActive: { color: colors.surface },
  menuSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  menuSubtitleActive: { color: "rgba(255,255,255,0.8)" },
  content: { width: "100%", minWidth: 0 },
  studentLockCard: {
    marginHorizontal: 18,
    marginTop: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 18,
    gap: 8,
  },
  studentLockTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    color: colors.text,
  },
  studentLockText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
  studentLockMeta: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.primary,
  },
  settings: { paddingHorizontal: 18, paddingVertical: 20, gap: 10 },
  settingsTitle: { fontFamily: fonts.sansSemiBold, fontSize: 18, color: colors.text },
  settingsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    padding: 14,
    gap: 6,
    marginBottom: 4,
  },
  settingsLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, marginTop: 6 },
  settingsValue: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.text },
  settingsButton: {
    minHeight: 42,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButtonText: { fontFamily: fonts.sansMedium, color: colors.surface, fontSize: 14 },
  logoutButton: {
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.warn,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: { fontFamily: fonts.sansMedium, color: colors.warn, fontSize: 14 },
});
