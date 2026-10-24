import { Screen } from "@/src/shared/ui/Screen";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { PageHero } from "@/src/shared/ui/PageHero";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import { useProjectRepository } from "@/src/features/projects/data/useProjectRepository";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { spacing } from "@/src/shared/theme/tokens";
import type { Project } from "@/src/features/projects/domain/project";
import type { Item } from "@/src/features/items/domain/item";
import { Card } from "@/src/shared/ui/Card";
import { Motion } from "@/src/shared/ui/Motion";

export default function ProjectsScreen() {
  const repository = useProjectRepository();
  const colors = useAppTheme();
  const [projects, setProjects] = useState<Array<Project & { items: Item[] }>>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const load = useCallback(async () => { setStatus("loading"); try { const loaded = await repository.listProjects(); setProjects(await Promise.all(loaded.map(async (project) => ({ ...project, items: await repository.listProjectItems(project.id) })))); setStatus("ready"); } catch { setStatus("error"); } }, [repository]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  return (
    <Screen>
      <PageHero title="Proyectos" subtitle={status === "loading" ? "Cargando tus proyectos..." : "Resultados que requieren más de un paso."} />
      {status === "loading" ? <ActivityIndicator color={colors.primary} accessibilityLabel="Cargando proyectos" /> : null}
      {status === "error" ? <Pressable onPress={() => void load()}><Text style={{ color: colors.error }}>No se pudieron cargar los proyectos. Intenta otra vez.</Text></Pressable> : null}
      {status === "ready" && projects.length === 0 ? <EmptyState message="Aún no tienes proyectos. Cuando aparezca uno, podrás ver aquí su resultado deseado y siguiente paso." /> : null}
       {status === "ready" ? projects.map((project) => <Motion key={project.id}><ProjectCard project={project} colors={colors} onPress={() => router.push(`/project/${project.id}`)} /></Motion>) : null}
    </Screen>
  );
}

function ProjectCard({ project, colors, onPress }: { project: Project & { items: Item[] }; colors: ReturnType<typeof useAppTheme>; onPress: () => void }) {
  const next = project.items.find((item) => item.state === "NEXT");
  const waiting = project.items.find((item) => item.state === "WAITING");
  const summary = next ? `Siguiente acción: ${next.title}` : waiting ? `Esperando: ${waiting.waitingFor}` : project.blockedReason ? `Bloqueado: ${project.blockedReason}` : "Sin siguiente acción definida.";
  return <Card><Pressable accessibilityRole="button" onPress={onPress}><View style={styles.header}><Ionicons color={colors.primary} name="layers-outline" size={24} /><Text style={[styles.outcome, { color: colors.text }]}>{project.desiredOutcome}</Text></View><Text style={{ color: colors.textSecondary }}>Estado: {project.status === "ACTIVE" ? "Activo" : project.status === "SOMEDAY" ? "Algún día" : project.status === "COMPLETED" ? "Completado" : "Archivado"}</Text><Text style={{ color: colors.text }}>{summary}</Text><Text style={{ color: colors.primary, fontWeight: "700" }}>Ver proyecto <Ionicons color={colors.primary} name="arrow-forward" size={14} /></Text></Pressable></Card>;
}

const styles = StyleSheet.create({ header: { alignItems: "center", flexDirection: "row", gap: spacing.sm }, outcome: { flex: 1, fontSize: 19, fontWeight: "800" } });
