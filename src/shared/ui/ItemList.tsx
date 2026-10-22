import { StyleSheet, Text, View } from "react-native";

import type { Item } from "@/src/features/items/domain/item";
import { radii, spacing } from "../theme/tokens";
import { useAppTheme } from "../theme/useAppTheme";

export function ItemList({ items }: { items: Item[] }) {
  const colors = useAppTheme();
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item.id} style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
          <Text style={[styles.marker, { color: colors.primary }]}>✦</Text>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        </View>
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
