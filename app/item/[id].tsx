import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import type { Item } from "@/src/features/items/domain/item";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { spacing } from "@/src/shared/theme/tokens";

export default function ItemDetailScreen() {
  const colors = useAppTheme();
  const repository = useItemRepository();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [availableFrom, setAvailableFrom] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { try { if (!id) throw new Error("No se indicó la acción."); const loaded = await repository.getItemById(id); if (!loaded) throw new Error("No se encontró la acción."); setItem(loaded); setAvailableFrom(loaded.availableFrom ?? ""); setDueAt(loaded.dueAt ?? ""); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cargar la acción."); } }, [id, repository]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  if (!item) return <View style={[styles.center, { backgroundColor: colors.background }]}>{error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : <ActivityIndicator color={colors.primary} accessibilityLabel="Cargando acción" />}</View>;
  const currentItem = item;
  async function schedule() { try { await repository.scheduleNextAction(currentItem.id, availableFrom); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo programar la acción."); } }
  async function saveDue() { try { const updated = dueAt.trim() ? await repository.setDueAt(currentItem.id, dueAt) : await repository.clearDueAt(currentItem.id); setItem(updated); setError(null); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar el vencimiento."); } }
  return <View style={[styles.container, { backgroundColor: colors.background }]}><Pressable onPress={() => router.back()}><Text style={{ color: colors.primary }}>‹ Ahora</Text></Pressable><Text style={[styles.title, { color: colors.text }]}>{item.title}</Text><Text style={{ color: colors.textSecondary }}>Estado: {item.state}</Text>{error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}<Text style={{ color: colors.text }}>Disponible desde</Text><TextInput accessibilityLabel="Fecha de disponibilidad" placeholder="AAAA-MM-DD" value={availableFrom} onChangeText={setAvailableFrom} style={[styles.input, { color: colors.text, borderColor: colors.outline, backgroundColor: colors.surface }]} /><Button label="Programar" colors={colors} onPress={() => void schedule()} disabled={item.state !== "NEXT"} /><Text style={{ color: colors.text }}>Vencimiento (opcional)</Text><TextInput accessibilityLabel="Fecha de vencimiento" placeholder="AAAA-MM-DD o fecha ISO" value={dueAt} onChangeText={setDueAt} style={[styles.input, { color: colors.text, borderColor: colors.outline, backgroundColor: colors.surface }]} /><Button label="Guardar vencimiento" colors={colors} onPress={() => void saveDue()} /><Pressable accessibilityRole="button" onPress={() => { setDueAt(""); void saveDue(); }}><Text style={{ color: colors.primary }}>Quitar vencimiento</Text></Pressable></View>;
}

function Button({ label, colors, onPress, disabled = false }: { label: string; colors: ReturnType<typeof useAppTheme>; onPress: () => void; disabled?: boolean }) { return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={{ backgroundColor: colors.primary, borderRadius: 28, minHeight: 52, justifyContent: "center", opacity: disabled ? 0.5 : 1, padding: spacing.md }}><Text style={styles.buttonText}>{label}</Text></Pressable>; }
const styles = StyleSheet.create({ container: { flex: 1, gap: spacing.md, padding: spacing.lg, paddingTop: spacing.xl }, center: { alignItems: "center", flex: 1, justifyContent: "center", padding: spacing.lg }, title: { fontSize: 30, fontWeight: "800" }, input: { borderRadius: 12, borderWidth: 1, fontSize: 16, minHeight: 52, padding: spacing.md }, buttonText: { color: "#FFF", fontSize: 16, fontWeight: "700", textAlign: "center" } });
