import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, router } from "expo-router";

import { useDataRepository } from "@/src/features/items/data/useDataRepository";
import type { Item } from "@/src/features/items/domain/item";
import { PageHero } from "@/src/shared/ui/PageHero";
import { Screen } from "@/src/shared/ui/Screen";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { Card } from "@/src/shared/ui/Card";
import { ActionButton } from "@/src/shared/ui/ActionButton";

export default function DataScreen() {
  const colors = useAppTheme(); const repository = useDataRepository(); const [tab, setTab] = useState<"DONE" | "TRASH">("DONE"); const [items, setItems] = useState<Item[]>([]); const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { try { setLoading(true); setMessage(null); setItems(await repository.list(tab)); } catch (cause) { setMessage(cause instanceof Error ? cause.message : "No se pudieron cargar los datos."); } finally { setLoading(false); } }, [repository, tab]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  function confirmPurge(item: Item) { Alert.alert("Purgar definitivamente", `Se eliminará “${item.title}” sin posibilidad de restaurarlo.`, [{ text: "Cancelar", style: "cancel" }, { text: "Purgar", style: "destructive", onPress: () => { void repository.purge(item.id).then(load).catch((cause) => setMessage(cause instanceof Error ? cause.message : "No se pudo purgar.")); } }]); }
  function confirmDeleteAll() { Alert.alert("Borrar todos mis datos", "Primera confirmación: se eliminarán elementos, proyectos, enfoques y revisiones.", [{ text: "Cancelar", style: "cancel" }, { text: "Continuar", style: "destructive", onPress: () => Alert.alert("Confirmar borrado total", "Segunda confirmación: esta acción no se puede deshacer.", [{ text: "Cancelar", style: "cancel" }, { text: "Borrar todo", style: "destructive", onPress: () => { void repository.deleteAll().then(load).catch((cause) => setMessage(cause instanceof Error ? cause.message : "No se pudo borrar.")); } }]) }]); }
  return <Screen><PageHero title="Completadas y papelera" subtitle="Restaurar es reversible; purgar y borrar todo requieren confirmación." showBack backFallback="/(tabs)" /><View style={styles.tabs}><Pressable accessibilityRole="tab" accessibilityState={{ selected: tab === "DONE" }} onPress={() => setTab("DONE")}><Text style={{ color: tab === "DONE" ? colors.primary : colors.textSecondary }}>Completadas</Text></Pressable><Pressable accessibilityRole="tab" accessibilityState={{ selected: tab === "TRASH" }} onPress={() => setTab("TRASH")}><Text style={{ color: tab === "TRASH" ? colors.primary : colors.textSecondary }}>Papelera</Text></Pressable></View>{loading ? <ActivityIndicator accessibilityLabel="Cargando datos" color={colors.primary} /> : null}{items.map((item) => <Card key={item.id}><Text style={[styles.title, { color: colors.text }]}>{item.title}</Text><View style={styles.actions}><ActionButton icon="refresh-outline" variant="secondary" onPress={() => { void repository.restore(item.id).then(load).catch((cause) => setMessage(cause instanceof Error ? cause.message : "No se pudo restaurar.")); }}>Restaurar</ActionButton><ActionButton icon="trash-outline" variant="danger" onPress={() => confirmPurge(item)}>Purgar</ActionButton></View></Card>)}{!loading && !items.length ? <Text style={{ color: colors.textSecondary }}>No hay elementos en esta lista.</Text> : null}{message ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{message}</Text> : null}<ActionButton icon="settings-outline" variant="secondary" onPress={() => router.push("/settings")}>Volver a ajustes</ActionButton><ActionButton icon="trash-bin-outline" variant="danger" onPress={confirmDeleteAll}>Borrar todos mis datos</ActionButton></Screen>;
}
const styles = StyleSheet.create({ tabs: { flexDirection: "row", gap: spacing.lg }, card: { borderRadius: radii.card, borderWidth: 1, gap: spacing.sm, padding: spacing.md }, title: { fontSize: 17, fontWeight: "700" }, actions: { flexDirection: "row", gap: spacing.lg } });
