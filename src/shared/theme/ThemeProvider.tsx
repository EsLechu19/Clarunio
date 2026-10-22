import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useColorScheme } from "react-native";

import { DEFAULT_SETTINGS, type AppSettings, type ThemePreference } from "@/src/features/settings/domain/settings";
import { useSettingsRepository } from "@/src/features/settings/data/useSettingsRepository";
import { themeTokens, type ThemeColors } from "./tokens";

type ThemeContextValue = { colors: ThemeColors; settings: AppSettings; updateSettings: (patch: Partial<AppSettings>) => Promise<void> };
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme();
  const repository = useSettingsRepository();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  useEffect(() => { void repository.get().then(setSettings); }, [repository]);
  const mode: ThemePreference = settings.theme === "system" ? (system === "dark" ? "dark" : "light") : settings.theme;
  const value = useMemo(() => ({ colors: themeTokens[mode], settings, updateSettings: async (patch: Partial<AppSettings>) => { const next = await repository.save({ ...settings, ...patch }); setSettings(next); } }), [mode, repository, settings]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemePreferences(): ThemeContextValue { const value = useContext(ThemeContext); if (!value) throw new Error("ThemeProvider requerido."); return value; }
