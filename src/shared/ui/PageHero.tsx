import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";
import { BrandHeader } from "./BrandHeader";

export function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
  const colors = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}><BrandHeader /><View style={styles.tools}><Pressable accessibilityLabel="Buscar" accessibilityRole="button" onPress={() => router.push("/search")}><Ionicons color={colors.primary} name="search-outline" size={22} /></Pressable><Pressable accessibilityLabel="Ajustes" accessibilityRole="button" onPress={() => router.push("/settings")}><Ionicons color={colors.primary} name="settings-outline" size={22} /></Pressable></View></View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xl },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  tools: { flexDirection: "row", gap: spacing.md },
  copy: { gap: spacing.sm },
  title: { fontSize: 32, fontWeight: "800" },
  subtitle: { fontSize: 16, lineHeight: 24 }
});
