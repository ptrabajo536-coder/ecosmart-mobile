import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthForm } from "@/components/AuthForm";
import { useAuthContext } from "@/lib/AuthContext";
import { colors, fonts } from "@/theme";

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuthContext();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(values: Record<string, string>) {
    setPending(true);
    setError(null);
    const err = await resetPassword(values.email ?? "");
    setPending(false);
    if (err) {
      setError(err);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <SafeAreaView style={styles.doneContainer} edges={["top", "bottom"]}>
        <View style={styles.doneContent}>
          <Text style={styles.doneTitle}>Revisa tu correo</Text>
          <Text style={styles.doneText}>
            Te enviamos un enlace para recuperar tu contraseña.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <AuthForm
      title="Recuperar contraseña"
      subtitle="te enviaremos un enlace para crear una nueva"
      fields={[{ name: "email", label: "correo", keyboardType: "email-address" }]}
      submitLabel="Enviar enlace"
      pending={pending}
      error={error}
      onSubmit={handleSubmit}
      footerText="¿Ya la recuerdas?"
      footerLinkLabel="Inicia sesión"
      footerHref="/login"
      backHref="/login"
    />
  );
}

const styles = StyleSheet.create({
  doneContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  doneContent: {
    alignItems: "center",
    gap: 12,
  },
  doneTitle: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: colors.on },
  doneText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
});