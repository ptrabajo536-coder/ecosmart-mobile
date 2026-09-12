import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { colors, fonts } from "@/theme";

interface Field {
  name: string;
  label: string;
  secure?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "words";
}

interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: Field[];
  submitLabel: string;
  pending: boolean;
  error: string | null;
  onSubmit: (values: Record<string, string>) => void;
  footerText: string;
  footerLinkLabel: string;
  footerHref: "/login" | "/register";
  secondaryLinkLabel?: string;
  secondaryLinkHref?: "/forgot-password";
}

export function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  pending,
  error,
  onSubmit,
  footerText,
  footerLinkLabel,
  footerHref,
  secondaryLinkLabel,
  secondaryLinkHref,
}: AuthFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.brand}>ECOsmart</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.form}>
          {fields.map((field) => (
            <View key={field.name} style={styles.fieldGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                secureTextEntry={field.secure}
                keyboardType={field.keyboardType ?? "default"}
                autoCapitalize={field.autoCapitalize ?? "none"}
                placeholderTextColor={colors.textMuted}
                value={values[field.name] ?? ""}
                onChangeText={(text) =>
                  setValues((prev) => ({ ...prev, [field.name]: text }))
                }
              />
            </View>
          ))}

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            disabled={pending}
            onPress={() => onSubmit(values)}
            style={({ pressed }) => [
              styles.submitButton,
              pending && styles.submitButtonDisabled,
              pressed && !pending && styles.submitButtonPressed,
            ]}
          >
            <Text style={styles.submitLabel}>
              {pending ? "Procesando..." : submitLabel}
            </Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerText} </Text>
          <Link href={footerHref} style={styles.footerLink}>
            {footerLinkLabel}
          </Link>
        </View>
        {secondaryLinkLabel && secondaryLinkHref && (
          <Link href={secondaryLinkHref} style={styles.secondaryLink}>
            {secondaryLinkLabel}
          </Link>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: { alignItems: "center", marginBottom: 32 },
  brand: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 22,
    color: colors.primary,
    marginBottom: 4,
  },
  title: { fontFamily: fonts.sansSemiBold, fontSize: 22, color: colors.text },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  form: { gap: 16 },
  fieldGroup: { gap: 6 },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  },
  error: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.warn,
  },
  submitButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonPressed: { opacity: 0.85 },
  submitButtonDisabled: { opacity: 0.5 },
  submitLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.surface,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
  },
  footerLink: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.on,
    textDecorationLine: "underline",
  },
  secondaryLink: {
    alignSelf: "center",
    marginTop: 16,
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: "underline",
  },
});
