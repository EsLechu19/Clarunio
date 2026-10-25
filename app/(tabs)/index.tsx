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
import { Motion } from "@/src/shared/ui/Motion";
import { excludeFocusedActions } from "@/src/shared/ui/nowPresentation";

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
      <PageHero greeting="Buen día" title="¿Qué sigue?" subtitle="Un paso a la vez, en lo que importa." />
      <View style={styles.chips}><SummaryChip icon="sunny-outline" label={`${focused.length} en foco`} colors={colors} /><SummaryChip icon="file-tray-outline" label={`${summary.inbox} en bandeja`} colors={colors} /><SummaryChip icon="layers-outline" label={`${summary.projects} proyectos`} colors={colors} /></View>
      {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
      {loading ? <ActivityIndicator accessibilityLabel="Cargando Ahora" color={colors.primary} /> : null}
      {!loading && !focused.length && !available.length && !error ? <EmptyState message="Todavía no elegiste en qué enfocarte. Explora tus siguientes acciones." /> : null}
      {!loading && (focused.length || available.length) ? <Section title="Siguientes acciones" colors={colors}>
        {focused.map((item) => <Motion key={item.id}><ActionCard item={item} focused colors={colors} onToggleFocus={() => void toggleFocus(item)} onComplete={() => void complete(item)} /></Motion>)}
        {focused.length && available.length ? <Text style={[styles.subheading, { color: colors.textSecondary }]}>Disponibles</Text> : null}
        {excludeFocusedActions(focused, available).map((item) => <Motion key={item.id}><ActionCard item={item} focused={false} colors={colors} onToggleFocus={() => void toggleFocus(item)} onComplete={() => void complete(item)} /></Motion>)}
      </Section> : null}
      {undo ? <Pressable accessibilityRole="button" onPress={() => void undoCompletion()}><Text style={{ color: colors.primary }}>Deshacer completado: {undo.title}</Text></Pressable> : null}
       <Card tone="soft"><View style={styles.moduleRow}><View style={[styles.moduleIcon, { backgroundColor: colors.primarySoft }]}><Ionicons color={colors.primary} name="file-tray-outline" size={24} /></View><View style={styles.moduleCopy}><Text style={[styles.heading, { color: colors.text }]}>Bandeja</Text><Text style={{ color: colors.textSecondary }}>{summary.inbox} {summary.inbox === 1 ? "captura pendiente" : "capturas pendientes"}</Text></View><Pressable accessibilityLabel="Abrir bandeja" accessibilityRole="button" onPress={() => router.push("/(tabs)/inbox")} style={styles.iconButton}><Ionicons color={colors.primary} name="arrow-forward" size={21} /></Pressable></View></Card>
       <Card tone="soft"><View style={styles.moduleRow}><View style={[styles.moduleIcon, { backgroundColor: colors.primarySoft }]}><Ionicons color={colors.primary} name="hourglass-outline" size={24} /></View><View style={styles.moduleCopy}><Text style={[styles.heading, { color: colors.text }]}>Esperando</Text><Text style={{ color: colors.textSecondary }}>Respuestas y resultados pendientes.</Text></View><Pressable accessibilityLabel="Abrir Esperando" accessibilityRole="button" onPress={() => router.navigate("/waiting")} style={styles.iconButton}><Ionicons color={colors.primary} name="arrow-forward" size={21} /></Pressable></View></Card>
      <Card tone="soft"><View style={styles.moduleRow}><View style={[styles.moduleIcon, { backgroundColor: colors.primarySoft }]}><Ionicons color={colors.primary} name={reviewSessions.some((session) => session.kind === "RECOVERY") && !reviewSessions.some((session) => session.kind === "WEEKLY") ? "refresh-outline" : "checkmark-done-outline"} size={24} /></View><View style={styles.moduleCopy}><Text style={[styles.heading, { color: colors.text }]}>{reviewSessions.some((session) => session.kind === "RECOVERY") && !reviewSessions.some((session) => session.kind === "WEEKLY") ? "Volver a organizarme" : "Revisión semanal"}</Text><Text style={{ color: colors.textSecondary }}>Un momento breve para mantener tus pendientes claros.</Text></View><Pressable accessibilityLabel="Abrir revisión o recuperación" accessibilityRole="button" onPress={() => router.push(reviewSessions.some((session) => session.kind === "RECOVERY") && !reviewSessions.some((session) => session.kind === "WEEKLY") ? "/recovery" : "/review")} style={styles.iconButton}><Ionicons color={colors.primary} name="arrow-forward" size={21} /></Pressable></View></Card>
    </Screen>
  );
}

