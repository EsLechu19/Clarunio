import { StyleSheet, Text, View } from "react-native";

import { spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function BrandHeader() {
  const colors = useAppTheme();

  return (
    <View style={styles.container} accessibilityRole="header">
      <View style={[styles.mark, { backgroundColor: colors.primary }]}>
        <Text style={styles.markText}>C</Text>
      </View>
      <Text style={[styles.name, { color: colors.text }]}>Clarunio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", gap: spacing.sm },
  mark: { alignItems: "center", borderRadius: 10, height: 36, justifyContent: "center", width: 36 },
  markText: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  name: { fontSize: 18, fontWeight: "700" }
});
