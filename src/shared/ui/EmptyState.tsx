import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";
import { ActionButton } from "./ActionButton";

export function EmptyState({ message, actionLabel, icon = "sparkles-outline", onAction }: { message: string; actionLabel?: string; icon?: keyof typeof Ionicons.glyphMap; onAction?: () => void }) {
  const colors = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
      <Ionicons accessibilityLabel="Estado vacío" color={colors.primary} name={icon} size={30} />
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      {actionLabel && onAction ? <ActionButton icon="add" onPress={onAction}>{actionLabel}</ActionButton> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", borderRadius: radii.card, borderWidth: 1, gap: spacing.md, padding: spacing.xl },
  icon: { fontSize: 28 },
  message: { fontSize: 16, lineHeight: 24, textAlign: "center" }
});
