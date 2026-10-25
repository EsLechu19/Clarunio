import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";
import { useResponsive } from "./useResponsive";

export function Screen({ children }: PropsWithChildren) {
  const colors = useAppTheme();
  const responsive = useResponsive();

  return <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: responsive.contentBottomPadding }]} keyboardShouldPersistTaps="handled">
      <View style={[styles.inner, { paddingHorizontal: responsive.horizontalPadding }]}>{children}</View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1 },
  inner: { gap: spacing.lg, paddingVertical: spacing.lg }
});
