import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useReviewRepository } from "@/src/features/review/data/useReviewRepository";
import { REVIEW_STEPS, type ReviewSession, type ReviewStep, type ReviewSummary } from "@/src/features/review/domain/review";
import { Screen } from "@/src/shared/ui/Screen";
import { PageHero } from "@/src/shared/ui/PageHero";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";

const LABELS: Record<ReviewStep, string> = { INBOX: "Bandeja", NEXT: "Siguientes", WAITING: "Esperando", PROJECTS: "Proyectos", SCHEDULED_SOMEDAY: "Programadas y algún día", CLOSURE: "Cierre" };

export default function ReviewScreen() {
  const colors = useAppTheme();
  const repository = useReviewRepository();
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [items, setItems] = useState<Array<{ id: string; title: string; state: string }>>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const today = localDate();
  const load = useCallback(async () => {
    try {
      setStatus("loading"); setError(null);
      const loadedSummary = await repository.getSummary(today);
      const loadedSession = await repository.resumeOrCreate("WEEKLY", loadedSummary);
      setSummary(loadedSummary); setSession(loadedSession);
      setItems(await repository.listStepItems(loadedSession.currentStep, today));
      setStatus("ready");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cargar la revisión."); setStatus("error"); }
  }, [repository, today]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  async function next() {
    if (!session || !summary) return;
    try { const updated = await repository.advance(session, summary); setSession(updated); setItems(await repository.listStepItems(updated.currentStep, today)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo avanzar la revisión."); }
  }
  async function finish() { if (!session || !summary) return; try { setSession(await repository.complete(session, summary)); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo terminar la revisión."); } }
  async function cancel() { if (!session) return; try { await repository.cancel(session); router.back(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cancelar la revisión."); } }
  async function pause() { if (!session) return; try { await repository.pause(session); router.back(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo pausar la revisión."); } }

  if (status === "loading") return <Screen><ActivityIndicator accessibilityLabel="Cargando revisión" color={colors.primary} /></Screen>;
  if (status === "error") return <Screen><Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text><Pressable accessibilityRole="button" onPress={() => void load()}><Text style={{ color: colors.primary }}>Reintentar</Text></Pressable></Screen>;
  if (!session || !summary) return null;
  const stepIndex = REVIEW_STEPS.indexOf(session.currentStep);
  const isClosure = session.currentStep === "CLOSURE";
  return <Screen>
    <PageHero title="Revisión semanal" subtitle="Comprobemos que tus pendientes siguen claros y actualizados." />
    <Text style={{ color: colors.textSecondary }}>Etapa {stepIndex + 1} de {REVIEW_STEPS.length}: {LABELS[session.currentStep]}</Text>
     <View accessibilityLabel={`Progreso de revisión: etapa ${stepIndex + 1} de ${REVIEW_STEPS.length}`} accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: REVIEW_STEPS.length, now: stepIndex + 1 }} style={[styles.progress, { backgroundColor: colors.outline }]}><View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${((stepIndex + 1) / REVIEW_STEPS.length) * 100}%` }]} /></View>
    {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
      <Text style={[styles.heading, { color: colors.text }]}>{LABELS[session.currentStep]}</Text>
      {isClosure ? <Text style={{ color: colors.textSecondary }}>Resumen real: {summary.inbox} en bandeja, {summary.next} siguientes, {summary.waiting} esperando, {summary.projectsWithoutNext} proyectos sin siguiente acción y {summary.scheduledSomeday} programadas o algún día.</Text> : items.length ? items.map((item) => <Text key={item.id} style={{ color: colors.text }}>• {item.title}</Text>) : <Text style={{ color: colors.textSecondary }}>No hay elementos pendientes en esta etapa.</Text>}
    </View>
    <View style={styles.actions}>
      {isClosure ? <Pressable accessibilityRole="button" onPress={() => void finish()}><Text style={{ color: colors.primary }}>Terminar revisión</Text></Pressable> : <Pressable accessibilityRole="button" onPress={() => void next()}><Text style={{ color: colors.primary }}>Siguiente etapa</Text></Pressable>}
      <Pressable accessibilityRole="button" onPress={() => void pause()}><Text style={{ color: colors.primary }}>Pausar</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={() => void cancel()}><Text style={{ color: colors.error }}>Cancelar</Text></Pressable>
    </View>
    {session.state === "COMPLETED" ? <Text style={{ color: colors.success }}>Revisión terminada. Quedaron visibles los asuntos abiertos.</Text> : null}
  </Screen>;
}

function localDate(): string { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
const styles = StyleSheet.create({ card: { borderRadius: radii.card, borderWidth: 1, gap: spacing.sm, padding: spacing.md }, heading: { fontSize: 20, fontWeight: "800" }, progress: { height: 8, borderRadius: radii.pill, backgroundColor: "#E7E0F2", overflow: "hidden" }, progressFill: { height: "100%" }, actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.lg } });
