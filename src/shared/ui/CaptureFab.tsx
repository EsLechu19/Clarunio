import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function CaptureFab() {
  const colors = useAppTheme();

  return (
    <Pressable
      accessibilityLabel="Capturar"
      accessibilityHint="Abre una captura nueva"
      accessibilityRole="button"
      onPress={() => router.push("/capture")}
      style={({ pressed }) => [styles.button, { backgroundColor: pressed ? colors.primaryPressed : colors.primary, borderColor: colors.primarySoft, transform: [{ scale: pressed ? 0.94 : 1 }] }]}
    >
      <Ionicons color="#FFFFFF" name="add" size={32} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: "center", borderRadius: radii.pill, borderWidth: 2, bottom: 86, elevation: 6, height: 64, justifyContent: "center", position: "absolute", right: spacing.lg, width: 64, shadowColor: "#2C1A63", shadowOpacity: 0.24, shadowRadius: 12 }
});
