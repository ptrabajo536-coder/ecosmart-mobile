import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/lib/AuthContext";
import { apiGet, isErrorResponse } from "@/lib/api";
import type { RoomsListResponse } from "@/types/lights";
import { colors, fonts } from "@/theme";

export default function RoomsListScreen() {
  const { session, signOut } = useAuthContext();
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomsListResponse["rooms"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const body = await apiGet<RoomsListResponse>("/rooms");
    if (isErrorResponse(body)) {
      setError(body.error);
      return;
    }
    setError(null);
    setRooms(body.rooms);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial al montar
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>ECOsmart</Text>
          <Text style={styles.subtitle}>Salones inteligentes</Text>
        </View>
        <View style={styles.userRow}>
          <Text style={styles.userEmail} numberOfLines={1}>
            {session?.user.email ?? ""}
          </Text>
          <Pressable onPress={signOut}>
            <Text style={styles.logout}>salir</Text>
          </Pressable>
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={rooms ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.on} />
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/rooms/[roomId]",
                params: { roomId: item.id, roomName: item.name },
              })
            }
          >
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: item.state === "ON" ? colors.on : colors.off },
                ]}
              />
            </View>
            <Text style={styles.cardStatus}>
              {item.state === "ON" ? "encendido" : "apagado"}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: { fontFamily: fonts.sansSemiBold, fontSize: 22, color: colors.text },
  subtitle: { fontFamily: fonts.sans, fontSize: 12, color: colors.textMuted, marginTop: 3 },
  userRow: { alignItems: "flex-end", gap: 4 },
  userEmail: { fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, maxWidth: 160 },
  logout: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  error: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.warn,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  list: { padding: 20, gap: 12 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 18,
    gap: 6,
    shadowColor: "#203A63",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontFamily: fonts.sansMedium, fontSize: 16, color: colors.text },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cardStatus: { fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted },
});
