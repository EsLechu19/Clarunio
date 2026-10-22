import { useColorScheme } from "react-native";

import { themeTokens, type ThemeColors } from "./tokens";

export function useAppTheme(): ThemeColors {
  return themeTokens[useColorScheme() === "dark" ? "dark" : "light"];
}
