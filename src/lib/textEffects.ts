import type { CSSProperties } from "react";

export type TextEffect = {
  id: string;
  name: string;
  description: string;
  styles: {
    color?: CSSProperties["color"];
    backgroundImage?: CSSProperties["backgroundImage"];
    backgroundColor?: CSSProperties["backgroundColor"];
    backgroundSize?: CSSProperties["backgroundSize"];
    WebkitBackgroundClip?: CSSProperties["WebkitBackgroundClip"];
    backgroundClip?: CSSProperties["backgroundClip"];
    textShadow?: CSSProperties["textShadow"];
    filter?: CSSProperties["filter"];
    transform?: CSSProperties["transform"];
  };
  category: "gradient" | "shadow" | "glow" | "outline" | "special";
};

export const textEffects: TextEffect[] = [
  // Gradient Effects
  {
    id: "rainbow",
    name: "Rainbow",
    description: "Colorful rainbow gradient",
    category: "gradient",
    styles: {
      color: "transparent",
      backgroundImage: "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD, #FF8A80)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
    },
  },
  {
    id: "pastel-rotate",
    name: "Pastel Rotate",
    description: "Each character cycles through soft pastel colors",
    category: "special",
    styles: {
      // Base color acts as fallback; actual per-char colors applied in component when this effect id is detected
      color: "#ffffff",
    },
  },
  {
    id: "rainbow-rotate",
    name: "Rainbow Rotate",
    description: "Each character cycles through bold rainbow colors",
    category: "special",
    styles: {
      // Base color acts as fallback; actual per-char colors applied in component when this effect id is detected
      color: "#ffffff",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm sunset gradient",
    category: "gradient",
    styles: {
      color: "transparent",
      backgroundImage: "linear-gradient(45deg, #FF512F, #F09819)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool ocean gradient",
    category: "gradient",
    styles: {
      color: "transparent",
      backgroundImage: "linear-gradient(45deg, #667eea, #764ba2)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Nature-inspired green gradient",
    category: "gradient",
    styles: {
      color: "transparent",
      backgroundImage: "linear-gradient(45deg, #134E5E, #71B280)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
    },
  },
  {
    id: "candy",
    name: "Candy",
    description: "Sweet candy gradient",
    category: "gradient",
    styles: {
      color: "transparent",
      backgroundImage: "linear-gradient(45deg, #FC466B, #3FCFEC)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
    },
  },

  // Shadow Effects
  {
    id: "soft-shadow",
    name: "Soft Shadow",
    description: "Gentle drop shadow",
    category: "shadow",
    styles: {
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
    },
  },
  {
    id: "bold-shadow",
    name: "Bold Shadow",
    description: "Strong drop shadow",
    category: "shadow",
    styles: {
      textShadow: "3px 3px 6px rgba(0, 0, 0, 0.5)",
    },
  },
  {
    id: "colorful-shadow",
    name: "Colorful Shadow",
    description: "Vibrant colored shadow",
    category: "shadow",
    styles: {
      textShadow: "2px 2px 0px #FF6B6B, 4px 4px 0px #4ECDC4, 6px 6px 0px #45B7D1",
    },
  },

  // Glow Effects
  {
    id: "neon-glow",
    name: "Neon Glow",
    description: "Electric neon glow",
    category: "glow",
    styles: {
      color: "#ffffff", // White text to contrast with green glow
      textShadow: "0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 15px #39FF14, 0 0 20px #39FF14",
    },
  },
  {
    id: "blue-glow",
    name: "Blue Glow",
    description: "Cool blue glow",
    category: "glow",
    styles: {
      color: "#ffffff", // White text to contrast with blue glow
      textShadow: "0 0 5px #00BFFF, 0 0 10px #00BFFF, 0 0 15px #00BFFF",
    },
  },
  {
    id: "warm-glow",
    name: "Warm Glow",
    description: "Warm orange glow",
    category: "glow",
    styles: {
      color: "#ffffff", // White text to contrast with orange glow
      textShadow: "0 0 5px #FF8C00, 0 0 10px #FF8C00, 0 0 15px #FF8C00",
    },
  },

  // Outline Effects
  {
    id: "black-outline",
    name: "Black Outline",
    description: "Classic black outline",
    category: "outline",
    styles: {
      textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
    },
  },
  {
    id: "white-outline",
    name: "White Outline",
    description: "Clean white outline",
    category: "outline",
    styles: {
      textShadow: "-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff",
    },
  },

  // Special Effects
  {
    id: "comic-pop",
    name: "Comic Pop",
    description: "Fun comic book style",
    category: "special",
    styles: {
      color: "#FF1744",
      textShadow: "3px 3px 0px #000000, 6px 6px 0px #FFD700",
      transform: "rotate(-2deg)",
    },
  },
  {
    id: "retro-3d",
    name: "Retro 3D",
    description: "Classic 80s 3D effect",
    category: "special",
    styles: {
      color: "#FF00FF",
      textShadow: "1px 1px 0px #00FFFF, 2px 2px 0px #00FFFF, 3px 3px 0px #00FFFF, 4px 4px 0px #00FFFF",
    },
  },
  {
    id: "fire",
    name: "Fire",
    description: "Blazing fire effect",
    category: "special",
    styles: {
      color: "transparent",
      backgroundImage: "linear-gradient(45deg, #FF4500, #FFD700, #FF4500, #FF6347)",
      backgroundSize: "200% 200%",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(255, 69, 0, 0.6)",
    },
  },
];

// Helper function to get effect by ID
export function getTextEffectById(id: string): TextEffect | undefined {
  return textEffects.find((effect) => effect.id === id);
}

// Helper function to get effects by category
export function getTextEffectsByCategory(category: TextEffect["category"]): TextEffect[] {
  return textEffects.filter((effect) => effect.category === category);
}

import type { ThemeType } from "./themes";

// Helper function to apply text effect to CSS properties
export function applyTextEffect(
  baseStyles: ThemeType["styles"]["title"],
  effectId?: string,
): ThemeType["styles"]["title"] {
  if (!effectId) return baseStyles;

  const effect = getTextEffectById(effectId);
  if (!effect) return baseStyles;

  // Create a new styles object starting with baseStyles
  const newStyles = { ...baseStyles };

  // If applying a gradient effect, remove any glow properties
  if (effect.category === "gradient") {
    // Always remove glow-related properties when applying gradient
    delete newStyles.textShadow;
    // Apply gradient styles which will set color to transparent
    return {
      ...newStyles,
      ...effect.styles,
    };
  }

  // If applying a glow effect, remove any gradient properties
  if (effect.category === "glow") {
    // Always remove gradient-related properties when applying glow
    delete newStyles.backgroundImage;
    delete newStyles.WebkitBackgroundClip;
    delete newStyles.backgroundClip;
    delete newStyles.backgroundSize;
    // Apply glow styles which will set color to white
    return {
      ...newStyles,
      ...effect.styles,
    };
  }

  // For other effect types, just apply normally
  return {
    ...newStyles,
    ...effect.styles,
  };
}
