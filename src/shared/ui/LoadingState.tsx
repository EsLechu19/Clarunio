import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { ReduceMotion, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function LoadingState({ message, accessibilityLabel = message, skeleton = false }: { message: string; accessibilityLabel?: string; skeleton?: boolean }) {
  const colors = useAppTheme();
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = reducedMotion ? 1 : withRepeat(withSequence(withTiming(0.55, { duration: 650 }), withTiming(1, { duration: 650 })), -1, true, undefined, ReduceMotion.System);
  }, [opacity, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View accessibilityLabel={accessibilityLabel} accessibilityRole="progressbar" style={[styles.container, { backgroundColor: colors.surfaceSoft, borderColor: colors.outline }]}>
      {skeleton ? <Animated.View style={[styles.skeleton, animatedStyle]}><View style={[styles.line, { backgroundColor: colors.outline }]} /><View style={[styles.line, styles.shortLine, { backgroundColor: colors.outline }]} /></Animated.View> : null}
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", borderRadius: radii.card, borderWidth: 1, gap: spacing.sm, padding: spacing.md },
  skeleton: { alignSelf: "stretch", gap: spacing.xs },
  line: { borderRadius: radii.pill, height: 12, width: "100%" },
  shortLine: { width: "62%" },
  message: { fontSize: 16, lineHeight: 24, textAlign: "center" }
});
