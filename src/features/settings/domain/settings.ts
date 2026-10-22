export const THEME_MODES = ["system", "light", "dark"] as const;
export type ThemePreference = (typeof THEME_MODES)[number];

export type AppSettings = {
  theme: ThemePreference;
  contextualHelp: boolean;
  weeklyReviewReminders: boolean;
  notificationsEnabled: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = { theme: "system", contextualHelp: true, weeklyReviewReminders: false, notificationsEnabled: false };

export function parseSettings(value: unknown): AppSettings {
  if (!value || typeof value !== "object") throw new Error("Los ajustes no tienen un formato válido.");
  const candidate = value as Record<string, unknown>;
  if (!THEME_MODES.includes(candidate.theme as ThemePreference) || typeof candidate.contextualHelp !== "boolean" || typeof candidate.weeklyReviewReminders !== "boolean" || typeof candidate.notificationsEnabled !== "boolean") {
    throw new Error("Los ajustes no tienen valores válidos.");
  }
  return { theme: candidate.theme as ThemePreference, contextualHelp: candidate.contextualHelp, weeklyReviewReminders: candidate.weeklyReviewReminders, notificationsEnabled: candidate.notificationsEnabled };
}
