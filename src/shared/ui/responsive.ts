export const COMPACT_WIDTH = 360;
export const TAB_BAR_HEIGHT = 70;

export type ResponsiveMetrics = {
  width: number;
  availableWidth: number;
  isCompact: boolean;
  horizontalPadding: number;
  titleSize: number;
  contentBottomPadding: number;
  fabBottom: number;
};

export function getResponsiveMetrics(width: number, insetLeft = 0, insetRight = 0, insetBottom = 0): ResponsiveMetrics {
  const isCompact = width < COMPACT_WIDTH;
  const horizontalPadding = isCompact ? 16 : 24;
  return {
    width,
    availableWidth: Math.max(0, width - insetLeft - insetRight - horizontalPadding * 2),
    isCompact,
    horizontalPadding,
    titleSize: isCompact ? 30 : 36,
    contentBottomPadding: TAB_BAR_HEIGHT + Math.max(insetBottom, 16) + 24,
    fabBottom: TAB_BAR_HEIGHT + Math.max(insetBottom, 8) + 8,
  };
}
