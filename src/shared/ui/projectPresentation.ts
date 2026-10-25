import { Ionicons } from "@expo/vector-icons";

import type { Item } from "../../features/items/domain/item";
import type { Project, ProjectStatus } from "../../features/projects/domain/project";

export type ProjectWithItems = Project & { items: Item[] };
export type ProjectFilter = "ALL" | "ACTIVE" | "SOMEDAY" | "COMPLETED";
export type ProjectHighlight = { kind: "next" | "waiting" | "blocked" | "empty"; text: string };

export const projectStatusPresentation: Record<ProjectStatus, { icon: keyof typeof Ionicons.glyphMap; label: string; tone: "primary" | "success" | "muted" }> = {
  ACTIVE: { icon: "play-circle-outline", label: "Activo", tone: "primary" },
  SOMEDAY: { icon: "cloud-outline", label: "Algún día", tone: "muted" },
  COMPLETED: { icon: "checkmark-circle-outline", label: "Completado", tone: "success" },
  ARCHIVED: { icon: "archive-outline", label: "Archivado", tone: "muted" }
};

export function getProjectHighlights(project: ProjectWithItems): ProjectHighlight[] {
  const next = project.items.find((item) => item.state === "NEXT");
  const waiting = project.items.find((item) => item.state === "WAITING");
  const highlights: ProjectHighlight[] = [];

  if (next) highlights.push({ kind: "next", text: `Siguiente acción: ${next.title}` });
  if (waiting?.waitingFor) highlights.push({ kind: "waiting", text: `Esperando: ${waiting.waitingFor}` });
  if (project.blockedReason) highlights.push({ kind: "blocked", text: `Bloqueado: ${project.blockedReason}` });
  if (highlights.length === 0) highlights.push({ kind: "empty", text: "Define una siguiente acción para avanzar." });

  return highlights;
}

export function getProjectFilterCounts(projects: ProjectWithItems[]): Record<ProjectFilter, number> {
  return {
    ALL: projects.length,
    ACTIVE: projects.filter((project) => project.status === "ACTIVE").length,
    SOMEDAY: projects.filter((project) => project.status === "SOMEDAY").length,
    COMPLETED: projects.filter((project) => project.status === "COMPLETED").length
  };
}

export function matchesProjectFilter(project: ProjectWithItems, filter: ProjectFilter): boolean {
  return filter === "ALL" || project.status === filter;
}
