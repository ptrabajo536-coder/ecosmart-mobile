import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { useAuthContext } from "@/lib/AuthContext";

export default function LoginScreen() {
  const { signIn } = useAuthContext();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: Record<string, string>) {
    setPending(true);
    setError(null);
    const err = await signIn(values.email ?? "", values.password ?? "");
    setPending(false);
    if (err) setError(err);
    // Si no hay error, el RouteGuard en _layout.tsx detecta la sesión y
    // redirige automáticamente al dashboard.
  }

  return (
    <AuthForm
      title="Iniciar sesión"
      subtitle="accede al panel de control del salón"
      fields={[
        { name: "email", label: "correo", keyboardType: "email-address" },
        { name: "password", label: "contraseña", secure: true },
      ]}
      submitLabel="Ingresar"
      pending={pending}
      error={error}
      onSubmit={handleSubmit}
      footerText="¿No tienes cuenta?"
      footerLinkLabel="Regístrate"
      footerHref="/register"
      secondaryLinkLabel="¿Olvidaste tu contraseña?"
      secondaryLinkHref="/forgot-password"
    />
  );
}
