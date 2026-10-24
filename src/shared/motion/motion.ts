import { Easing } from "react-native-reanimated";
import { motionDurations } from "./tokens";

export const motion = {
  duration: motionDurations,
  easing: { standard: Easing.out(Easing.cubic), emphasized: Easing.out(Easing.quad) }
} as const;
