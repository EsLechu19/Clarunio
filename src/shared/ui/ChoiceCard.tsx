import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function ChoiceCard({ icon, label, description, selected = false, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; description: string; selected?: boolean; onPress: () => void }) {
  const colors = useAppTheme();
  return <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: selected ? colors.primarySoft : colors.surface, borderColor: selected ? colors.primary : colors.outline, opacity: pressed ? 0.8 : 1 }]}><View style={[styles.icon, { backgroundColor: selected ? colors.primary : colors.surfaceSoft }]}><Ionicons color={selected ? "#FFFFFF" : colors.primary} name={icon} size={22} /></View><View style={styles.copy}><Text style={[styles.label, { color: colors.text }]}>{label}</Text><Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text></View><Ionicons color={selected ? colors.primary : colors.textSecondary} name={selected ? "checkmark-circle" : "chevron-forward"} size={22} /></Pressable>;
}

const styles = StyleSheet.create({ card: { alignItems: "center", borderRadius: radii.card, borderWidth: 1, flexDirection: "row", gap: spacing.sm, minHeight: 76, padding: spacing.md }, icon: { alignItems: "center", borderRadius: radii.pill, height: 42, justifyContent: "center", width: 42 }, copy: { flex: 1, gap: spacing.xs }, label: { fontSize: 16, fontWeight: "800" }, description: { fontSize: 13, lineHeight: 18 } });
