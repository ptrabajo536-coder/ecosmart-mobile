import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors, fonts } from "@/theme";

export default function InstitutionMapScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Salones</Text>
        </Pressable>
        <Text style={styles.title}>Mapa de la institución</Text>
      </View>
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Mapa próximamente</Text>
        <Text style={styles.emptyText}>
          Aquí podrás seleccionar cualquier salón directamente desde el mapa.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.danger,
  },
  backText: { fontFamily: fonts.monoMedium, fontSize: 11, color: colors.surface },
  title: { flex: 1, fontFamily: fonts.sansSemiBold, fontSize: 18, color: colors.text },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 },
  emptyTitle: { fontFamily: fonts.sansSemiBold, fontSize: 20, color: colors.text },
  emptyText: {
    maxWidth: 280,
    marginTop: 8,
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
    textAlign: "center",
  },
});