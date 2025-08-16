import type React from "react";

// Shared pastel palette for the pastel-rotate text effect
export const PASTEL_ROTATE_PALETTE = ["#F8B4D9", "#B5E4FA", "#FDE1A9", "#C7F9CC", "#E5D9FA", "#FFE5EC"];

export interface PastelRotateTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

/**
 * Renders text with per-character static pastel colors matching the 'pastel-rotate' effect.
 * Spaces are preserved and an aria-label is provided for accessibility.
 */
export const PastelRotateText: React.FC<PastelRotateTextProps> = ({ text, className, style, title: ariaLabel }) => {
  return (
    <span className={className} style={style} title={ariaLabel || text}>
      {Array.from(text).map((ch, i) => {
        const key = `${ch}-${i}`;
        if (ch === " ")
          return (
            <span key={key} style={{ whiteSpace: "pre" }}>
              {" "}
            </span>
          );
        const color = PASTEL_ROTATE_PALETTE[i % PASTEL_ROTATE_PALETTE.length];
        return (
          <span key={key} style={{ color }}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};

export default PastelRotateText;
