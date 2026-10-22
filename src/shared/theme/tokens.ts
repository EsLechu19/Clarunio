export const themeTokens = {
  light: {
    background: "#FAF8FF",
    surface: "#FFFFFF",
    surfaceSoft: "#F3EEFF",
    primary: "#6526CF",
    primaryPressed: "#4F1AA9",
    primarySoft: "#EDE4FF",
    text: "#21133F",
    textSecondary: "#655C78",
    outline: "#E7E0F2",
    error: "#B42335",
    success: "#16794C"
  },
  dark: {
    background: "#151021",
    surface: "#21192F",
    surfaceSoft: "#2C2141",
    primary: "#B69AFF",
    primaryPressed: "#CDBAFF",
    primarySoft: "#3A2C57",
    text: "#F7F2FF",
    textSecondary: "#C9BFDC",
    outline: "#463955",
    error: "#FF9BA8",
    success: "#7BE0AE"
  }
} as const;

export type ThemeMode = keyof typeof themeTokens;
export type ThemeColors = (typeof themeTokens)[ThemeMode];

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radii = { input: 14, card: 20, panel: 26, pill: 999 } as const;
