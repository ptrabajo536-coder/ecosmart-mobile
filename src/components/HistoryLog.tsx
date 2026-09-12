import { View, Text, StyleSheet } from "react-native";
import type { HistoryEntry } from "@/types/lights";
import { colors, fonts } from "@/theme";

interface HistoryLogProps {
  entries: HistoryEntry[];
}

export function HistoryLog({ entries }: HistoryLogProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>ÚLTIMAS ACCIONES</Text>

      {entries.length === 0 ? (
        <Text style={styles.empty}>
          Todavía no se ha registrado ninguna acción.
        </Text>
      ) : (
        <View style={styles.list}>
          {entries.map((entry, index) => (
            <View
              key={entry.id}
              style={[
                styles.row,
                index < entries.length - 1 && styles.rowDivider,
              ]}
            >
              <Text style={styles.time}>
                {new Date(entry.timestamp).toLocaleTimeString("es-CO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text
                style={[
                  styles.action,
                  { color: entry.action === "ON" ? colors.on : colors.textMuted },
                ]}
                numberOfLines={1}
              >
                {entry.userEmail} {entry.action === "ON" ? "encendió" : "apagó"}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 20, gap: 12 },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  empty: { fontFamily: fonts.sans, fontSize: 13, color: colors.textMuted },
  list: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: "center",
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  time: { fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted },
  action: { fontFamily: fonts.mono, fontSize: 11, flexShrink: 1 },
});
