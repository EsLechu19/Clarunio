import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function EmptyState({ message }: { message: string }) {
  const colors = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
      <Ionicons accessibilityLabel="Estado vacío" color={colors.primary} name="sparkles-outline" size={30} />
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", borderRadius: radii.card, borderWidth: 1, gap: spacing.md, padding: spacing.xl },
  icon: { fontSize: 28 },
  message: { fontSize: 16, lineHeight: 24, textAlign: "center" }
});
