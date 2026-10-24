export const themeTokens = {
  light: {
    background: "#F8F6FF",
    surface: "#FFFFFF",
    surfaceSoft: "#F0EBFF",
    primary: "#6526CF",
    primaryPressed: "#4F1AA9",
    primarySoft: "#E7DEFF",
    text: "#21164A",
    textSecondary: "#716A87",
    outline: "#E5DFF2",
    error: "#B42335",
    success: "#16794C"
  },
  dark: {
    background: "#151021",
    surface: "#21192F",
    surfaceSoft: "#302449",
    primary: "#B69AFF",
    primaryPressed: "#CDBAFF",
    primarySoft: "#40305F",
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
export const radii = { input: 18, card: 20, panel: 28, pill: 999 } as const;
