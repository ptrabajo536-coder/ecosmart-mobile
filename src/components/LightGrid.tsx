import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import type { LightUnit } from "@/types/lights";
import { colors, fonts } from "@/theme";

interface LightGridProps {
  lights: LightUnit[] | null;
  readOnly?: boolean;
}

export function LightGrid({ lights, readOnly = false }: LightGridProps) {
  const [overrides, setOverrides] = useState<Record<number, LightUnit["state"]>>({});
  const primaryLight =
    lights && lights.length > 0
      ? lights[0]
      : {
          id: 1,
          name: "Luz principal",
          state: "OFF" as const,
          watts: 0,
        };

  const items = [
    {
      ...primaryLight,
      state: overrides[primaryLight.id] ?? primaryLight.state,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Monitoreo</Text>
          <Text style={styles.subtitle}>Luz principal del salón</Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>1</Text>
          <Text style={styles.countLabel}>luz</Text>
        </View>
      </View>

      <View style={styles.gridSingle}>
        {items.map((light) => (
          <LightCard
            key={light.id}
            light={light}
            readOnly={readOnly}
            onToggle={() => {
              if (readOnly) return;
              setOverrides((current) => ({
                ...current,
                [light.id]: light.state === "ON" ? "OFF" : "ON",
              }));
            }}
          />
        ))}
      </View>
    </View>
  );
}

function LightCard({
  light,
  onToggle,
  readOnly,
}: {
  light: LightUnit;
  onToggle: () => void;
  readOnly: boolean;
}) {
  const on = light.state === "ON";

  return (
    <Pressable
      onPress={onToggle}
      disabled={readOnly}
      style={({ pressed }) => [
        styles.card,
        on && styles.cardOn,
        readOnly && styles.cardReadOnly,
        pressed && !readOnly && styles.cardPressed,
      ]}
    >
      <View style={styles.cardTop}>
        <View style={[styles.iconCircle, on && styles.iconCircleOn]}>
          <Text style={[styles.bulbIcon, on && styles.bulbIconOn]}>
            {on ? "☼" : "○"}
          </Text>
        </View>

        <View style={[styles.statusDot, on && styles.statusDotOn]} />
      </View>

      <Text style={styles.name}>{light.name}</Text>

      <View style={styles.statusRow}>
        <Text style={[styles.status, on && styles.statusOn]}>
          {on ? "ENCENDIDA" : "APAGADA"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 18,
    color: colors.text,
  },

  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },

  countBadge: {
    minWidth: 55,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },

  countText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.primary,
  },

  countLabel: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 1,
  },

  gridSingle: {
    width: "100%",
  },

  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
    minHeight: 180,
  },

  cardOn: {
    borderColor: colors.on,
    backgroundColor: "rgba(45, 180, 100, 0.08)",
  },

  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  cardReadOnly: {
    opacity: 0.9,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },

  iconCircleOn: {
    backgroundColor: colors.on,
  },

  bulbIcon: {
    fontSize: 21,
    color: colors.textMuted,
  },

  bulbIconOn: {
    color: colors.surface,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.textMuted,
    marginTop: 5,
  },

  statusDotOn: {
    backgroundColor: colors.on,
  },

  name: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.text,
    marginBottom: 7,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  status: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },

  statusOn: {
    color: colors.on,
  },
});