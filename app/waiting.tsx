import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useItemRepository } from "@/src/features/items/data/useItemRepository";
import type { Item } from "@/src/features/items/domain/item";
import { ActionButton } from "@/src/shared/ui/ActionButton";
import { Card } from "@/src/shared/ui/Card";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { FeedbackBanner, type FeedbackVariant } from "@/src/shared/ui/FeedbackBanner";
import { LoadingState } from "@/src/shared/ui/LoadingState";
import { Motion } from "@/src/shared/ui/Motion";
import { PageHero } from "@/src/shared/ui/PageHero";
import { Screen } from "@/src/shared/ui/Screen";
import { spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";

type Feedback = { message: string; variant: FeedbackVariant };

export default function WaitingScreen() {
  const colors = useAppTheme();
  const repository = useItemRepository();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await repository.listWaitingItems());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar Esperando.");
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  async function transition(item: Item, destination: "NEXT" | "DONE") {
    if (busyId) return;
    setBusyId(item.id);
    setFeedback(null);
    try {
      await repository.transitionWaiting(item.id, destination);
      setFeedback({ message: destination === "DONE" ? `Completaste «${item.title}».` : `«${item.title}» volvió a tus siguientes acciones.`, variant: "success" });
      await load();
    } catch (cause) {
      setFeedback({ message: cause instanceof Error ? cause.message : "No se pudo actualizar la espera.", variant: "error" });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Screen>
      <PageHero title="Esperando" subtitle="Seguimiento claro de respuestas y resultados pendientes." />
      {feedback ? <FeedbackBanner message={feedback.message} variant={feedback.variant} onDismiss={() => setFeedback(null)} /> : null}
      {loading ? <LoadingState message="Cargando esperas…" accessibilityLabel="Cargando Esperando" skeleton /> : null}
      {!loading && error ? <Card><Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text><ActionButton icon="refresh" onPress={() => void load()}>Reintentar</ActionButton></Card> : null}
      {!loading && !error && !items.length ? <EmptyState icon="hourglass-outline" message="No hay acciones esperando respuesta o resultado." /> : null}
      {!loading && !error ? items.map((item) => <Motion key={item.id}><WaitingCard busy={busyId === item.id} disabled={Boolean(busyId)} item={item} onDone={() => void transition(item, "DONE")} onNext={() => void transition(item, "NEXT")} colors={colors} /></Motion>) : null}
    </Screen>
  );
}

function WaitingCard({ item, busy, disabled, onNext, onDone, colors }: { item: Item; busy: boolean; disabled: boolean; onNext: () => void; onDone: () => void; colors: ReturnType<typeof useAppTheme> }) {
  return <Card><Pressable accessibilityLabel={`Abrir ${item.title}`} accessibilityRole="button" disabled={disabled} onPress={() => router.navigate(`/item/${item.id}`)} style={styles.itemHeader}><Ionicons color={colors.primary} name="hourglass-outline" size={24} /><View style={styles.copy}><Text style={[styles.title, { color: colors.text }]}>{item.title}</Text><Text style={[styles.waitingFor, { color: colors.textSecondary }]}>Esperando a: {item.waitingFor}</Text></View><Ionicons color={colors.textSecondary} name="chevron-forward" size={20} /></Pressable><View style={styles.actions}><ActionButton disabled={disabled} icon={busy ? undefined : "arrow-forward-circle-outline"} onPress={onNext} variant="secondary">{busy ? "Actualizando…" : "Pasar a siguientes"}</ActionButton><ActionButton disabled={disabled} icon={busy ? undefined : "checkmark-circle-outline"} onPress={onDone} variant="primary">{busy ? "Actualizando…" : "Marcar hecha"}</ActionButton></View></Card>;
}

const styles = StyleSheet.create({
  itemHeader: { alignItems: "center", flexDirection: "row", gap: spacing.sm, minHeight: 56 },
  copy: { flex: 1, gap: spacing.xs },
  title: { fontSize: 17, fontWeight: "800", lineHeight: 23 },
  waitingFor: { fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }
});
