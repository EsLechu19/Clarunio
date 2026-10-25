import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";
import { BrandHeader } from "./BrandHeader";
import { BackButton } from "./BackButton";
import { useResponsive } from "./useResponsive";

export function PageHero({ title, subtitle, greeting, showBack = false, backLabel = "Volver", backFallback = "/(tabs)" }: { title: string; subtitle: string; greeting?: string; showBack?: boolean; backLabel?: string; backFallback?: "/(tabs)" }) {
  const colors = useAppTheme();
  const responsive = useResponsive();

  return (
    <View style={styles.container}>
      <View style={styles.header}>{showBack ? <BackButton fallback={backFallback} label={backLabel} /> : <View style={styles.backPlaceholder} />}<View style={styles.brand}><BrandHeader /></View><View style={styles.tools}><Pressable accessibilityLabel="Buscar" accessibilityRole="button" onPress={() => router.navigate("/search")} style={styles.tool}><Ionicons color={colors.primary} name="search-outline" size={22} /></Pressable><Pressable accessibilityLabel="Ajustes" accessibilityRole="button" onPress={() => router.navigate("/settings")} style={styles.tool}><Ionicons color={colors.primary} name="settings-outline" size={22} /></Pressable></View></View>
      <View style={styles.copy}>
        {greeting ? <View style={styles.greeting}><Ionicons color={colors.primary} name="sunny-outline" size={18} /><Text style={[styles.greetingText, { color: colors.textSecondary }]}>{greeting}</Text></View> : null}
        <Text style={[styles.title, { color: colors.text, fontSize: responsive.titleSize, lineHeight: responsive.isCompact ? 36 : 42 }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  header: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  brand: { alignItems: "center", flex: 1, minWidth: 0 },
  tools: { flexDirection: "row", gap: spacing.md },
  tool: { alignItems: "center", justifyContent: "center", minHeight: 44, minWidth: 40 },
  backPlaceholder: { minWidth: 48 },
  copy: { gap: spacing.sm },
  greeting: { alignItems: "center", flexDirection: "row", gap: spacing.xs },
  greetingText: { fontSize: 16, fontWeight: "700" },
  title: { fontSize: 36, fontWeight: "900", letterSpacing: -0.7, lineHeight: 42 },
  subtitle: { fontSize: 16, lineHeight: 24 }
});
