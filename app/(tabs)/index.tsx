import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import type { Item } from "@/src/features/items/domain/item";
import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";

export default function NowScreen() {
  const colors = useAppTheme();
  const repository = useItemRepository();
  const [focused, setFocused] = useState<Item[]>([]);
  const [available, setAvailable] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [undo, setUndo] = useState<Item | null>(null);
  const today = localDate();
  const load = useCallback(async () => {
    try {
      setError(null);
      setFocused(await repository.listFocusedNextActions(today));
      setAvailable(await repository.listNextActionsAvailableNow(today));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar Ahora.");
    }
  }, [repository, today]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  async function toggleFocus(item: Item) {
    try {
      if (focused.some((focusedItem) => focusedItem.id === item.id)) await repository.removeFocus(item.id, today);
      else await repository.addFocus(item.id, today);
      await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo actualizar el foco."); }
  }

  async function complete(item: Item) {
    try { setUndo(await repository.completeAction(item.id)); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo completar la acción."); }
  }

  async function undoCompletion() {
    if (!undo) return;
    try { await repository.undoCompletion(undo.id); setUndo(null); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo deshacer."); }
  }

  return (
    <Screen>
      <PageHero title="¿Qué sigue?" subtitle="Un paso a la vez, en lo que importa." />
      {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
      {!focused.length && !available.length && !error ? <EmptyState message="Todavía no elegiste en qué enfocarte. Explora tus siguientes acciones." /> : null}
      <Section title={`En enfoque · ${focused.length}`} colors={colors}>
        {focused.map((item) => <ActionCard key={item.id} item={item} focused colors={colors} onToggleFocus={() => void toggleFocus(item)} onComplete={() => void complete(item)} />)}
      </Section>
      <Section title={`Todas las siguientes · ${available.length}`} colors={colors}>
        {available.map((item) => <ActionCard key={item.id} item={item} focused={focused.some((focusedItem) => focusedItem.id === item.id)} colors={colors} onToggleFocus={() => void toggleFocus(item)} onComplete={() => void complete(item)} />)}
      </Section>
      {undo ? <Pressable accessibilityRole="button" onPress={() => void undoCompletion()}><Text style={{ color: colors.primary }}>Deshacer completado: {undo.title}</Text></Pressable> : null}
    </Screen>
  );
}

function localDate(): string { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }

function Section({ title, children, colors }: { title: string; children: React.ReactNode; colors: ReturnType<typeof useAppTheme> }) {
  return <View style={styles.section}><Text style={[styles.heading, { color: colors.text }]}>{title}</Text>{children}</View>;
}

function ActionCard({ item, focused, colors, onToggleFocus, onComplete }: { item: Item; focused: boolean; colors: ReturnType<typeof useAppTheme>; onToggleFocus: () => void; onComplete: () => void }) {
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Abrir ${item.title}`} onPress={() => router.push(`/item/${item.id}`)}><Text style={[styles.title, { color: colors.text }]}>{item.title}</Text></Pressable>
    {item.projectId ? <Text style={{ color: colors.textSecondary }}>Proyecto</Text> : null}
    {item.dueAt ? <Text style={{ color: colors.textSecondary }}>Vence: {item.dueAt}</Text> : null}
    <View style={styles.actions}><Pressable accessibilityRole="button" onPress={onToggleFocus}><Text style={{ color: colors.primary }}>{focused ? "Quitar foco" : "Enfocar hoy"}</Text></Pressable><Pressable accessibilityRole="button" onPress={onComplete}><Text style={{ color: colors.primary }}>Completar</Text></Pressable></View>
  </View>;
}

const styles = StyleSheet.create({ section: { gap: spacing.sm }, heading: { fontSize: 20, fontWeight: "800" }, card: { borderRadius: radii.card, borderWidth: 1, gap: spacing.xs, padding: spacing.md }, title: { fontSize: 17, fontWeight: "700", lineHeight: 24 }, actions: { flexDirection: "row", gap: spacing.lg, marginTop: spacing.xs } });
