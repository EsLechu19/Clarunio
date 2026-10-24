import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { router } from "expo-router";
import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { Card } from "@/src/shared/ui/Card";
import { Motion } from "@/src/shared/ui/Motion";
import { spacing } from "@/src/shared/theme/tokens";

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
      {!loading && !error && items.length > 0 ? <View style={{ gap: spacing.sm }}>{items.map((item) => <Motion key={item.id}><Card><Pressable accessibilityLabel={`Aclarar ${item.title}`} accessibilityRole="button" onPress={() => router.push(`/clarify/${item.id}`)}><View style={{ alignItems: "center", flexDirection: "row", gap: spacing.sm }}><Ionicons color={colors.primary} name="bulb-outline" size={24} /><View style={{ flex: 1, gap: 4 }}><Text style={{ color: colors.text, fontSize: 16, fontWeight: "800" }}>{item.title}</Text><Text style={{ color: colors.textSecondary }}>Captura pendiente · {new Date(item.createdAt).toLocaleDateString("es-AR")}</Text></View><Ionicons color={colors.textSecondary} name="chevron-forward" size={20} /></View></Pressable></Card></Motion>)}</View> : null}
    </Screen>
  );
}
