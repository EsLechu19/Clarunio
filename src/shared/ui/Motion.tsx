import type { PropsWithChildren } from "react";
import Animated, { FadeIn, FadeOut, ReduceMotion, SlideInDown, useReducedMotion } from "react-native-reanimated";

export function Motion({ children, variant = "default" }: PropsWithChildren<{ variant?: "default" | "capture" }>) {
  const reducedMotion = useReducedMotion();
  const entering = variant === "capture" ? SlideInDown.duration(280) : FadeIn.duration(220);
  return <Animated.View entering={reducedMotion ? undefined : entering.reduceMotion(ReduceMotion.System)} exiting={reducedMotion ? undefined : FadeOut.duration(140).reduceMotion(ReduceMotion.System)}>{children}</Animated.View>;
}
