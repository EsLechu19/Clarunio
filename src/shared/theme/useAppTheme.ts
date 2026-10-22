import type { ThemeColors } from "./tokens";
import { useThemePreferences } from "./ThemeProvider";

export function useAppTheme(): ThemeColors {
  return useThemePreferences().colors;
}
