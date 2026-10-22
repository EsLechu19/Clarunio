import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { useProjectRepository } from "@/src/features/projects/data/useProjectRepository";
import type { Project } from "@/src/features/projects/domain/project";
import type { Item } from "@/src/features/items/domain/item";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { radii, spacing } from "@/src/shared/theme/tokens";

export default function ProjectDetailScreen() {
  const colors = useAppTheme();
  const repository = useProjectRepository();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<{ project: Project; items: Item[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { try { if (!id) throw new Error("No se indicó el proyecto."); const project = await repository.getProjectById(id); if (!project) throw new Error("No se encontró el proyecto."); setData({ project, items: await repository.listProjectItems(id) }); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cargar el proyecto."); } }, [id, repository]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  if (error) return <View style={[styles.center, { backgroundColor: colors.background }]}><Text style={{ color: colors.error }}>{error}</Text><Pressable onPress={() => router.back()}><Text style={{ color: colors.primary }}>Volver</Text></Pressable></View>;
  if (!data) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} accessibilityLabel="Cargando proyecto" /></View>;
  const project = data;
  const next = project.items.find((item) => item.state === "NEXT");
  const waiting = project.items.find((item) => item.state === "WAITING");
  return <View style={[styles.container, { backgroundColor: colors.background }]}><Pressable onPress={() => router.back()}><Text style={{ color: colors.primary }}>‹ Proyectos</Text></Pressable><Text style={[styles.title, { color: colors.text }]}>{project.project.desiredOutcome}</Text><Text style={{ color: colors.textSecondary }}>Estado: {project.project.status === "ACTIVE" ? "Activo" : project.project.status === "SOMEDAY" ? "Algún día" : project.project.status}</Text><View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}><Text style={{ color: colors.text }}>{next ? `Siguiente acción: ${next.title}` : waiting ? `Esperando: ${waiting.waitingFor}` : "Sin siguiente acción definida."}</Text></View><Text style={[styles.heading, { color: colors.text }]}>Acciones</Text>{project.items.map((item) => <Text key={item.id} style={{ color: colors.textSecondary }}>{item.state === "WAITING" ? `Esperando: ${item.title} — ${item.waitingFor}` : `${item.title} — ${item.state}`}</Text>)}</View>;
}

const styles = StyleSheet.create({ container: { flex: 1, gap: spacing.md, padding: spacing.lg, paddingTop: spacing.xl }, center: { alignItems: "center", flex: 1, gap: spacing.md, justifyContent: "center", padding: spacing.lg }, title: { fontSize: 30, fontWeight: "800" }, heading: { fontSize: 20, fontWeight: "800", marginTop: spacing.md }, card: { borderRadius: radii.card, borderWidth: 1, padding: spacing.md } });
