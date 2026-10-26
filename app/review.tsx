import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, LinearTransition, ReduceMotion, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";

import { useReviewRepository } from "@/src/features/review/data/useReviewRepository";
import { REVIEW_STEPS, type ReviewDecisionSummary, type ReviewSession, type ReviewStep, type ReviewSummary } from "@/src/features/review/domain/review";
import { getReviewStepCopy, REVIEW_ENTRY_SUMMARY } from "@/src/features/review/reviewPresentation";
import { Screen } from "@/src/shared/ui/Screen";
import { PageHero } from "@/src/shared/ui/PageHero";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { Card } from "@/src/shared/ui/Card";
import { ActionButton } from "@/src/shared/ui/ActionButton";
import { Motion } from "@/src/shared/ui/Motion";
import { getReviewItemRoute } from "@/src/features/review/reviewNavigation";
import { MascotIllustration } from "@/src/shared/ui/MascotIllustration";

export default function ReviewScreen() {
  const colors = useAppTheme();
  const repository = useReviewRepository();
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [items, setItems] = useState<Array<{ id: string; title: string; state: string; decision: "REVIEWED" | "OMITTED" | null }>>([]);
  const [progress, setProgress] = useState<ReviewDecisionSummary>({ reviewed: 0, omitted: 0, undecided: 0, total: 0 });
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const today = localDate();

  const load = useCallback(async () => {
    try {
      setStatus("loading"); setError(null);
      const loadedSummary = await repository.getSummary(today);
      const inProgress = await repository.getInProgress("WEEKLY");
      setSummary(loadedSummary);
      if (!started) setSession(inProgress);
      if (started && session) await loadSession(session, loadedSummary);
      setStatus("ready");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cargar la revisión."); setStatus("error"); }
  }, [repository, session, started, today]);

  const loadSession = useCallback(async (loadedSession: ReviewSession, loadedSummary: ReviewSummary) => {
    setSession(loadedSession);
    const loadedItems = await repository.listStepItems(loadedSession.currentStep, today);
    const decisions = await repository.listDecisions(loadedSession.id, loadedSession.currentStep);
    setItems(loadedItems.map((item) => ({ ...item, decision: decisions.find((decision) => decision.entityId === item.id)?.decision ?? null })));
    setProgress(loadedSession.currentStep === "CLOSURE" ? await repository.getSessionDecisionSummary(loadedSession.id, today) : await repository.getDecisionSummary(loadedSession.id, loadedSession.currentStep, loadedItems.length));
    setSummary(loadedSummary);
  }, [repository, today]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  async function beginReview() {
    if (busy || !summary) return;
    setBusy(true); setError(null);
    try {
      const nextSession = session ?? await repository.resumeOrCreate("WEEKLY", summary);
      setStarted(true);
      await loadSession(nextSession, summary);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo comenzar la revisión."); }
    finally { setBusy(false); }
  }
  async function next() {
    if (busy || !session || !summary) return;
    const continueNext = await confirmIfUndecided();
    if (!continueNext) return;
    setBusy(true);
    try { const updated = await repository.advance(session, summary); await loadSession(updated, summary); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo avanzar la revisión."); }
    finally { setBusy(false); }
  }
  async function finish() { if (busy || !session || !summary) return; const continueFinish = await confirmIfUndecided(); if (!continueFinish) return; setBusy(true); try { setSession(await repository.complete(session, summary)); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo terminar la revisión."); } finally { setBusy(false); } }
  async function cancel() { if (busy || !session) return; setBusy(true); try { await repository.cancel(session); setStarted(false); router.back(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cancelar la revisión."); setBusy(false); } }
  async function pause() { if (busy || !session) return; setBusy(true); try { await repository.pause(session); setStarted(false); router.back(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo pausar la revisión."); setBusy(false); } }
  async function decide(entityId: string, decision: "REVIEWED" | "OMITTED") { if (busy || !session) return; setBusy(true); try { await repository.saveDecision(session, entityId, session.currentStep, decision); await load(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar la decisión."); } finally { setBusy(false); } }
  async function confirmIfUndecided(): Promise<boolean> {
    if (progress.undecided === 0) return true;
    return new Promise((resolve) => Alert.alert("Quedan elementos sin decidir", `Hay ${progress.undecided} elemento${progress.undecided === 1 ? "" : "s"} sin marcar en esta etapa. ¿Querés continuar sin resolverlos?`, [{ text: "Volver", style: "cancel", onPress: () => resolve(false) }, { text: "Continuar sin resolver", style: "destructive", onPress: () => resolve(true) }]));
  }

  if (status === "loading") return <Screen><ActivityIndicator accessibilityLabel="Cargando revisión" color={colors.primary} /></Screen>;
  if (status === "error") return <Screen><MascotIllustration size="compact" variant="error" /><Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text><Pressable accessibilityRole="button" onPress={() => void load()}><Text style={{ color: colors.primary }}>Reintentar</Text></Pressable></Screen>;
  if (!summary) return null;
  if (!started) return <ReviewEntry colors={colors} busy={busy} summary={summary} hasInProgress={Boolean(session)} error={error} onBegin={() => void beginReview()} onExit={() => router.back()} />;
  if (!session) return null;

  const stepIndex = REVIEW_STEPS.indexOf(session.currentStep);
  const isClosure = session.currentStep === "CLOSURE";
  const copy = getReviewStepCopy(session.currentStep);
  return <Screen>
    <PageHero title="Revisión semanal" subtitle="Una pregunta a la vez para volver a tener claridad." showBack backFallback="/(tabs)" backLabel="Salir" />
    {isClosure ? <MascotIllustration accessibilityLabel="Mascota celebrando el cierre de la revisión" variant="celebrating" size="compact" /> : null}
    <Text style={{ color: colors.textSecondary }}>Paso {stepIndex + 1} de {REVIEW_STEPS.length}: {copy.group}</Text>
    <Text accessibilityLiveRegion="polite" style={{ color: colors.textSecondary }}>{progress.reviewed} revisados · {progress.omitted} omitidos · {progress.undecided} sin decidir de {progress.total}</Text>
    <ReviewProgress colors={colors} progress={progress} />
    {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
    <Motion><Card>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{copy.group}</Text>
      <Text style={[styles.heading, { color: colors.text }]}>{copy.title}</Text>
      <Text style={{ color: colors.textSecondary }}>{copy.question}</Text>
      <Text style={{ color: colors.textSecondary }}>{copy.orientation}</Text>
      {isClosure ? <Text style={{ color: colors.textSecondary }}>Resumen real: {progress.reviewed} revisados, {progress.omitted} omitidos y {progress.undecided} sin decidir.</Text> : items.length ? <View accessibilityRole="list" accessibilityLabel={`Elementos para ${copy.title}`} style={styles.items}>{items.map((item) => <ReviewItem key={item.id} item={item} busy={busy} colors={colors} step={session.currentStep} onDecide={decide} />)}</View> : <Text style={{ color: colors.textSecondary }}>No hay elementos pendientes en esta parte.</Text>}
    </Card></Motion>
    <View style={styles.actions}>
      {isClosure ? <ActionButton disabled={busy} icon="checkmark-circle-outline" onPress={() => void finish()}>Terminar revisión</ActionButton> : <ActionButton disabled={busy} icon="arrow-forward" onPress={() => void next()}>Siguiente etapa</ActionButton>}
      <ActionButton disabled={busy} icon="pause-outline" variant="secondary" onPress={() => void pause()}>Pausar</ActionButton>
      <ActionButton disabled={busy} icon="close" variant="danger" onPress={() => void cancel()}>Cancelar</ActionButton>
    </View>
    {session.state === "COMPLETED" ? <Text style={{ color: colors.success }}>Revisión terminada. Quedaron visibles los asuntos abiertos.</Text> : null}
  </Screen>;
}

function ReviewEntry({ colors, busy, summary, hasInProgress, error, onBegin, onExit }: { colors: ReturnType<typeof useAppTheme>; busy: boolean; summary: ReviewSummary; hasInProgress: boolean; error: string | null; onBegin: () => void; onExit: () => void }) {
  return <Screen>
    <PageHero title="Poner al día mi sistema" subtitle="Una pausa breve para mirar lo que tenés abierto y recuperar claridad, sin empezar de cero." showBack backFallback="/(tabs)" backLabel="Salir" />
    <MascotIllustration accessibilityLabel="Mascota acompañando el inicio de la revisión" variant="weeklyReview" />
    <Text style={[styles.intro, { color: colors.textSecondary }]}>Vamos a recorrer tus asuntos con calma. Vos decidís qué revisar ahora y qué puede esperar.</Text>
    <Card><Text style={[styles.heading, { color: colors.text }]}>Así está tu sistema</Text><View style={styles.summaryGrid}>{REVIEW_ENTRY_SUMMARY.map(({ key, label }) => <View key={key} style={[styles.summaryItem, { backgroundColor: colors.surface }]}><Text style={[styles.summaryCount, { color: colors.primary }]}>{summary[key]}</Text><Text style={{ color: colors.textSecondary }}>{label}</Text></View>)}</View></Card>
    {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
    <ActionButton disabled={busy} icon="play" onPress={onBegin}>{hasInProgress ? "Continuar revisión" : "Empezar revisión"}</ActionButton>
    <Pressable accessibilityRole="button" accessibilityLabel="Salir de la revisión" disabled={busy} onPress={onExit} style={styles.exit}><Text style={{ color: colors.textSecondary }}>Salir de revisión</Text></Pressable>
  </Screen>;
}

function localDate(): string { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }

function ReviewProgress({ colors, progress }: { colors: ReturnType<typeof useAppTheme>; progress: ReviewDecisionSummary }) {
  const reducedMotion = useReducedMotion();
  const animatedProgress = useSharedValue(progress.total ? ((progress.total - progress.undecided) / progress.total) * 100 : 0);
  useEffect(() => { const nextProgress = progress.total ? ((progress.total - progress.undecided) / progress.total) * 100 : 0; animatedProgress.value = reducedMotion ? nextProgress : withTiming(nextProgress, { duration: 180 }); }, [animatedProgress, progress.total, progress.undecided, reducedMotion]);
  const fillStyle = useAnimatedStyle(() => ({ width: `${animatedProgress.value}%` }));
  return <View accessibilityLabel={`Progreso de revisión: ${progress.reviewed} revisados, ${progress.omitted} omitidos y ${progress.undecided} sin decidir de ${progress.total}`} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: progress.total, now: progress.total - progress.undecided }} style={[styles.progress, { backgroundColor: colors.outline }]}><Animated.View style={[styles.progressFill, { backgroundColor: colors.primary }, fillStyle]} /></View>;
}

function ReviewItem({ item, busy, colors, step, onDecide }: { item: { id: string; title: string; state: string; decision: "REVIEWED" | "OMITTED" | null }; busy: boolean; colors: ReturnType<typeof useAppTheme>; step: ReviewStep; onDecide: (entityId: string, decision: "REVIEWED" | "OMITTED") => Promise<void> }) {
  const reducedMotion = useReducedMotion();
  return <Motion><Animated.View layout={reducedMotion ? undefined : LinearTransition.duration(220).reduceMotion(ReduceMotion.System)} style={[styles.item, { borderColor: colors.outline, backgroundColor: colors.surface }]}><Pressable accessibilityRole="button" accessibilityLabel={item.title} accessibilityHint="Abre el elemento para revisarlo" onPress={() => router.navigate(getReviewItemRoute(step, item.id))}><Text style={{ color: colors.text }}>{item.title}</Text></Pressable><ReviewDecisionStatus colors={colors} decision={item.decision} /><View style={styles.itemActions}><ActionButton disabled={busy} variant={item.decision === "REVIEWED" ? "primary" : "secondary"} onPress={() => void onDecide(item.id, "REVIEWED")}>Marcar revisado</ActionButton><ActionButton disabled={busy} variant={item.decision === "OMITTED" ? "primary" : "secondary"} onPress={() => void onDecide(item.id, "OMITTED")}>Omitir</ActionButton></View></Animated.View></Motion>;
}

function ReviewDecisionStatus({ colors, decision }: { colors: ReturnType<typeof useAppTheme>; decision: "REVIEWED" | "OMITTED" | null }) {
  const reducedMotion = useReducedMotion();
  const status = decision === "REVIEWED" ? { icon: "checkmark-circle" as const, label: "Revisado" } : decision === "OMITTED" ? { icon: "arrow-forward-circle" as const, label: "Omitido" } : { icon: "ellipse-outline" as const, label: "Sin decidir" };
  return <View style={styles.status} accessibilityLiveRegion="polite"><Animated.View key={status.label} entering={reducedMotion ? undefined : FadeIn.duration(160).reduceMotion(ReduceMotion.System)} exiting={reducedMotion ? undefined : FadeOut.duration(120).reduceMotion(ReduceMotion.System)} style={styles.status}><Ionicons color={status.label === "Sin decidir" ? colors.textSecondary : colors.primary} name={status.icon} size={20} /><Text style={[styles.statusLabel, { color: colors.textSecondary }]}>{status.label}</Text></Animated.View></View>;
}

const styles = StyleSheet.create({ card: { borderRadius: radii.card, borderWidth: 1, gap: spacing.sm, padding: spacing.md }, eyebrow: { fontSize: 13, fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase" }, heading: { fontSize: 20, fontWeight: "800" }, intro: { fontSize: 17, lineHeight: 25 }, summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, summaryItem: { borderRadius: radii.card, flexBasis: "47%", flexGrow: 1, gap: spacing.xs, minHeight: 76, padding: spacing.sm }, summaryCount: { fontSize: 24, fontWeight: "900" }, exit: { alignItems: "center", minHeight: 48, justifyContent: "center", padding: spacing.sm }, progress: { height: 8, borderRadius: radii.pill, overflow: "hidden" }, progressFill: { height: "100%" }, items: { gap: spacing.sm }, item: { borderRadius: radii.card, borderWidth: 1, gap: spacing.sm, minHeight: 48, padding: spacing.md }, itemActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }, actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.lg }, status: { alignItems: "center", flexDirection: "row", gap: spacing.xs, minHeight: 24 }, statusLabel: { color: "#6B6478", fontSize: 14, fontWeight: "700" } });
