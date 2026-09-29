import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme";

interface BrandLogoProps {
  compact?: boolean;
}

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.mark, compact && styles.markCompact]}>
        <View style={[styles.leaf, styles.leafBack, compact && styles.leafCompact]} />
        <View style={[styles.leaf, styles.leafFront, compact && styles.leafCompact]} />
        <View style={[styles.stem, compact && styles.stemCompact]} />
      </View>
      <View>
        <Text style={[styles.name, compact && styles.nameCompact]}>ECOsmart</Text>
        <Text style={[styles.caption, compact && styles.captionCompact]}>
          Control inteligente
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  markCompact: { width: 38, height: 38, borderRadius: 12 },
  leaf: {
    position: "absolute",
    width: 20,
    height: 34,
    borderRadius: 20,
  },
  leafCompact: { width: 13, height: 23, borderRadius: 14 },
  leafBack: {
    backgroundColor: colors.on,
    transform: [{ rotate: "-38deg" }, { translateX: -7 }],
  },
  leafFront: {
    backgroundColor: "#B9F3D8",
    transform: [{ rotate: "38deg" }, { translateX: 7 }],
  },
  stem: {
    position: "absolute",
    width: 3,
    height: 25,
    borderRadius: 2,
    backgroundColor: colors.surface,
    transform: [{ rotate: "45deg" }, { translateY: 8 }],
  },
  stemCompact: { width: 2, height: 17, transform: [{ rotate: "45deg" }, { translateY: 5 }] },
  name: { fontFamily: fonts.sansSemiBold, fontSize: 24, color: colors.text },
  nameCompact: { fontSize: 20 },
  caption: { fontFamily: fonts.sans, fontSize: 11, color: colors.textMuted, marginTop: 2 },
  captionCompact: { fontSize: 10 },
});