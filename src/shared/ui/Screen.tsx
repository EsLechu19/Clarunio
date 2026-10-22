import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function Screen({ children }: PropsWithChildren) {
  const colors = useAppTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 120 },
  inner: { gap: spacing.lg, padding: spacing.lg }
});
