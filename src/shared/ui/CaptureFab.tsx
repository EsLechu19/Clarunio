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
      accessibilityRole="button"
      onPress={() => router.push("/capture")}
      style={({ pressed }) => [styles.button, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }]}
    >
      <Ionicons color="#FFFFFF" name="add" size={30} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: "center", borderRadius: radii.pill, bottom: 78, elevation: 5, height: 62, justifyContent: "center", position: "absolute", right: spacing.lg, width: 62, shadowColor: "#2C1A63", shadowOpacity: 0.2, shadowRadius: 10 },
  plus: { color: "#FFFFFF", fontSize: 28, fontWeight: "300", lineHeight: 30 },
  label: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" }
});
