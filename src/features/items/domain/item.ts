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
