import { Easing } from "react-native-reanimated";

export const motion = {
  duration: { quick: 140, standard: 220, emphasis: 320 },
  easing: { standard: Easing.out(Easing.cubic), emphasized: Easing.out(Easing.quad) }
} as const;

export function immediateWhenReduced<T>(reducedMotion: boolean, animated: T, immediate: T): T {
  return reducedMotion ? immediate : animated;
}
