import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import { ItemList } from "@/src/shared/ui/ItemList";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";

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
      <PageHero title="Bandeja" subtitle={loading ? "Cargando tus capturas..." : error ? "No se pudo cargar la bandeja." : `${items.length} ${items.length === 1 ? "captura pendiente" : "capturas pendientes"}.`} />
      {loading ? <ActivityIndicator color={colors.primary} accessibilityLabel="Cargando bandeja" /> : null}
      {!loading && error ? <Pressable accessibilityRole="button" accessibilityLabel="Reintentar carga de bandeja" onPress={() => void loadItems()}><Text style={{ color: colors.error }}>No se pudo cargar la bandeja. Intenta otra vez.</Text></Pressable> : null}
      {!loading && !error && items.length === 0 ? <EmptyState message="Todo lo que capturaste ya tiene un lugar. Puedes anotar algo nuevo cuando quieras." /> : null}
      {!loading && !error && items.length > 0 ? <ItemList items={items} /> : null}
    </Screen>
  );
}
