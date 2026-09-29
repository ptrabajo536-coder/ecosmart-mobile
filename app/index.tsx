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
import { BrandLogo } from "@/components/BrandLogo";

export default function RoomsListScreen() {
  const { session, signOut } = useAuthContext();
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomsListResponse["rooms"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const activeRooms = rooms?.filter((room) => room.state === "ON").length ?? 0;

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
        <BrandLogo compact />
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

      <View style={styles.intro}>
        <View style={styles.introCopy}>
          <Text style={styles.eyebrow}>ESPACIOS</Text>
          <Text style={styles.title}>Tus salones</Text>
          <Text style={styles.description}>
            Gestiona la iluminación de cada espacio desde un solo lugar.
          </Text>
        </View>
        <View style={styles.summary}>
          <Text style={styles.summaryValue}>{activeRooms}</Text>
          <Text style={styles.summaryLabel}>activos</Text>
        </View>
      </View>

      <FlatList
        data={rooms ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Pressable
            style={({ pressed }) => [styles.mapCard, pressed && styles.cardPressed]}
            onPress={() => router.push("/mapa")}
          >
            <View style={styles.mapIcon}>
              <Text style={styles.mapIconText}>⌖</Text>
            </View>
            <View style={styles.mapCopy}>
              <Text style={styles.mapTitle}>Mapa de la institución</Text>
              <Text style={styles.mapSubtitle}>Explora los salones desde el mapa</Text>
            </View>
            <Text style={styles.mapArrow}>›</Text>
          </Pressable>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.on} />
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() =>
              router.push({
                pathname: "/rooms/[roomId]",
                params: { roomId: item.id, roomName: item.name },
              })
            }
          >
            <View
              style={[
                styles.cardAccent,
                { backgroundColor: item.state === "ON" ? colors.on : colors.off },
              ]}
            />
            <View style={styles.cardContent}>
              <View style={styles.cardRow}>
                <View style={styles.roomIcon}>
                  <Text style={styles.roomIconText}>⌂</Text>
                </View>
                <View style={styles.cardArrow}>
                  <Text style={styles.cardArrowText}>›</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: item.state === "ON" ? colors.on : colors.off },
                  ]}
                />
                <Text style={styles.cardStatus}>
                  {item.state === "ON" ? "Iluminación activa" : "En reposo"}
                </Text>
              </View>
            </View>
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
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
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
  intro: {
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 4,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.text,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  introCopy: { flex: 1, paddingRight: 18 },
  eyebrow: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    color: colors.on,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: { fontFamily: fonts.sansSemiBold, fontSize: 27, color: colors.surface },
  description: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: "#B8C5D8",
    marginTop: 6,
  },
  summary: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: "#263B5C",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryValue: { fontFamily: fonts.monoMedium, fontSize: 24, color: colors.on },
  summaryLabel: { fontFamily: fonts.mono, fontSize: 9, color: "#B8C5D8", marginTop: 2 },
  list: { padding: 20, paddingTop: 16, gap: 12 },
  mapCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.primaryDim,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    gap: 12,
  },
  mapIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  mapIconText: { fontSize: 24, color: colors.surface },
  mapCopy: { flex: 1 },
  mapTitle: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.text },
  mapSubtitle: { fontFamily: fonts.sans, fontSize: 11, color: colors.textMuted, marginTop: 3 },
  mapArrow: { fontFamily: fonts.sans, fontSize: 26, color: colors.primary },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    minHeight: 142,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#203A63",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardPressed: { opacity: 0.84, transform: [{ scale: 0.985 }] },
  cardAccent: { width: 5 },
  cardContent: { flex: 1, padding: 17 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  roomIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },
  roomIconText: { fontFamily: fonts.sansSemiBold, fontSize: 22, color: colors.primary },
  cardArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  cardArrowText: { fontFamily: fonts.sans, fontSize: 24, lineHeight: 25, color: colors.textMuted },
  cardTitle: { fontFamily: fonts.sansSemiBold, fontSize: 18, color: colors.text, marginTop: 14 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 7 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cardStatus: { fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted },
});
