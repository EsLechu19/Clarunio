import { describe, expect, it } from "vitest";

import { COMPACT_WIDTH, getResponsiveMetrics } from "../src/shared/ui/responsive";

describe("responsive metrics", () => {
  it("uses the compact layout below 360 dp without device-specific widths", () => {
    expect(getResponsiveMetrics(COMPACT_WIDTH - 1)).toMatchObject({ isCompact: true, horizontalPadding: 16, titleSize: 30 });
    expect(getResponsiveMetrics(COMPACT_WIDTH)).toMatchObject({ isCompact: false, horizontalPadding: 24, titleSize: 36 });
  });

  it("keeps safe areas out of the available content and raises the FAB above navigation", () => {
    const metrics = getResponsiveMetrics(393, 0, 0, 24);
    expect(metrics.availableWidth).toBe(345);
    expect(metrics.fabBottom).toBe(102);
    expect(metrics.contentBottomPadding).toBe(118);
  });
});
