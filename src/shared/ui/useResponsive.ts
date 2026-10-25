import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getResponsiveMetrics } from "./responsive";
import type { ResponsiveMetrics } from "./responsive";

export function useResponsive(): ResponsiveMetrics {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return getResponsiveMetrics(width, insets.left, insets.right, insets.bottom);
}

export { getResponsiveMetrics } from "./responsive";
export type { ResponsiveMetrics } from "./responsive";
