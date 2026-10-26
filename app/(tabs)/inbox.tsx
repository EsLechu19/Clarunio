import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";
import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { Motion } from "@/src/shared/ui/Motion";
import { spacing } from "@/src/shared/theme/tokens";
import { ActionButton } from "@/src/shared/ui/ActionButton";
import { InboxItemRow } from "@/src/shared/ui/InboxItemRow";

export default function InboxScreen() {
  const repository = useItemRepository();
  const colors = useAppTheme();
  const [items, setItems] = useState<Awaited<ReturnType<typeof repository.listInboxItems>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setItems(await repository.listInboxItems());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useFocusEffect(useCallback(() => { void loadItems(); }, [loadItems]));

  return (
    <Screen>
      <PageHero title="Bandeja" subtitle="Sacá todo de tu cabeza. Procesá una captura a la vez." />
      <View style={styles.actions}>
        <ActionButton icon="add" onPress={() => router.push("/capture")}>Capturar ahora</ActionButton>
        {!loading && !error ? <Text style={[styles.summary, { color: colors.textSecondary }]}>{items.length} {items.length === 1 ? "captura pendiente" : "capturas pendientes"}</Text> : null}
      </View>
      {loading ? <ActivityIndicator color={colors.primary} accessibilityLabel="Cargando bandeja" /> : null}
      {!loading && error ? <Pressable accessibilityRole="button" accessibilityLabel="Reintentar carga de bandeja" onPress={() => void loadItems()}><Text style={{ color: colors.error }}>No se pudo cargar la bandeja. Intenta otra vez.</Text></Pressable> : null}
      {!loading && !error && items.length === 0 ? <EmptyState actionLabel="Capturar algo" icon="file-tray-outline" mascot="empty" message="Tu bandeja está lista. Capturá algo para sacarlo de tu cabeza y aclararlo después." onAction={() => router.push("/capture")} /> : null}
      {!loading && !error && items.length > 0 ? <View style={styles.list}>{items.map((item) => <Motion key={item.id}><InboxItemRow item={item} /></Motion>)}</View> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { alignItems: "flex-start", gap: spacing.sm },
  summary: { fontSize: 14, fontWeight: "700" },
  list: { gap: spacing.sm }
});
