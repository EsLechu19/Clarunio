import { StyleSheet, Text, View } from "react-native";

import { spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";
import { BrandHeader } from "./BrandHeader";

export function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
  const colors = useAppTheme();

  return (
    <View style={styles.container}>
      <BrandHeader />
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xl },
  copy: { gap: spacing.sm },
  title: { fontSize: 32, fontWeight: "800" },
  subtitle: { fontSize: 16, lineHeight: 24 }
});
