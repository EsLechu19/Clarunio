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

export function validateCaptureText(value: string): string {
  const title = value.trim();
  if (!title) {
    throw new Error("La captura no puede estar vacía.");
  }
  return title;
}
