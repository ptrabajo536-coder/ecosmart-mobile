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
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.label}>CONTROL DE ILUMINACIÓN</Text>
          <Text style={styles.heading}>Luces del salón</Text>
        </View>
        <View style={[styles.liveBadge, relayOn && styles.liveBadgeOn]}>
          <View style={[styles.liveDot, relayOn && styles.liveDotOn]} />
          <Text style={[styles.liveText, relayOn && styles.liveTextOn]}>
            {relayOn ? "ACTIVAS" : "EN REPOSO"}
          </Text>
        </View>
      </View>

      <View style={[styles.controlCard, relayOn && styles.controlCardOn]}>
        <View style={styles.controlTop}>
          <View style={[styles.lampIcon, relayOn && styles.lampIconOn]}>
            <Text style={styles.lampIconText}>☼</Text>
          </View>
          <View style={styles.controlCopy}>
            <Text style={styles.controlTitle}>{relayOn ? "Iluminación encendida" : "Iluminación apagada"}</Text>
            <Text style={styles.controlHint}>
              {sending ? "Aplicando cambio..." : "Controla todas las luces a la vez"}
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
        <Pressable
          disabled={sending || relayOn}
          onPress={() => onAction("ON")}
          style={({ pressed }) => [styles.actionButton, styles.onButton, (sending || relayOn) && styles.disabled, pressed && styles.pressed]}
        >
          <Text style={[styles.actionButtonLabel, styles.onButtonLabel]}>ENCENDER</Text>
        </Pressable>
        <Pressable
          disabled={sending || !relayOn}
          onPress={() => onAction("OFF")}
          style={({ pressed }) => [styles.actionButton, styles.offButton, (sending || !relayOn) && styles.disabled, pressed && styles.pressed]}
        >
          <Text style={[styles.actionButtonLabel, styles.offButtonLabel]}>APAGAR</Text>
        </Pressable>
      </View>
      </View>

      <View style={styles.readings}>
        <Reading
          label="luz principal"
          value={relayOn ? "encendida" : "apagada"}
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
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 6,
    gap: 10,
  },
  headingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  heading: { fontFamily: fonts.sansSemiBold, fontSize: 18, color: colors.text, marginTop: 3 },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6 },
  liveBadgeOn: { backgroundColor: colors.onDim, borderColor: colors.on },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.off },
  liveDotOn: { backgroundColor: colors.on },
  liveText: { fontFamily: fonts.monoMedium, fontSize: 9, color: colors.textMuted },
  liveTextOn: { color: colors.on },
  controlCard: { width: "100%", borderRadius: 12, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  controlCardOn: { backgroundColor: colors.onDim, borderColor: colors.on },
  controlTop: { flexDirection: "row", alignItems: "center", gap: 13, marginBottom: 18 },
  lampIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primaryDim, alignItems: "center", justifyContent: "center" },
  lampIconOn: { backgroundColor: colors.on },
  lampIconText: { fontSize: 25, color: colors.primary },
  controlCopy: { flex: 1 },
  controlTitle: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.text },
  controlHint: { fontFamily: fonts.sans, fontSize: 12, color: colors.textMuted, marginTop: 4 },
  actionButton: { flex: 1, minHeight: 40, borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  onButton: { backgroundColor: colors.on, borderColor: colors.on },
  offButton: { backgroundColor: colors.surface, borderColor: colors.border },
  actionButtonLabel: { fontFamily: fonts.monoMedium, fontSize: 11 },
  onButtonLabel: { color: colors.surface },
  offButtonLabel: { color: colors.textMuted },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.4 },
  buttonRow: { flexDirection: "row", gap: 10 },
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
