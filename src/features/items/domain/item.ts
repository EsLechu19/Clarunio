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
};

export type InboxDecision =
  | { destination: "NEXT"; title: string }
  | { destination: "SOMEDAY" | "REFERENCE" | "TRASH" };

export function clarifyInboxItem(item: Item, decision: InboxDecision): Item {
  if (item.state !== "INBOX") {
    throw new Error("Solo se pueden aclarar entradas que siguen en la bandeja.");
  }

  const title = decision.destination === "NEXT" ? validateCaptureText(decision.title) : item.title;
  return { ...item, title, state: decision.destination, updatedAt: new Date().toISOString() };
}

export function validateCaptureText(value: string): string {
  const title = value.trim();
  if (!title) {
    throw new Error("La captura no puede estar vacía.");
  }
  return title;
}
