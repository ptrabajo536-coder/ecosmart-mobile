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
import { Link, useRouter } from "expo-router";
import { colors, fonts } from "@/theme";
import { BrandLogo } from "@/components/BrandLogo";
import type { UserRole } from "@/hooks/useAuth";

interface Field {
  name: string;
  label: string;
  secure?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "words";
}

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
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
  privacyLinkLabel?: string;
  privacyLinkHref?: "/privacy-policy";
  roleOptions?: RoleOption[];
  selectedRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
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
  privacyLinkLabel,
  privacyLinkHref,
  roleOptions,
  selectedRole,
  onRoleChange,
}: AuthFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPasswordFields, setShowPasswordFields] = useState<Record<string, boolean>>({});

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <BrandLogo />

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.card}>
          {fields.map((field) => {
            const isPasswordVisible = !!showPasswordFields[field.name];

            return (
              <View key={field.name} style={styles.fieldGroup}>
                <Text style={styles.label}>{field.label}</Text>

                <View style={field.secure ? styles.inputWrapper : undefined}>
                  <TextInput
                    style={field.secure ? [styles.input, styles.inputWithAction] : styles.input}
                    secureTextEntry={field.secure && !isPasswordVisible}
                    keyboardType={field.keyboardType ?? "default"}
                    autoCapitalize={field.autoCapitalize ?? "none"}
                    placeholder={
                      field.name === "email"
                        ? "ejemplo@correo.com"
                        : "Ingresa tu contraseña"
                    }
                    placeholderTextColor={colors.textMuted}
                    value={values[field.name] ?? ""}
                    onChangeText={(text) =>
                      setValues((prev) => ({
                        ...prev,
                        [field.name]: text,
                      }))
                    }
                  />

                  {field.secure && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                      hitSlop={10}
                      onPress={() =>
                        setShowPasswordFields((prev) => ({
                          ...prev,
                          [field.name]: !prev[field.name],
                        }))
                      }
                      style={styles.eyeButton}
                    >
                      <Text style={styles.eyeText}>{"👁"}</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

          {roleOptions && onRoleChange && roleOptions.length > 1 && (
            <View style={styles.roleSection}>
              <Text style={styles.roleTitle}>Selecciona tu rol</Text>
              <View style={styles.roleRow}>
                {roleOptions.map((option) => {
                  const active = selectedRole === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      onPress={() => onRoleChange(option.value)}
                      hitSlop={8}
                      style={({ pressed }) => [
                        styles.roleOption,
                        active && styles.roleOptionActive,
                        pressed && styles.roleOptionPressed,
                      ]}
                    >
                      <Text style={[styles.roleLabel, active && styles.roleLabelActive]}>
                        {option.label}
                      </Text>
                      <Text style={[styles.roleDescription, active && styles.roleDescriptionActive]}>
                        {option.description}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.error}>{error}</Text>
            </View>
          )}

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

          {secondaryLinkLabel && secondaryLinkHref && (
            <Link href={secondaryLinkHref} style={styles.secondaryLink}>
              {secondaryLinkLabel}
            </Link>
          )}

          {privacyLinkLabel && privacyLinkHref && (
            <Pressable onPress={() => router.push(privacyLinkHref)} style={styles.privacyLinkButton}>
              <Text style={styles.privacyLink}>{privacyLinkLabel}</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerText} </Text>

          <Link href={footerHref} style={styles.footerLink}>
            {footerLinkLabel}
          </Link>
        </View>

        <Text style={styles.bottomText}>
          Control inteligente para tu salón
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 36,
  },

  header: {
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 22,
    color: colors.text,
    marginTop: 14,
    letterSpacing: 0.2,
  },

  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 6,
    textAlign: "center",
    opacity: 0.9,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#8FA7D9",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },

  fieldGroup: {
    marginBottom: 17,
  },

  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.text,
    marginBottom: 7,
    textTransform: "capitalize",
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 13,

    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.text,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  inputWithAction: {
    paddingRight: 42,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
  },
  eyeText: {
    fontSize: 14,
    lineHeight: 14,
    color: colors.textMuted,
  },

  roleSection: {
    marginBottom: 18,
  },
  roleTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.text,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: "row",
    gap: 8,
  },
  roleOption: {
    flex: 1,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  roleOptionActive: {
    backgroundColor: colors.primaryDim,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  roleOptionPressed: { opacity: 0.92 },
  roleLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    color: colors.text,
  },
  roleLabelActive: {
    color: colors.primary,
  },
  roleDescription: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 4,
  },
  roleDescriptionActive: {
    color: colors.primary,
  },
  errorBox: {
    backgroundColor: "rgba(220, 70, 70, 0.08)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
  },

  error: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.warn,
    textAlign: "center",
  },

  submitButton: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 2,
  },

  submitButtonPressed: {
    opacity: 0.82,
  },

  submitButtonDisabled: {
    opacity: 0.5,
  },

  submitLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.surface,
  },

  secondaryLink: {
    alignSelf: "center",
    marginTop: 16,
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  privacyLinkButton: {
    alignSelf: "center",
    marginTop: 10,
  },
  privacyLink: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: "underline",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  footerText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.textMuted,
  },

  footerLink: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.primary,
  },

  bottomText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 28,
    opacity: 0.8,
  },
});