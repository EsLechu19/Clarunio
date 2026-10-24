import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function ActionButton({ children, icon, onPress, variant = "primary", disabled = false }: PropsWithChildren<{ icon?: keyof typeof Ionicons.glyphMap; onPress: () => void; variant?: "primary" | "secondary" | "danger"; disabled?: boolean }>) {
  const colors = useAppTheme();
  const color = variant === "primary" ? "#FFFFFF" : variant === "danger" ? colors.error : colors.primary;
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor: variant === "primary" ? (pressed ? colors.primaryPressed : colors.primary) : colors.surfaceSoft, borderColor: variant === "primary" ? colors.primary : colors.outline, opacity: disabled ? 0.5 : pressed ? 0.78 : 1 }]}>{icon ? <Ionicons color={color} name={icon} size={18} /> : null}<Text style={[styles.label, { color }]}>{children}</Text></Pressable>;
}

const styles = StyleSheet.create({ button: { alignItems: "center", borderRadius: radii.pill, borderWidth: 1, flexDirection: "row", gap: spacing.xs, justifyContent: "center", minHeight: 48, paddingHorizontal: spacing.md }, label: { fontSize: 15, fontWeight: "800" } });
