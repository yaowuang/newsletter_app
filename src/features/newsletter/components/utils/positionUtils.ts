/**
 * Utilities for positioning horizontal lines based on grid layout definitions
 */
import type { HorizontalLineElementType, LayoutSelectionType } from "@/features/newsletter/types";

export type PositionReference = {
  position: "afterTitle" | "afterDate" | "beforeSections" | "afterSections" | "betweenSections" | "afterSection";
  sectionIndex?: number;
};

/**
 * Calculate predefined positions for horizontal lines based on grid layout
 * These positions account for CSS grid auto-sizing and row gaps
 */
export function getGridBasedLinePosition(
  reference: PositionReference,
  layoutSelection: LayoutSelectionType,
): { x: number; y: number; width: number } {
  // Standard newsletter layout dimensions (8.5" x 11" with 32px padding)
  const canvasPadding = 32;
  const canvasWidth = 8.5 * 96 - canvasPadding * 2; // 8.5 inches at 96 DPI minus padding

  // Get alignment from layout variant
  const { variant } = layoutSelection;
  const titleAlign = variant.titleAlign || "center";
  const dateAlign = variant.dateAlign || "center";

  // Estimate typical element heights based on CSS grid auto sizing
  // These are based on typical font sizes and line heights in newsletter layouts
  const titleHeight = 48; // ~3rem title with typical line height
  const dateHeight = 24; // ~1.5rem date text
  const rowGap = 24; // Row gap from the grid (denseMode ? 12px : 24px, using non-dense)
  const baseY = canvasPadding; // Account for canvas padding

  // Calculate Y positions based on grid row structure
  // All layouts start with: 'auto auto ...' = title, date, then sections
  const titleEndY = baseY + titleHeight;
  const dateStartY = titleEndY + rowGap;
  const dateEndY = dateStartY + dateHeight;
  const sectionsStartY = dateEndY + rowGap;

  // Calculate line width and position based on content type and alignment
  const getLineMetrics = (align: string, isTitle: boolean = false) => {
    // Line widths should be proportional to content, not full width
    const shortLineWidth = Math.min(200, canvasWidth * 0.3); // 30% of canvas or 200px max
    const mediumLineWidth = Math.min(300, canvasWidth * 0.5); // 50% of canvas or 300px max
    const longLineWidth = Math.min(400, canvasWidth * 0.7); // 70% of canvas or 400px max

    let width = isTitle ? mediumLineWidth : shortLineWidth;
    let x = canvasPadding;

    switch (align) {
      case "left":
        x = canvasPadding;
        width = isTitle ? longLineWidth : mediumLineWidth;
        break;
      case "right":
        width = isTitle ? longLineWidth : mediumLineWidth;
        x = canvasPadding + canvasWidth - width;
        break;
      case "center":
      default:
        width = isTitle ? mediumLineWidth : shortLineWidth;
        x = canvasPadding + (canvasWidth - width) / 2;
        break;
    }

    return { x, width };
  };

  // Position-specific calculations using calculated Y positions
  const positions = {
    // After title - positioned right after title element with small gap
    afterTitle: () => {
      const { x, width } = getLineMetrics(titleAlign, true);
      return { x, y: titleEndY, width }; // 8px gap after title
    },

    // After date - positioned right after date element with no gap
    afterDate: () => {
      const { x, width } = getLineMetrics(dateAlign, false);
      return { x, y: dateEndY, width }; // no gap after date
    },

    // Before sections - positioned just before sections start
    beforeSections: () => {
      const { x, width } = getLineMetrics("center", false);
      return { x, y: sectionsStartY, width }; // 8px gap before sections
    },

    // Between sections - positioned in middle of content area
    betweenSections: () => {
      const { x, width } = getLineMetrics("center", false);
      // Estimate middle position based on typical content height
      const middleY = sectionsStartY + 200; // ~200px into content area
      return { x, y: middleY, width };
    },

    // After sections - positioned near bottom of typical content
    afterSections: () => {
      const { x, width } = getLineMetrics("center", false);
      // Position based on typical newsletter height minus bottom margin
      const bottomY = 11 * 96 - canvasPadding - 80; // 11" page minus padding and bottom margin
      return { x, y: bottomY, width };
    },
  };

  // Handle section-specific positioning
  if (reference.position === "afterSection" && typeof reference.sectionIndex === "number") {
    // Position after specific sections based on estimated section heights
    const baseY = sectionsStartY;
    const sectionHeight = 120; // Estimated average section height
    const y = baseY + (reference.sectionIndex + 1) * sectionHeight + 8; // 8px gap after section
    const { x, width } = getLineMetrics("center", false);

    return { x, y, width };
  }

  // Return calculated position or fallback
  const positionFunc = positions[reference.position as keyof typeof positions];
  return positionFunc ? positionFunc() : positions.afterTitle();
}

/**
 * Check if a horizontal line needs position updates based on layout changes
 * This is much simpler now - only update when the layout itself changes
 */
export function shouldUpdateLinePosition(
  line: HorizontalLineElementType,
  layoutSelection: LayoutSelectionType,
): boolean {
  if (!line.autoGenerated || !line.decorationKey) return false;

  // Parse decoration key to check if it matches current layout
  const keyParts = line.decorationKey.split(":");
  const layoutId = keyParts[0];
  const variantName = keyParts[1];

  return layoutId !== layoutSelection.base.id || variantName !== layoutSelection.variant.name;
}

/**
 * Update horizontal line positions based on grid layout (not DOM measurements)
 */
export function updateHorizontalLinePositions(
  horizontalLines: HorizontalLineElementType[],
  layoutSelection: LayoutSelectionType,
  updateCallback: (id: string, updates: Partial<HorizontalLineElementType>) => void,
) {
  horizontalLines
    .filter((line) => line.autoGenerated && line.decorationKey)
    .forEach((line) => {
      // Parse the decoration key to get position info
      const keyParts = line.decorationKey!.split(":");
      if (keyParts.length >= 3) {
        const position = keyParts[2] as PositionReference["position"];
        const sectionIndex = keyParts[3] ? parseInt(keyParts[3]) : undefined;

        const reference: PositionReference = {
          position,
          sectionIndex,
        };

        const newPosition = getGridBasedLinePosition(reference, layoutSelection);

        // Only update if position has changed significantly
        const hasChanged =
          Math.abs(line.x - newPosition.x) > 5 ||
          Math.abs(line.y - newPosition.y) > 5 ||
          Math.abs((line.width as number) - newPosition.width) > 20;

        if (hasChanged) {
          updateCallback(line.id, {
            x: newPosition.x,
            y: newPosition.y,
            width: newPosition.width,
          });
        }
      }
    });
}
