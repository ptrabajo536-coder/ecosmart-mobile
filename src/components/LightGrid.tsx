import { View, Text, StyleSheet } from "react-native";
import type { LightUnit } from "@/types/lights";
import { colors, fonts } from "@/theme";

interface LightGridProps {
  lights: LightUnit[] | null;
}

export function LightGrid({ lights }: LightGridProps) {
  const items =
    lights ??
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `Luz ${i + 1}`,
      state: "OFF" as const,
      watts: 0,
    }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>LUCES DEL SALÓN</Text>
      <View style={styles.grid}>
        {items.map((light) => (
          <LightCard key={light.id} light={light} />
        ))}
      </View>
    </View>
  );
}

function LightCard({ light }: { light: LightUnit }) {
  const on = light.state === "ON";
  return (
    <View style={styles.card}>
      <Text style={[styles.bulb, { color: on ? colors.on : colors.textMuted }]}>
        ●
      </Text>
      <Text style={styles.name}>{light.name}</Text>
      <Text style={styles.status}>
        {on ? "encendida" : "apagada"} · {light.watts}W
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  card: {
    width: "31%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 4,
    shadowColor: "#203A63",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  bulb: { fontSize: 16 },
  name: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.text },
  status: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textMuted,
  },
});
