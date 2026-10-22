import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function Screen({ children }: PropsWithChildren) {
  const colors = useAppTheme();

  return <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 120 },
  inner: { gap: spacing.lg, padding: spacing.lg }
});
