import type { PropsWithChildren } from "react";
import Animated, { FadeIn, FadeOut, ReduceMotion, useReducedMotion } from "react-native-reanimated";

export function Motion({ children }: PropsWithChildren) {
  const reducedMotion = useReducedMotion();
  return <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(220).reduceMotion(ReduceMotion.System)} exiting={reducedMotion ? undefined : FadeOut.duration(140).reduceMotion(ReduceMotion.System)}>{children}</Animated.View>;
}
