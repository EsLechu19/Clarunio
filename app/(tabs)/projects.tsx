import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import { useProjectRepository } from "@/src/features/projects/data/useProjectRepository";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { radii, spacing } from "@/src/shared/theme/tokens";
import type { Project } from "@/src/features/projects/domain/project";

export default function ProjectsScreen() {
  const repository = useProjectRepository();
  const colors = useAppTheme();
  const [projects, setProjects] = useState<Awaited<ReturnType<typeof repository.listProjects>>>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const load = useCallback(async () => { setStatus("loading"); try { setProjects(await repository.listProjects()); setStatus("ready"); } catch { setStatus("error"); } }, [repository]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  return (
    <Screen>
      <PageHero title="Proyectos" subtitle={status === "loading" ? "Cargando tus proyectos..." : "Resultados que requieren más de un paso."} />
      {status === "loading" ? <ActivityIndicator color={colors.primary} accessibilityLabel="Cargando proyectos" /> : null}
      {status === "error" ? <Pressable onPress={() => void load()}><Text style={{ color: colors.error }}>No se pudieron cargar los proyectos. Intenta otra vez.</Text></Pressable> : null}
      {status === "ready" && projects.length === 0 ? <EmptyState message="Aún no tienes proyectos. Cuando aparezca uno, podrás ver aquí su resultado deseado y siguiente paso." /> : null}
      {status === "ready" ? projects.map((project) => <ProjectCard key={project.id} project={project} colors={colors} onPress={() => router.push(`/project/${project.id}`)} />) : null}
    </Screen>
  );
}

function ProjectCard({ project, colors, onPress }: { project: Project; colors: ReturnType<typeof useAppTheme>; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}><Text style={[styles.outcome, { color: colors.text }]}>{project.desiredOutcome}</Text><Text style={{ color: colors.textSecondary }}>Estado: {project.status === "ACTIVE" ? "Activo" : project.status === "SOMEDAY" ? "Algún día" : project.status === "COMPLETED" ? "Completado" : "Archivado"}</Text><Text style={{ color: colors.textSecondary }}>Abrir para ver siguiente acción o espera.</Text></Pressable>;
}

const styles = StyleSheet.create({ card: { borderRadius: radii.card, borderWidth: 1, gap: spacing.sm, padding: spacing.md }, outcome: { fontSize: 19, fontWeight: "800" } });
