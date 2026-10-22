import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { useSearchRepository } from "@/src/features/search/data/useSearchRepository";
import type { SearchResult } from "@/src/features/search/data/searchRepository";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";
import { Screen } from "@/src/shared/ui/Screen";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";

export default function SearchScreen() {
  const colors = useAppTheme();
  const repository = useSearchRepository();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(value: string) {
    setQuery(value);
    if (!value.trim()) { setResults([]); return; }
    try { setLoading(true); setError(null); setResults(await repository.search(value)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo buscar."); }
    finally { setLoading(false); }
  }

  return <Screen>
    <PageHero title="Buscar" subtitle="Busca en tus acciones, referencias y proyectos. Todo queda en tu dispositivo." />
    <TextInput autoFocus accessibilityLabel="Buscar" onChangeText={(value) => void search(value)} placeholder="Escribe para buscar" placeholderTextColor={colors.textSecondary} style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.outline, color: colors.text }]} value={query} />
    {loading ? <ActivityIndicator color={colors.primary} accessibilityLabel="Buscando" /> : null}
    {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
    {!loading && query.trim() && !results.length && !error ? <EmptyState message="No encontramos coincidencias." /> : null}
    <View style={styles.list}>{results.map((result) => <Pressable key={`${result.kind}-${result.id}`} accessibilityRole="button" onPress={() => router.push(result.kind === "item" ? `/item/${result.id}` : `/project/${result.id}`)} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}><Text style={[styles.title, { color: colors.text }]}>{result.title}</Text><Text style={{ color: colors.textSecondary }}>{result.kind === "project" ? "Proyecto" : result.state} · {result.subtitle}</Text></Pressable>)}</View>
  </Screen>;
}

const styles = StyleSheet.create({ input: { borderRadius: radii.input, borderWidth: 1, fontSize: 17, padding: spacing.md }, list: { gap: spacing.sm }, card: { borderRadius: radii.card, borderWidth: 1, gap: spacing.xs, padding: spacing.md }, title: { fontSize: 17, fontWeight: "700" } });
