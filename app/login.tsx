import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { useAuthContext } from "@/lib/AuthContext";
import type { UserRole } from "@/hooks/useAuth";

const roleOptions = [
  { value: "teacher" as const, label: "Profesor", description: "Control total" },
];

export default function LoginScreen() {
  const { signIn } = useAuthContext();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("teacher");

  async function handleSubmit(values: Record<string, string>) {
    setPending(true);
    setError(null);
    const err = await signIn(values.email ?? "", values.password ?? "", selectedRole);
    setPending(false);
    if (err) setError(err);
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
      privacyLinkLabel="Política de privacidad"
      privacyLinkHref="/privacy-policy"
      roleOptions={roleOptions}
      selectedRole={selectedRole}
      onRoleChange={setSelectedRole}
    />
  );
}
