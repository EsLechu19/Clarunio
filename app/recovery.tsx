import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import { useReviewRepository } from "@/src/features/review/data/useReviewRepository";
import type { ReviewSession, ReviewSummary } from "@/src/features/review/domain/review";
import { Screen } from "@/src/shared/ui/Screen";
import { PageHero } from "@/src/shared/ui/PageHero";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { Card } from "@/src/shared/ui/Card";
import { ActionButton } from "@/src/shared/ui/ActionButton";
import { Motion } from "@/src/shared/ui/Motion";

export default function RecoveryScreen() {
  const colors = useAppTheme(); const review = useReviewRepository(); const itemsRepository = useItemRepository();
  const [session, setSession] = useState<ReviewSession | null>(null); const [summary, setSummary] = useState<ReviewSummary | null>(null); const [inbox, setInbox] = useState<Array<{ id: string; title: string; state: string }>>([]); const [next, setNext] = useState<Array<{ id: string; title: string; state: string }>>([]); const [selected, setSelected] = useState<string[]>([]); const [status, setStatus] = useState<"loading" | "ready" | "error">("loading"); const [error, setError] = useState<string | null>(null); const today = localDate();
  const load = useCallback(async () => { try { setStatus("loading"); const loadedSummary = await review.getSummary(today); const loadedSession = await review.resumeOrCreate("RECOVERY", loadedSummary); setSummary(loadedSummary); setSession(loadedSession); setInbox(await review.listStepItems("INBOX", today)); setNext(await review.listStepItems("NEXT", today)); setStatus("ready"); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cargar la recuperación."); setStatus("error"); } }, [review, today]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  async function finish() { if (!session || !summary) return; try { for (const id of selected) await itemsRepository.addFocus(id, today); await review.complete(session, summary); router.back(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo terminar la recuperación."); } }
  async function cancel() { if (!session) return; try { await review.cancel(session); router.back(); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cancelar la recuperación."); } }
  if (status === "loading") return <Screen><ActivityIndicator accessibilityLabel="Cargando recuperación" color={colors.primary} /></Screen>;
  if (status === "error") return <Screen><Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text><Pressable accessibilityRole="button" onPress={() => void load()}><Text style={{ color: colors.primary }}>Reintentar</Text></Pressable></Screen>;
  if (!session || !summary) return null;
  return <Screen><PageHero title="Volver a organizarme" subtitle="Podemos poner tu sistema al día, sin empezar de cero." />
     <Card><Text style={{ color: colors.text }}>Capturas: {summary.inbox}</Text><Text style={{ color: colors.text }}>Acciones activas: {summary.next}</Text><Text style={{ color: colors.text }}>Proyectos sin siguiente: {summary.projectsWithoutNext}</Text><Text style={{ color: colors.text }}>Esperando: {summary.waiting}</Text></Card>
    <Text style={[styles.heading, { color: colors.text }]}>Una decisión por vez</Text>
     {inbox.length ? inbox.map((item) => <Motion key={item.id}><Card><Text style={{ color: colors.text }}>{item.title}</Text><View style={styles.actions}><ActionButton icon="bulb-outline" onPress={() => router.push(`/clarify/${item.id}`)}>Abrir para aclarar</ActionButton><ActionButton icon="arrow-forward" variant="secondary" onPress={() => setInbox((current) => current.filter((candidate) => candidate.id !== item.id))}>Omitir</ActionButton></View></Card></Motion>) : <Text style={{ color: colors.textSecondary }}>No hay capturas para procesar ahora.</Text>}
    <Text style={[styles.heading, { color: colors.text }]}>Elegir foco ahora (recomendado hasta 3)</Text>
    {next.map((item) => { const checked = selected.includes(item.id); return <Pressable key={item.id} accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => setSelected((current) => checked ? current.filter((id) => id !== item.id) : [...current, item.id])}><Text style={{ color: colors.text }}>{checked ? "✓ " : "○ "}{item.title}</Text></Pressable>; })}
     <View style={styles.actions}><ActionButton icon="checkmark-circle-outline" onPress={() => void finish()}>Terminar recuperación</ActionButton><ActionButton icon="close" variant="danger" onPress={() => void cancel()}>Cancelar</ActionButton></View>
  </Screen>;
}
function localDate(): string { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
const styles = StyleSheet.create({ card: { borderRadius: radii.card, borderWidth: 1, gap: spacing.sm, padding: spacing.md }, heading: { fontSize: 20, fontWeight: "800" }, actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.lg } });
