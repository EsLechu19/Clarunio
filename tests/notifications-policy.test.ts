import { describe, expect, it } from "vitest";

import { isExpoGoAndroid, shouldEnableNotifications } from "../src/features/notifications/data/notificationPolicy";

describe("política de disponibilidad de notificaciones", () => {
  it("identifica Expo Go Android sin considerar development builds como Expo Go", () => {
    expect(isExpoGoAndroid("android", "expo")).toBe(true);
    expect(isExpoGoAndroid("android", "standalone")).toBe(false);
    expect(isExpoGoAndroid("android", null)).toBe(false);
    expect(isExpoGoAndroid("ios", "expo")).toBe(false);
  });

  it("mantiene la decisión de activar basada en el permiso concedido", () => {
    expect(shouldEnableNotifications(true)).toBe(true);
    expect(shouldEnableNotifications(false)).toBe(false);
  });
});
