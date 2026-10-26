import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import Animated, { FadeIn, FadeOut, LinearTransition, ReduceMotion, useReducedMotion } from "react-native-reanimated";
import { useProjectRepository } from "@/src/features/projects/data/useProjectRepository";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { spacing } from "@/src/shared/theme/tokens";
import { Card } from "@/src/shared/ui/Card";
import { LoadingState } from "@/src/shared/ui/LoadingState";
import { useResponsive } from "@/src/shared/ui/useResponsive";
import { getProjectFilterCounts, getProjectHighlights, matchesProjectFilter, projectStatusPresentation, type ProjectFilter, type ProjectWithItems } from "@/src/shared/ui/projectPresentation";

export default function ProjectsScreen() {
  const repository = useProjectRepository();
  const colors = useAppTheme();
  const [projects, setProjects] = useState<ProjectWithItems[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [filter, setFilter] = useState<ProjectFilter>("ALL");
  const reducedMotion = useReducedMotion();
  const responsive = useResponsive();
  const load = useCallback(async () => { setStatus("loading"); try { const loaded = await repository.listProjects(); setProjects(await Promise.all(loaded.map(async (project) => ({ ...project, items: await repository.listProjectItems(project.id) })))); setStatus("ready"); } catch { setStatus("error"); } }, [repository]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  return (
    <Screen>
      <PageHero title="Proyectos" subtitle={status === "loading" ? "Cargando tus proyectos..." : "Resultados que requieren más de un paso."} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filters, { paddingRight: responsive.horizontalPadding }]} accessibilityRole="tablist">
        {(["ALL", "ACTIVE", "SOMEDAY", "COMPLETED"] as const).map((value) => {
          const labels = { ALL: "Todos", ACTIVE: "Activos", SOMEDAY: "Algún día", COMPLETED: "Completados" };
          const selected = filter === value;
          return <Animated.View key={value} layout={reducedMotion ? undefined : LinearTransition.duration(220).reduceMotion(ReduceMotion.System)}>
            <Pressable accessibilityRole="tab" accessibilityState={{ selected }} accessibilityLabel={`${labels[value]}, ${getProjectFilterCounts(projects)[value]} proyectos`} onPress={() => setFilter(value)} style={[styles.filter, { backgroundColor: selected ? colors.primary : colors.surfaceSoft }]}>
              <Text style={{ color: selected ? "#FFFFFF" : colors.text, fontWeight: "800" }}>{labels[value]} · {getProjectFilterCounts(projects)[value]}</Text>
            </Pressable>
          </Animated.View>;
        })}
      </ScrollView>
      {status === "loading" ? <LoadingState accessibilityLabel="Cargando proyectos" message="Cargando tus proyectos…" skeleton /> : null}
      {status === "error" ? <Pressable onPress={() => void load()}><Text style={{ color: colors.error }}>No se pudieron cargar los proyectos. Intenta otra vez.</Text></Pressable> : null}
      {status === "ready" && projects.length === 0 ? <EmptyState mascot="thinking" message="Los proyectos nacen cuando aclaras una captura y descubres que requiere más de un paso." actionLabel="Capturar algo" onAction={() => router.push("/capture")} /> : null}
      {status === "ready" ? projects.filter((project) => matchesProjectFilter(project, filter)).map((project) => <Animated.View key={project.id} entering={reducedMotion ? undefined : FadeIn.duration(220).reduceMotion(ReduceMotion.System)} exiting={reducedMotion ? undefined : FadeOut.duration(140).reduceMotion(ReduceMotion.System)} layout={reducedMotion ? undefined : LinearTransition.duration(220).reduceMotion(ReduceMotion.System)}><ProjectCard project={project} colors={colors} onPress={() => router.push(`/project/${project.id}`)} /></Animated.View>) : null}
    </Screen>
  );
}

function ProjectCard({ project, colors, onPress }: { project: ProjectWithItems; colors: ReturnType<typeof useAppTheme>; onPress: () => void }) {
  const presentation = projectStatusPresentation[project.status];
  const highlights = getProjectHighlights(project);
  const iconColor = presentation.tone === "success" ? colors.success : presentation.tone === "muted" ? colors.textSecondary : colors.primary;
  return <Pressable accessibilityRole="button" accessibilityLabel={`Abrir proyecto ${project.desiredOutcome}`} accessibilityHint="Muestra el detalle del proyecto" onPress={onPress}>
    <Card>
      <View style={styles.header}><View style={[styles.statusIcon, { backgroundColor: colors.primarySoft }]}><Ionicons accessibilityLabel={`${presentation.label}`} color={iconColor} name={presentation.icon} size={23} /></View><Text style={[styles.outcome, { color: colors.text }]}>{project.desiredOutcome}</Text><Ionicons accessibilityLabel="Abrir detalle" color={colors.textSecondary} name="chevron-forward" size={22} /></View>
      <View style={styles.metaRow}><Text style={[styles.statusPill, { backgroundColor: colors.surfaceSoft, color: colors.text }]}>{presentation.label}</Text><Text style={{ color: colors.textSecondary }}>{project.items.length} {project.items.length === 1 ? "acción" : "acciones"}</Text></View>
      <View style={styles.highlights}>{highlights.map((highlight) => <Text key={`${highlight.kind}-${highlight.text}`} style={[styles.highlight, { color: highlight.kind === "next" ? colors.text : highlight.kind === "blocked" ? colors.error : colors.textSecondary }]}>{highlight.text}</Text>)}</View>
    </Card>
  </Pressable>;
}

const styles = StyleSheet.create({ header: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, outcome: { flex: 1, fontSize: 19, fontWeight: "800" }, filters: { gap: spacing.sm }, filter: { borderRadius: 999, minHeight: 48, justifyContent: "center", paddingHorizontal: spacing.md }, statusIcon: { alignItems: "center", borderRadius: 14, height: 42, justifyContent: "center", width: 42 }, metaRow: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, statusPill: { borderRadius: 999, fontSize: 13, fontWeight: "800", overflow: "hidden", paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }, highlights: { gap: spacing.xs }, highlight: { fontSize: 15, lineHeight: 22 } });
