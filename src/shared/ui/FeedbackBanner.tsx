import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, ReduceMotion, useReducedMotion } from "react-native-reanimated";

import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export type FeedbackVariant = "success" | "warning" | "error";
type Props = { message: string; variant: FeedbackVariant; onDismiss: () => void };

export function FeedbackBanner({ message, variant, onDismiss }: Props) {
  const colors = useAppTheme();
  const reducedMotion = useReducedMotion();
  useEffect(() => { const timeout = setTimeout(onDismiss, 3600); return () => clearTimeout(timeout); }, [message, onDismiss]);
  const icon = variant === "success" ? "checkmark-circle-outline" : variant === "warning" ? "warning-outline" : "alert-circle-outline";
  const accent = variant === "success" ? colors.success : variant === "warning" ? (colors.text === "#F7F2FF" ? "#F2B765" : "#9A5B00") : colors.error;
  return <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(180).reduceMotion(ReduceMotion.System)} exiting={reducedMotion ? undefined : FadeOut.duration(140).reduceMotion(ReduceMotion.System)}><View accessibilityRole="alert" style={[styles.container, { backgroundColor: colors.surface, borderColor: accent }]}><Ionicons color={accent} name={icon} size={22} /><Text style={[styles.message, { color: colors.text }]}>{message}</Text><Pressable accessibilityLabel="Cerrar aviso" accessibilityRole="button" hitSlop={8} onPress={onDismiss} style={styles.close}><Ionicons color={colors.textSecondary} name="close" size={20} /></Pressable></View></Animated.View>;
}

const styles = StyleSheet.create({ container: { alignItems: "center", borderRadius: radii.input, borderWidth: 1, flexDirection: "row", gap: spacing.sm, padding: spacing.md }, message: { flex: 1, fontSize: 14, fontWeight: "700", lineHeight: 20 }, close: { alignItems: "center", justifyContent: "center", minHeight: 32, minWidth: 32 } });
