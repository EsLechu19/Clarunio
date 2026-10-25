import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import type { Item } from "@/src/features/items/domain/item";
import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";
import { formatRelativeCaptureDate } from "./inboxPresentation";

export function InboxItemRow({ item, now = new Date() }: { item: Item; now?: Date }) {
  const colors = useAppTheme();
  const clarify = () => router.push(`/clarify/${item.id}`);

  return (
    <Pressable
      accessibilityLabel={`Abrir captura ${item.title}`}
      accessibilityRole="button"
      onPress={clarify}
      style={({ pressed }) => [styles.row, { backgroundColor: colors.surface, borderColor: colors.outline, opacity: pressed ? 0.82 : 1 }]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primarySoft }]}>
        <Ionicons accessibilityLabel="Captura en bandeja" color={colors.primary} name="file-tray-outline" size={22} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.metadata, { color: colors.textSecondary }]}>Captura · {formatRelativeCaptureDate(item.createdAt, now)}</Text>
      </View>
      <Pressable accessibilityLabel={`Aclarar ${item.title}`} accessibilityRole="button" hitSlop={8} onPress={clarify} style={({ pressed }) => [styles.action, { opacity: pressed ? 0.65 : 1 }]}>
        <Text style={[styles.actionLabel, { color: colors.primary }]}>Aclarar</Text>
        <Ionicons color={colors.primary} name="chevron-forward" size={18} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", borderRadius: radii.card, borderWidth: 1, flexDirection: "row", gap: spacing.sm, minHeight: 78, padding: spacing.sm },
  iconContainer: { alignItems: "center", borderRadius: radii.input, height: 46, justifyContent: "center", width: 46 },
  copy: { flex: 1, gap: spacing.xs },
  title: { fontSize: 16, fontWeight: "800", lineHeight: 21 },
  metadata: { fontSize: 13, lineHeight: 18 },
  action: { alignItems: "center", flexDirection: "row", gap: 2, minHeight: 48, paddingHorizontal: spacing.xs },
  actionLabel: { fontSize: 14, fontWeight: "800" }
});
