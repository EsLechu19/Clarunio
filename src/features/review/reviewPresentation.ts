import type { ReviewStepLike, ReviewSummary } from "./domain/review";

export const REVIEW_ENTRY_SUMMARY: Array<{ key: keyof Pick<ReviewSummary, "inbox" | "next" | "waiting" | "projectsWithoutNext">; label: string }> = [
  { key: "inbox", label: "Bandeja" },
  { key: "next", label: "Siguientes" },
  { key: "waiting", label: "Esperando" },
  { key: "projectsWithoutNext", label: "Proyectos sin siguiente acción" }
];

const STEP_COPY: Record<ReviewStepLike, { group: string; title: string; question: string; orientation: string }> = {
  INBOX: { group: "Inbox", title: "Aclarar", question: "¿Hay algo pendiente que todavía no tenga un lugar claro?", orientation: "Abrí cada captura y decidí qué significa o dónde debe quedar." },
  NEXT: { group: "Poner al día", title: "Siguientes", question: "¿Cada siguiente acción sigue siendo la más clara para avanzar?", orientation: "Revisá si todavía podés hacerla o si necesita una actualización." },
  WAITING: { group: "Poner al día", title: "Esperando", question: "¿Lo que estás esperando sigue vigente y tiene un próximo paso claro?", orientation: "Confirmá qué sigue pendiente y qué ya puede dejar de ocupar espacio mental." },
  PROJECTS: { group: "Poner al día", title: "Proyectos", question: "¿Cada proyecto activo tiene una siguiente acción que lo mantenga en movimiento?", orientation: "Entrá al proyecto cuando necesites revisar su resultado y su próximo paso." },
  SCHEDULED: { group: "Mirar adelante", title: "Programadas", question: "¿Estas fechas siguen siendo realistas?", orientation: "Revisá si cada fecha todavía representa un compromiso posible." },
  SOMEDAY: { group: "Mirar adelante", title: "Algún día", question: "¿Esto todavía merece espacio en tu sistema?", orientation: "Conservá solo lo que todavía querés poder recuperar más adelante." },
  SCHEDULED_SOMEDAY: { group: "Compatibilidad", title: "Etapa anterior: Programadas y algún día", question: "¿Qué merece una mirada futura?", orientation: "Esta sesión comenzó con la etapa anterior; al avanzar continuará con el cierre." },
  CLOSURE: { group: "Cierre", title: "Cerrar la revisión", question: "¿Querés terminar con lo que pudiste revisar hoy?", orientation: "Podés volver más tarde a lo que todavía no tenga una decisión." }
};

export function getReviewStepCopy(step: ReviewStepLike) { return STEP_COPY[step]; }
