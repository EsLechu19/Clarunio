import { Alert, Pressable, StyleSheet, Text } from "react-native";

import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function CaptureFab() {
  const colors = useAppTheme();

  return (
    <Pressable
      accessibilityLabel="Capturar"
      accessibilityRole="button"
      onPress={() => Alert.alert("Captura pendiente", "La captura rápida estará disponible en un próximo hito.")}
      style={({ pressed }) => [styles.button, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }]}
    >
      <Text style={styles.plus}>+</Text>
      <Text style={styles.label}>Capturar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: "center", borderRadius: radii.pill, bottom: 78, elevation: 4, flexDirection: "row", gap: spacing.xs, minHeight: 56, paddingHorizontal: spacing.lg, position: "absolute", right: spacing.lg, shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 8 },
  plus: { color: "#FFFFFF", fontSize: 28, fontWeight: "300", lineHeight: 30 },
  label: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" }
});
