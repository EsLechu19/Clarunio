import type { ReviewStep, ReviewSummary } from "./domain/review";

export const REVIEW_ENTRY_SUMMARY: Array<{ key: keyof Pick<ReviewSummary, "inbox" | "next" | "waiting" | "projectsWithoutNext">; label: string }> = [
  { key: "inbox", label: "Bandeja" },
  { key: "next", label: "Siguientes" },
  { key: "waiting", label: "Esperando" },
  { key: "projectsWithoutNext", label: "Proyectos sin siguiente acción" }
];

const STEP_COPY: Record<ReviewStep, { group: string; title: string; question: string; orientation: string }> = {
  INBOX: { group: "Inbox", title: "Aclarar", question: "¿Hay algo pendiente que todavía no tenga un lugar claro?", orientation: "Abrí cada captura y decidí qué significa o dónde debe quedar." },
  NEXT: { group: "Poner al día", title: "Siguientes", question: "¿Cada siguiente acción sigue siendo la más clara para avanzar?", orientation: "Revisá si todavía podés hacerla o si necesita una actualización." },
  WAITING: { group: "Poner al día", title: "Esperando", question: "¿Lo que estás esperando sigue vigente y tiene un próximo paso claro?", orientation: "Confirmá qué sigue pendiente y qué ya puede dejar de ocupar espacio mental." },
  PROJECTS: { group: "Poner al día", title: "Proyectos", question: "¿Cada proyecto activo tiene una siguiente acción que lo mantenga en movimiento?", orientation: "Entrá al proyecto cuando necesites revisar su resultado y su próximo paso." },
  SCHEDULED_SOMEDAY: { group: "Mirar adelante", title: "Programadas y algún día", question: "¿Qué merece una mirada futura?", orientation: "Primero mirá lo programado; después, lo que querés conservar para algún día." },
  CLOSURE: { group: "Cierre", title: "Cerrar la revisión", question: "¿Querés terminar con lo que pudiste revisar hoy?", orientation: "Podés volver más tarde a lo que todavía no tenga una decisión." }
};

export function getReviewStepCopy(step: ReviewStep) { return STEP_COPY[step]; }
