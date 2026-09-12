import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { AuthForm } from "@/components/AuthForm";
import { useAuthContext } from "@/lib/AuthContext";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { updatePassword } = useAuthContext();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: Record<string, string>) {
    const password = values.password ?? "";
    const confirmation = values.confirmPassword ?? "";
    if (password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setPending(true);
    setError(null);
    const err = await updatePassword(password);
    setPending(false);
    if (err) {
      setError(err);
      return;
    }

    Alert.alert("Contraseña actualizada", "Ya puedes iniciar sesión.", [
      { text: "Continuar", onPress: () => router.replace("/login") },
    ]);
  }

  return (
    <AuthForm
      title="Nueva contraseña"
      subtitle="elige una contraseña nueva para tu cuenta"
      fields={[
        { name: "password", label: "contraseña", secure: true },
        { name: "confirmPassword", label: "repetir contraseña", secure: true },
      ]}
      submitLabel="Guardar contraseña"
      pending={pending}
      error={error}
      onSubmit={handleSubmit}
      footerText="¿Recordaste tu contraseña?"
      footerLinkLabel="Inicia sesión"
      footerHref="/login"
    />
  );
}