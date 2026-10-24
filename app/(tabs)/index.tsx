import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import type { Item } from "@/src/features/items/domain/item";
import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { useReviewRepository } from "@/src/features/review/data/useReviewRepository";
import type { ReviewSession } from "@/src/features/review/domain/review";
import { useProjectRepository } from "@/src/features/projects/data/useProjectRepository";
import { Card } from "@/src/shared/ui/Card";
import { ActionButton } from "@/src/shared/ui/ActionButton";
import { Motion } from "@/src/shared/ui/Motion";

export default function NowScreen() {
  const colors = useAppTheme();
  const repository = useItemRepository();
  const reviewRepository = useReviewRepository();
  const projectRepository = useProjectRepository();
  const [focused, setFocused] = useState<Item[]>([]);
  const [available, setAvailable] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [undo, setUndo] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewSessions, setReviewSessions] = useState<ReviewSession[]>([]);
  const [summary, setSummary] = useState({ inbox: 0, projects: 0 });
  const today = localDate();
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setFocused(await repository.listFocusedNextActions(today));
       setAvailable(await repository.listNextActionsAvailableNow(today));
       const [weekly, recovery, inbox, projects] = await Promise.all([reviewRepository.getInProgress("WEEKLY"), reviewRepository.getInProgress("RECOVERY"), repository.listInboxItems(), projectRepository.listProjects()]);
       setReviewSessions([weekly, recovery].filter((session): session is ReviewSession => session !== null));
       setSummary({ inbox: inbox.length, projects: projects.length });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar Ahora.");
    } finally {
      setLoading(false);
    }
  }, [projectRepository, repository, reviewRepository, today]);
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
      <Text style={[styles.greeting, { color: colors.textSecondary }]}>Buen día</Text>
      <View style={styles.chips}><SummaryChip icon="sunny-outline" label={`${focused.length} en foco`} colors={colors} /><SummaryChip icon="file-tray-outline" label={`${summary.inbox} en bandeja`} colors={colors} /><SummaryChip icon="layers-outline" label={`${summary.projects} proyectos`} colors={colors} /></View>
      {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
      {loading ? <ActivityIndicator accessibilityLabel="Cargando Ahora" color={colors.primary} /> : null}
      {!loading && !focused.length && !available.length && !error ? <EmptyState message="Todavía no elegiste en qué enfocarte. Explora tus siguientes acciones." /> : null}
      <Section title="Siguientes acciones" colors={colors}>
        {focused.map((item) => <Motion key={item.id}><ActionCard item={item} focused colors={colors} onToggleFocus={() => void toggleFocus(item)} onComplete={() => void complete(item)} /></Motion>)}
      </Section>
      <Section title={`Todas las siguientes · ${available.length}`} colors={colors}>
        {available.map((item) => <Motion key={item.id}><ActionCard item={item} focused={focused.some((focusedItem) => focusedItem.id === item.id)} colors={colors} onToggleFocus={() => void toggleFocus(item)} onComplete={() => void complete(item)} /></Motion>)}
      </Section>
      {undo ? <Pressable accessibilityRole="button" onPress={() => void undoCompletion()}><Text style={{ color: colors.primary }}>Deshacer completado: {undo.title}</Text></Pressable> : null}
      <Card tone="soft"><View style={styles.inboxHeading}><View><Text style={[styles.heading, { color: colors.text }]}>Bandeja</Text><Text style={{ color: colors.textSecondary }}>{summary.inbox} {summary.inbox === 1 ? "captura pendiente" : "capturas pendientes"}</Text></View><ActionButton icon="arrow-forward" variant="secondary" onPress={() => router.push("/(tabs)/inbox")}>Abrir</ActionButton></View></Card>
      <Card tone="soft"><Text style={[styles.heading, { color: colors.text }]}>Mantener el sistema claro</Text><Text style={{ color: colors.textSecondary }}>Revisá tus pendientes o volvé a organizarte cuando lo necesites.</Text><View style={styles.actions}><ActionButton icon="refresh-outline" onPress={() => router.push("/review")}>{reviewSessions.some((session) => session.kind === "WEEKLY") ? "Continuar revisión" : "Iniciar revisión"}</ActionButton><ActionButton icon="sparkles-outline" variant="secondary" onPress={() => router.push("/recovery")}>{reviewSessions.some((session) => session.kind === "RECOVERY") ? "Continuar recuperación" : "Volver a organizarme"}</ActionButton></View></Card>
    </Screen>
  );
}

function localDate(): string { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }

function Section({ title, children, colors }: { title: string; children: React.ReactNode; colors: ReturnType<typeof useAppTheme> }) {
  return <View style={styles.section}><Text style={[styles.heading, { color: colors.text }]}>{title}</Text>{children}</View>;
}

function SummaryChip({ icon, label, colors }: { icon: keyof typeof Ionicons.glyphMap; label: string; colors: ReturnType<typeof useAppTheme> }) { return <View style={[styles.chip, { backgroundColor: colors.surfaceSoft }]}><Ionicons color={colors.primary} name={icon} size={18} /><Text style={{ color: colors.text, fontWeight: "700" }}>{label}</Text></View>; }

function ActionCard({ item, focused, colors, onToggleFocus, onComplete }: { item: Item; focused: boolean; colors: ReturnType<typeof useAppTheme>; onToggleFocus: () => void; onComplete: () => void }) {
  return <Card>
    <Pressable accessibilityRole="button" accessibilityLabel={`Abrir ${item.title}`} onPress={() => router.push(`/item/${item.id}`)}><Text style={[styles.title, { color: colors.text }]}>{item.title}</Text></Pressable>
    {item.projectId ? <Text style={{ color: colors.textSecondary }}>Proyecto</Text> : null}
    {item.dueAt ? <Text style={{ color: colors.textSecondary }}>Vence: {item.dueAt}</Text> : null}
    <View style={styles.actions}><ActionButton icon={focused ? "remove-circle-outline" : "add-circle-outline"} variant="secondary" onPress={onToggleFocus}>{focused ? "Quitar foco" : "Enfocar hoy"}</ActionButton><ActionButton icon="checkmark" onPress={onComplete}>Completar</ActionButton></View>
  </Card>;
}

const styles = StyleSheet.create({ section: { gap: spacing.sm }, greeting: { fontSize: 17, fontWeight: "700", marginTop: -spacing.md }, heading: { fontSize: 20, fontWeight: "800" }, title: { fontSize: 17, fontWeight: "700", lineHeight: 24 }, actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.xs }, chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, chip: { alignItems: "center", borderRadius: radii.pill, flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, inboxHeading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" } });
