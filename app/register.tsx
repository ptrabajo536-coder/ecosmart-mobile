import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthForm } from "@/components/AuthForm";
import { useAuthContext } from "@/lib/AuthContext";
import { colors, fonts } from "@/theme";

export default function RegisterScreen() {
  const { signUp } = useAuthContext();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(values: Record<string, string>) {
    setPending(true);
    setError(null);
    const err = await signUp(
      values.email ?? "",
      values.password ?? "",
      values.name ?? ""
    );
    setPending(false);
    if (err) {
      setError(err);
      return;
    }
    // Si Supabase tiene "Confirm email" activado, no hay sesión todavía:
    // se le pide al estudiante revisar su correo antes de iniciar sesión.
    // Si está desactivado, el RouteGuard detecta la sesión y ya lo manda
    // directo al dashboard.
    setDone(true);
  }

  if (done) {
    return (
      <View style={styles.doneContainer}>
        <Text style={styles.doneTitle}>Cuenta creada</Text>
        <Text style={styles.doneText}>
          Si tu correo requiere confirmación, revísalo antes de iniciar
          sesión. Si no, ya puedes entrar con tu cuenta.
        </Text>
      </View>
    );
  }

  return (
    <AuthForm
      title="Crear cuenta"
      subtitle="regístrate para controlar la iluminación del salón"
      fields={[
        { name: "name", label: "nombre", autoCapitalize: "words" },
        { name: "email", label: "correo", keyboardType: "email-address" },
        { name: "password", label: "contraseña", secure: true },
      ]}
      submitLabel="Crear cuenta"
      pending={pending}
      error={error}
      onSubmit={handleSubmit}
      footerText="¿Ya tienes cuenta?"
      footerLinkLabel="Inicia sesión"
      footerHref="/login"
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
    gap: 12,
  },
  doneTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 16,
    color: colors.on,
  },
  doneText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
});