function localDate(): string { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }

function Section({ title, children, colors }: { title: string; children: React.ReactNode; colors: ReturnType<typeof useAppTheme> }) {
  return <View style={styles.section}><Text style={[styles.heading, { color: colors.text }]}>{title}</Text>{children}</View>;
}

function SummaryChip({ icon, label, colors }: { icon: keyof typeof Ionicons.glyphMap; label: string; colors: ReturnType<typeof useAppTheme> }) { return <View style={[styles.chip, { backgroundColor: colors.surfaceSoft }]}><Ionicons color={colors.primary} name={icon} size={18} /><Text style={{ color: colors.text, fontWeight: "700" }}>{label}</Text></View>; }

function ActionCard({ item, focused, colors, onToggleFocus, onComplete }: { item: Item; focused: boolean; colors: ReturnType<typeof useAppTheme>; onToggleFocus: () => void; onComplete: () => void }) {
  return <View style={[styles.actionRow, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Abrir ${item.title}`} onPress={() => router.push(`/item/${item.id}`)} style={styles.actionMain}>
      <Ionicons color={focused ? colors.primary : colors.outline} name={focused ? "checkbox-outline" : "square-outline"} size={24} />
      <View style={styles.actionCopy}><Text style={[styles.title, { color: colors.text }]}>{item.title}</Text><Text style={[styles.metadata, { color: colors.textSecondary }]}>{item.projectId ? "Proyecto" : "Siguiente acción"}{focused ? " · En foco" : " · Disponible"}</Text></View>
      {item.dueAt ? <Text style={[styles.due, { color: colors.textSecondary }]}>{formatDueAt(item.dueAt)}</Text> : null}
    </Pressable>
    <View style={styles.rowActions}><Pressable accessibilityLabel={focused ? `Quitar ${item.title} del foco` : `Enfocar ${item.title}`} accessibilityRole="button" onPress={onToggleFocus} style={styles.iconButton}><Ionicons color={colors.primary} name={focused ? "remove-circle-outline" : "add-circle-outline"} size={21} /></Pressable><Pressable accessibilityLabel={`Completar ${item.title}`} accessibilityRole="button" onPress={onComplete} style={styles.iconButton}><Ionicons color={colors.primary} name="checkmark-circle-outline" size={23} /></Pressable></View>
  </View>;
}

function formatDueAt(value: string): string { const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value); return Number.isNaN(date.getTime()) ? `Vence: ${value}` : `Vence ${new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(date).replace(".", "")}`; }

const styles = StyleSheet.create({ section: { gap: spacing.sm }, subheading: { fontSize: 14, fontWeight: "700", marginTop: spacing.sm }, heading: { fontSize: 20, fontWeight: "800" }, title: { fontSize: 16, fontWeight: "700", lineHeight: 22 }, metadata: { fontSize: 13, lineHeight: 18 }, due: { fontSize: 12, fontWeight: "700", marginLeft: spacing.xs }, chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, chip: { alignItems: "center", borderRadius: radii.pill, flexDirection: "row", gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }, actionRow: { alignItems: "center", borderRadius: radii.card, borderWidth: 1, elevation: 1, flexDirection: "row", minHeight: 76, paddingLeft: spacing.md, paddingRight: spacing.xs, shadowColor: "#2C1A63", shadowOpacity: 0.05, shadowRadius: 8 }, actionMain: { alignItems: "center", flex: 1, flexDirection: "row", gap: spacing.sm, minHeight: 64 }, actionCopy: { flex: 1, gap: 2 }, rowActions: { flexDirection: "row" }, iconButton: { alignItems: "center", justifyContent: "center", minHeight: 48, minWidth: 48 }, moduleRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, moduleIcon: { alignItems: "center", borderRadius: radii.pill, height: 44, justifyContent: "center", width: 44 }, moduleCopy: { flex: 1 } });
