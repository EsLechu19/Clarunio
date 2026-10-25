import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function navigateBack(fallback: Href) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}

export function BackButton({ fallback, label = "Volver", variant = "back", showLabel = false, onPress }: { fallback: Href; label?: string; variant?: "back" | "close"; showLabel?: boolean; onPress?: () => void }) {
  const colors = useAppTheme();
  return <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress ?? (() => navigateBack(fallback))} style={({ pressed }) => [styles.button, pressed && { backgroundColor: colors.primarySoft }]}>
    <Ionicons color={colors.primary} name={variant === "close" ? "close" : "arrow-back"} size={24} />
    {showLabel ? <Text style={[styles.label, { color: colors.primary }]}>{label}</Text> : null}
  </Pressable>;
}

const styles = StyleSheet.create({
  button: { alignItems: "center", borderRadius: 999, flexDirection: "row", gap: spacing.xs, justifyContent: "center", minHeight: 48, minWidth: 48, paddingHorizontal: spacing.xs },
  label: { fontSize: 15, fontWeight: "800" },
});
