import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { colors, fonts } from "@/theme";

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <Link href="/login" style={styles.backLink}>
            ← Volver
          </Link>

          <Text style={styles.title}>Política de privacidad</Text>
          <Text style={styles.subtitle}>
            Información importante sobre el uso de tus datos en ECOsmart.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>1. Responsable del tratamiento</Text>
          <Text style={styles.text}>
            ECOsmart es una aplicación diseñada para el control y monitoreo de iluminación
            en aulas y espacios docentes. El uso de la aplicación está orientado a
            personal docente y al administrador autorizado de la institución.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>2. Información que recopilamos</Text>
          <Text style={styles.text}>
            Para operar la aplicación, recopilamos información necesaria para la
            autenticación y el uso del sistema, como nombre del docente, correo
            institucional o autorizado, contraseña para acceso seguro, datos de ingreso a
            la cuenta y registros de uso relacionados con el encendido, apagado y estado
            de las luminarias del salón.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>3. Uso de la información</Text>
          <Text style={styles.text}>
            Los datos se utilizan exclusivamente para autenticar al personal docente,
            gestionar el acceso a la plataforma, controlar y monitorear el estado de la
            iluminación del salón, mantener un historial operativo del aula y facilitar
            la administración del sistema por parte del personal autorizado.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>4. Restricción de acceso</Text>
          <Text style={styles.text}>
            La aplicación está dirigida únicamente a docentes de la institución. El
            registro y acceso están restringidos para usuarios no autorizados. Solo se
            permite una excepción administrativa, habilitada para el administrador del
            sistema y controlada por la institución.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>5. Protección y seguridad</Text>
          <Text style={styles.text}>
            Se toman medidas razonables para proteger los datos personales y el acceso a la
            plataforma. La autenticación, la contraseña y el acceso a la información se
            gestionan mediante sistemas seguros y recursos de la infraestructura de la
            aplicación.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>6. Compartición de datos</Text>
          <Text style={styles.text}>
            ECOsmart no vende, alquila ni comparte información personal con terceros para
            fines comerciales. La información solo puede compartirse con el personal
            administrativo de la institución o con proveedores de servicio esenciales para
            la operación técnica de la aplicación, en cumplimiento con la normativa vigente.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>7. Derechos del usuario</Text>
          <Text style={styles.text}>
            El usuario puede solicitar información sobre sus datos personales, corregir
            errores, actualizar su información o solicitar la eliminación de su acceso a la
            plataforma cuando deje de formar parte del personal autorizado de la
            institución.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>8. Contacto</Text>
          <Text style={styles.text}>
            Para consultas sobre privacidad, acceso, seguridad o eliminación de datos, el
            usuario puede comunicarse con el administrador del sistema o con la
            coordinación responsable de la aplicación dentro de la institución.
          </Text>
        </View>

        <Link href="/login" style={styles.link}>
          Volver al inicio de sesión
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 14,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  backLink: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.primary,
    marginBottom: 10,
  },
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
    color: colors.text,
  },
  text: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
  link: {
    backgroundColor: colors.primary,
    color: colors.surface,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 14,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
});
