import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { useAuthContext } from "@/lib/AuthContext";
import { useLightsSystem } from "@/hooks/useLightsSystem";
import { StatusBar } from "@/components/StatusBar";
import { PowerPanel } from "@/components/PowerPanel";
import { LightGrid } from "@/components/LightGrid";
import { HistoryLog } from "@/components/HistoryLog";
import { MessageBanner } from "@/components/MessageBanner";
import { colors } from "@/theme";

export default function RoomDashboardScreen() {
  const { roomId, roomName } = useLocalSearchParams<{ roomId: string; roomName?: string }>();
  const { session, signOut } = useAuthContext();
  const { status, history, connection, command, message, refresh, sendAction } =
    useLightsSystem(roomId);
  const [refreshing, setRefreshing] = useState(false);

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
          userEmail={session?.user.email ?? ""}
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

        <PowerPanel
          status={status}
          sending={command === "sending"}
          onAction={sendAction}
        />

        <LightGrid lights={status?.lights.items ?? null} />

        <HistoryLog entries={history} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
});
