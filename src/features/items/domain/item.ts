export const ITEM_STATES = [
  "INBOX",
  "NEXT",
  "WAITING",
  "SCHEDULED",
  "SOMEDAY",
  "REFERENCE",
  "DONE",
  "TRASH"
] as const;

export type ItemState = (typeof ITEM_STATES)[number];

export type Item = {
  id: string;
  title: string;
  state: ItemState;
  createdAt: string;
  updatedAt: string;
  projectId?: string | null;
  waitingFor?: string | null;
  availableFrom?: string | null;
  dueAt?: string | null;
  followUpAt?: string | null;
  focusDate?: string | null;
};

export type InboxDecision =
  | { destination: "NEXT"; title: string }
  | { destination: "WAITING"; waitingFor: string }
  | { destination: "PROJECT"; desiredOutcome: string; firstAction: string }
  | { destination: "SOMEDAY" | "REFERENCE" | "TRASH" };

export function validateWaitingFor(value: string): string {
  const waitingFor = value.trim();
  if (!waitingFor) throw new Error("Indica qué respuesta o resultado estás esperando.");
  return waitingFor;
}

export function validateLocalDate(value: string): string {
  const date = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Usa una fecha local con formato AAAA-MM-DD.");
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new Error("La fecha local no es válida.");
  return date;
}

export function validateDueAt(value: string): string {
  const dueAt = value.trim();
  if (!dueAt) throw new Error("Indica una fecha de vencimiento válida.");
  if (/^\d{4}-\d{2}-\d{2}$/.test(dueAt)) return validateLocalDate(dueAt);
  if (Number.isNaN(Date.parse(dueAt))) throw new Error("Indica una fecha de vencimiento válida.");
  return dueAt;
}

export function clarifyInboxItem(item: Item, decision: InboxDecision): Item {
  if (item.state !== "INBOX") {
    throw new Error("Solo se pueden aclarar entradas que siguen en la bandeja.");
  }

  const title = decision.destination === "NEXT"
    ? validateCaptureText(decision.title)
    : decision.destination === "PROJECT"
      ? validateCaptureText(decision.firstAction)
      : item.title;
  if (decision.destination === "WAITING") validateWaitingFor(decision.waitingFor);
  if (decision.destination === "PROJECT") validateCaptureText(decision.desiredOutcome);
  return {
    ...item,
    title,
    state: decision.destination === "PROJECT" ? "NEXT" : decision.destination,
    waitingFor: decision.destination === "WAITING" ? validateWaitingFor(decision.waitingFor) : null,
    updatedAt: new Date().toISOString()
  };
}

export function validateCaptureText(value: string): string {
  const title = value.trim();
  if (!title) {
    throw new Error("La captura no puede estar vacía.");
  }
  return title;
}
