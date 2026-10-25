import { useEffect, useRef, useState } from "react";
import Animated, { FadeIn, FadeOut, LinearTransition, ReduceMotion, useReducedMotion } from "react-native-reanimated";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useSearchRepository } from "@/src/features/search/data/useSearchRepository";
import type { SearchResult } from "@/src/features/search/data/searchRepository";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";
import { Screen } from "@/src/shared/ui/Screen";
import { Card } from "@/src/shared/ui/Card";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { searchResultSubtitle, translateSearchState } from "@/src/features/search/searchPresentation";

export default function SearchScreen() {
  const colors = useAppTheme();
  const repository = useSearchRepository();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const normalizedQuery = query.trim();
    const currentRequest = ++requestId.current;
    if (!normalizedQuery) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => {
      void repository.search(normalizedQuery).then((nextResults) => {
        if (currentRequest !== requestId.current) return;
        setResults(nextResults);
        setLoading(false);
      }).catch((cause: unknown) => {
        if (currentRequest !== requestId.current) return;
        setError(cause instanceof Error ? cause.message : "No se pudo buscar.");
        setResults([]);
        setLoading(false);
      });
    }, 250);
    return () => clearTimeout(timeout);
  }, [query, repository]);

  function clearSearch() { setQuery(""); }

  return <Screen>
    <PageHero title="Buscar" subtitle="Encuentra acciones, notas y proyectos guardados en este dispositivo." />
    <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
      <Animated.View key={query ? "clear-icon" : "search-icon"} entering={reducedMotion ? undefined : FadeIn.duration(160).reduceMotion(ReduceMotion.System)} exiting={reducedMotion ? undefined : FadeOut.duration(120).reduceMotion(ReduceMotion.System)}>
        {query ? <Pressable accessibilityLabel="Limpiar búsqueda" accessibilityRole="button" onPress={clearSearch} style={({ pressed }) => [styles.clearButton, pressed && { backgroundColor: colors.primarySoft }]}><Ionicons color={colors.primary} name="close" size={22} /></Pressable> : <View style={styles.searchIcon}><Ionicons color={colors.primary} name="search-outline" size={22} /></View>}
      </Animated.View>
      <TextInput accessibilityLabel="Buscar en acciones, notas y proyectos" onChangeText={setQuery} placeholder="Busca algo que recuerdes" placeholderTextColor={colors.textSecondary} style={[styles.input, { color: colors.text }]} value={query} />
    </View>
    {loading ? <View style={styles.loadingRow}><ActivityIndicator color={colors.primary} accessibilityLabel="Buscando" /><Text style={{ color: colors.textSecondary }}>Buscando…</Text></View> : null}
    {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
    {!loading && !query.trim() ? <EmptyState icon="search-outline" message="Busca en tus acciones, notas y proyectos para volver a encontrar lo importante." /> : null}
    {!loading && query.trim() && !results.length && !error ? <EmptyState icon="search-outline" message={`No encontramos coincidencias para “${query.trim()}”.`} actionLabel="Limpiar búsqueda" onAction={clearSearch} /> : null}
    {!loading && query.trim() && results.length ? <Animated.View key="result-count" entering={reducedMotion ? undefined : FadeIn.duration(180).reduceMotion(ReduceMotion.System)} exiting={reducedMotion ? undefined : FadeOut.duration(120).reduceMotion(ReduceMotion.System)}><Text style={[styles.resultCount, { color: colors.textSecondary }]}>{results.length} {results.length === 1 ? "resultado" : "resultados"}</Text></Animated.View> : null}
    <View style={styles.list}>{results.map((result, index) => <Animated.View key={`${result.kind}-${result.id}`} entering={reducedMotion ? undefined : FadeIn.delay(index * 35).duration(220).reduceMotion(ReduceMotion.System)} layout={reducedMotion ? undefined : LinearTransition.duration(180).reduceMotion(ReduceMotion.System)}><Card tone="soft"><Pressable accessibilityRole="button" accessibilityLabel={`${result.kind === "project" ? "Proyecto" : "Acción"}: ${result.title}`} onPress={() => router.push(result.kind === "item" ? `/item/${result.id}` : `/project/${result.id}`)} style={styles.resultRow}><View style={[styles.resultIcon, { backgroundColor: result.kind === "project" ? colors.primarySoft : colors.surface }]}><Ionicons color={colors.primary} name={result.kind === "project" ? "folder-open-outline" : "checkmark-circle-outline"} size={21} /></View><View style={styles.resultCopy}><View style={styles.resultHeading}><Text style={[styles.resultKind, { color: colors.primary }]}>{result.kind === "project" ? "Proyecto" : "Acción"}</Text><Text style={[styles.state, { color: colors.textSecondary }]}>{translateSearchState(result)}</Text></View><Text style={[styles.title, { color: colors.text }]}>{result.title}</Text>{searchResultSubtitle(result) ? <Text style={{ color: colors.textSecondary }}>{searchResultSubtitle(result)}</Text> : null}</View><Ionicons color={colors.textSecondary} name="chevron-forward" size={20} /></Pressable></Card></Animated.View>)}</View>
  </Screen>;
}

const styles = StyleSheet.create({ searchBox: { alignItems: "center", borderRadius: radii.input, borderWidth: 2, flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.md }, searchIcon: { alignItems: "center", height: 44, justifyContent: "center", width: 44 }, input: { flex: 1, fontSize: 17, minHeight: 56 }, clearButton: { alignItems: "center", borderRadius: radii.pill, height: 44, justifyContent: "center", width: 44 }, loadingRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, list: { gap: spacing.sm }, resultCount: { fontSize: 15, fontWeight: "700" }, resultRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, resultIcon: { alignItems: "center", borderRadius: radii.pill, height: 42, justifyContent: "center", width: 42 }, resultCopy: { flex: 1, gap: spacing.xs }, resultHeading: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, resultKind: { fontSize: 13, fontWeight: "800" }, state: { fontSize: 13 }, title: { fontSize: 17, fontWeight: "700" } });
