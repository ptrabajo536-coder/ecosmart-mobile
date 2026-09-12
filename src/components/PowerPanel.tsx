import { View, Text, Pressable, StyleSheet } from "react-native";
import type { LightsStatusResponse, RelayAction } from "@/types/lights";
import { colors, fonts } from "@/theme";

interface PowerPanelProps {
  status: LightsStatusResponse | null;
  sending: boolean;
  onAction: (action: RelayAction) => void;
}

export function PowerPanel({ status, sending, onAction }: PowerPanelProps) {
  const relayOn = status?.relay.state === "ON";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>RELÉ PRINCIPAL</Text>

      <Pressable
        disabled={sending}
        onPress={() => onAction(relayOn ? "OFF" : "ON")}
        style={({ pressed }) => [
          styles.switch,
          {
            borderColor: relayOn ? colors.on : colors.primary,
            backgroundColor: relayOn ? colors.onDim : colors.primaryDim,
          },
          sending && styles.disabled,
          pressed && !sending && styles.pressed,
        ]}
      >
        <Text
          style={[
            styles.switchLabel,
            { color: relayOn ? colors.on : colors.primary },
          ]}
        >
          {sending ? "···" : relayOn ? "ON" : "OFF"}
        </Text>
        <Text style={styles.switchHint}>
          {sending ? "procesando" : "toca para cambiar"}
        </Text>
      </Pressable>

      <View style={styles.buttonRow}>
        <Pressable
          disabled={sending || relayOn}
          onPress={() => onAction("ON")}
          style={[
            styles.smallButton,
            (sending || relayOn) && styles.disabled,
          ]}
        >
          <Text style={styles.smallButtonLabel}>Encender todas</Text>
        </Pressable>
        <Pressable
          disabled={sending || !relayOn}
          onPress={() => onAction("OFF")}
          style={[
            styles.smallButton,
            (sending || !relayOn) && styles.disabled,
          ]}
        >
          <Text style={styles.smallButtonLabel}>Apagar todas</Text>
        </Pressable>
      </View>

      <View style={styles.readings}>
        <Reading
          label="encendidas"
          value={status ? `${status.lights.on}/${status.lights.total}` : "—"}
        />
        <Reading
          label="consumo"
          value={status ? `${status.power.watts} W` : "—"}
        />
        <Reading label="estado" value={relayOn ? "activo" : "reposo"} />
      </View>
    </View>
  );
}

function Reading({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reading}>
      <Text style={styles.readingLabel}>{label}</Text>
      <Text style={styles.readingValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 16,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  switch: {
    width: 128,
    height: 128,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  switchLabel: { fontFamily: fonts.monoMedium, fontSize: 26 },
  switchHint: { fontFamily: fonts.sans, fontSize: 11, color: colors.textMuted },
  buttonRow: { flexDirection: "row", gap: 8 },
  smallButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  smallButtonLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.primary,
  },
  readings: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  reading: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  readingLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
  },
  readingValue: {
    fontFamily: fonts.monoMedium,
    fontSize: 15,
    color: colors.text,
    marginTop: 2,
  },
});
