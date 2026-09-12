import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme";

interface MessageBannerProps {
  message: string | null;
  tone: "info" | "error";
}

export function MessageBanner({ message, tone }: MessageBannerProps) {
  if (!message) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tone === "error" ? colors.warnDim : colors.surfaceRaised,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: tone === "error" ? colors.danger : colors.textMuted },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  text: { fontFamily: fonts.mono, fontSize: 11 },
});
