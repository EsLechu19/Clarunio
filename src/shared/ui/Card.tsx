import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function Card({ children, tone = "surface" }: PropsWithChildren<{ tone?: "surface" | "soft" }>) {
  const colors = useAppTheme();
  return <View style={[styles.card, { backgroundColor: tone === "soft" ? colors.surfaceSoft : colors.surface, borderColor: colors.outline }]}>{children}</View>;
}

const styles = StyleSheet.create({ card: { borderRadius: radii.card, borderWidth: 1, elevation: 1, gap: spacing.sm, padding: spacing.md, shadowColor: "#2C1A63", shadowOffset: { height: 3, width: 0 }, shadowOpacity: 0.06, shadowRadius: 10 } });
