import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";

import { useProjectRepository } from "@/src/features/projects/data/useProjectRepository";
import type { Project } from "@/src/features/projects/domain/project";
import type { Item } from "@/src/features/items/domain/item";
import { useAppTheme } from "@/src/shared/theme/useAppTheme";
import { radii, spacing } from "@/src/shared/theme/tokens";
import { Card } from "@/src/shared/ui/Card";
import { BackButton } from "@/src/shared/ui/BackButton";

export default function ProjectDetailScreen() {
  const colors = useAppTheme();
  const repository = useProjectRepository();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<{ project: Project; items: Item[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => { try { if (!id) throw new Error("No se indicó el proyecto."); const project = await repository.getProjectById(id); if (!project) throw new Error("No se encontró el proyecto."); setData({ project, items: await repository.listProjectItems(id) }); } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo cargar el proyecto."); } }, [id, repository]);
  useFocusEffect(useCallback(() => { void load(); }, [load]));
  if (error) return <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}><Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text><Pressable accessibilityRole="button" onPress={() => void load()}><Text style={{ color: colors.primary }}>Reintentar</Text></Pressable></SafeAreaView>;
  if (!data) return <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} accessibilityLabel="Cargando proyecto" /></SafeAreaView>;
  const project = data;
  const next = project.items.find((item) => item.state === "NEXT");
  const waiting = project.items.find((item) => item.state === "WAITING");
  return <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}><ScrollView contentContainerStyle={styles.content}><BackButton fallback="/(tabs)/projects" label="Volver a proyectos" showLabel /><Text style={[styles.title, { color: colors.text }]}>{project.project.desiredOutcome}</Text><Text style={{ color: colors.textSecondary }}>Estado: {project.project.status === "ACTIVE" ? "Activo" : project.project.status === "SOMEDAY" ? "Algún día" : project.project.status}</Text><Card><Text style={{ color: colors.text }}>{next ? `Siguiente acción: ${next.title}` : waiting ? `Esperando: ${waiting.waitingFor}` : "Sin siguiente acción definida."}</Text></Card><Text style={[styles.heading, { color: colors.text }]}>Acciones</Text>{project.items.map((item) => <Card key={item.id}><Text style={{ color: colors.textSecondary }}>{item.state === "WAITING" ? `Esperando: ${item.title} — ${item.waitingFor}` : `${item.title} — ${item.state}`}</Text></Card>)}</ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ container: { flex: 1 }, content: { gap: spacing.md, padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: 120 }, center: { alignItems: "center", flex: 1, gap: spacing.md, justifyContent: "center", padding: spacing.lg }, title: { fontSize: 30, fontWeight: "800" }, heading: { fontSize: 20, fontWeight: "800", marginTop: spacing.md }, card: { borderRadius: radii.card, borderWidth: 1, padding: spacing.md } });
