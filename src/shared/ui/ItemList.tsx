import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import type { Item } from "@/src/features/items/domain/item";
import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function ItemList({ items }: { items: Item[] }) {
  const colors = useAppTheme();
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <Pressable
          accessibilityLabel={`Aclarar ${item.title}`}
          accessibilityRole="button"
          key={item.id}
          onPress={() => router.push(`/clarify/${item.id}`)}
          style={({ pressed }) => [styles.item, { backgroundColor: colors.surface, borderColor: colors.outline, opacity: pressed ? 0.75 : 1 }]}
        >
          <Text style={[styles.marker, { color: colors.primary }]}>✦</Text>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  item: { alignItems: "center", borderRadius: radii.card, borderWidth: 1, flexDirection: "row", gap: spacing.sm, padding: spacing.md },
  marker: { fontSize: 18 },
  title: { flex: 1, fontSize: 16, lineHeight: 22 }
});
