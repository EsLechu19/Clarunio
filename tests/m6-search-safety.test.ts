import { describe, expect, it } from "vitest";

import { searchPattern } from "@/src/features/search/data/searchRepository";
import { shouldEnableNotifications } from "@/src/features/notifications/data/notificationPolicy";

describe("M6 búsqueda y permisos", () => {
  it("escapa comodines SQL LIKE y mantiene la consulta parametrizada", () => expect(searchPattern("  50%_  ")).toBe("%50\\%\\_%"));
  it("no activa recordatorios si el permiso nativo fue denegado", () => expect(shouldEnableNotifications(false)).toBe(false));
});
