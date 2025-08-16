import type React from "react";

// Rainbow palette for the rainbow-rotate text effect
export const RAINBOW_ROTATE_PALETTE = ["#E91E63", "#2196F3", "#FF9800", "#4CAF50", "#9C27B0", "#F44336"];

export interface RainbowRotateTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

/**
 * Renders text with per-character static rainbow colors matching the 'rainbow-rotate' effect.
 * Spaces are preserved and an aria-label is provided for accessibility.
 */
export const RainbowRotateText: React.FC<RainbowRotateTextProps> = ({ text, className, style, title }) => {
  return (
    <span className={className} style={style} title={title || text}>
      {Array.from(text).map((ch, i) => {
        const key = `${ch}-${i}`;
        if (ch === " ")
          return (
            <span key={key} style={{ whiteSpace: "pre" }}>
              {" "}
            </span>
          );
        const color = RAINBOW_ROTATE_PALETTE[i % RAINBOW_ROTATE_PALETTE.length];
        return (
          <span key={key} style={{ color }}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};

export default RainbowRotateText;
