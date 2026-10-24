export const motionDurations = { quick: 140, standard: 220, emphasis: 320 } as const;

export function immediateWhenReduced<T>(reducedMotion: boolean, animated: T, immediate: T): T {
  return reducedMotion ? immediate : animated;
}
