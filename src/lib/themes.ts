import { CSSProperties } from "react";

export type Theme = {
  name: string;
  styles: {
    page: {
      backgroundColor: CSSProperties['backgroundColor'];
      backgroundImage?: CSSProperties['backgroundImage'];
      backgroundSize?: CSSProperties['backgroundSize'];
      backgroundPosition?: CSSProperties['backgroundPosition'];
      backgroundRepeat?: CSSProperties['backgroundRepeat'];
      backgroundImageOpacity?: number; // 0..1 added
    };
    title: {
      fontFamily: CSSProperties['fontFamily'];
      color: CSSProperties['color'];
      textAlign?: CSSProperties['textAlign']; // added
      backgroundImage?: CSSProperties['backgroundImage']; // for gradients
      backgroundColor?: CSSProperties['backgroundColor']; // for solid backgrounds
      backgroundSize?: CSSProperties['backgroundSize'];
      WebkitBackgroundClip?: CSSProperties['WebkitBackgroundClip'];
      backgroundClip?: CSSProperties['backgroundClip'];
      animation?: CSSProperties['animation'];
      textShadow?: CSSProperties['textShadow'];
      filter?: CSSProperties['filter'];
      transform?: CSSProperties['transform'];
      // Text effect tracking
      textEffectId?: string;
    };
    date: {
      fontFamily: CSSProperties['fontFamily'];
      color: CSSProperties['color'];
      textAlign?: CSSProperties['textAlign']; // added
    };
    section: {
      headingColor?: CSSProperties['color'];
      headingBackgroundColor?: CSSProperties['backgroundColor'];
      headingFontFamily?: CSSProperties['fontFamily'];
      contentColor?: CSSProperties['color'];
      contentFontFamily?: CSSProperties['fontFamily'];
      backgroundColor?: CSSProperties['backgroundColor'];
      borderColor?: CSSProperties['borderColor'];
      // borderRadius now numeric px value for consistency with SectionStyle
      borderRadius?: number;
    }
  }
  // Optional list of preferred horizontal line style ids in order of priority
  preferredLineIds?: string[];
};

export const allThemes: Theme[] = [
  {
    name: 'Default',
    styles: {
      page: { 
        backgroundColor: '#FEF7E6', // Warm cream background that's easy on the eyes
        backgroundImage: "url(creamy.jpg)",
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat', 
        backgroundPosition: 'top left',
        backgroundImageOpacity: 1 // SVG already has transparency built in
      },
      title: { 
        fontFamily: 'Fredoka', // Playful, kid-friendly font 
        color: 'transparent', // Make text transparent to show gradient
        backgroundImage: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD, #FF8A80)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        textAlign: 'center',
        textEffectId: 'rainbow' // Track which effect is applied
      },
      date: { 
        fontFamily: 'Comic Neue', // Fun, readable comic-style font
        color: '#F59E0B', // Sunny orange for warmth
        textAlign: 'center'
      },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#10B981', // Vibrant emerald green
        headingFontFamily: 'Fredoka',
        contentColor: '#1F2937', // Dark gray for excellent readability
        contentFontFamily: 'Comic Neue',
        backgroundColor: '#FFFFFF',
        borderColor: '#A7F3D0', // Light mint green border
        borderRadius: 18, // More rounded for a friendlier look
      }
    },
    preferredLineIds: ['stars','hearts','classic-solid','wavy']
  },
  {
    name: 'Ocean Blue',
    styles: {
      page: { backgroundColor: '#F0F9FF' },
      title: { fontFamily: 'Raleway', color: '#075985' },
      date: { fontFamily: 'Lato', color: '#0EA5E9' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#0EA5E9',
        headingFontFamily: 'Raleway',
        contentColor: '#082F49',
        contentFontFamily: 'Lato',
        backgroundColor: '#FFFFFF',
        borderColor: '#BAE6FD',
        borderRadius: 16, // 1rem
      }
    },
    preferredLineIds: ['wavy','classic-solid']
  },
  {
    name: 'Forest Green',
    styles: {
      page: { backgroundColor: '#F0FDF4' },
      title: { fontFamily: 'Merriweather', color: '#14532D' },
      date: { fontFamily: 'Nunito', color: '#15803D' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#15803D',
        headingFontFamily: 'Merriweather',
        contentColor: '#14532D',
        contentFontFamily: 'Nunito',
        backgroundColor: '#FFFFFF',
        borderColor: '#BBF7D0',
        borderRadius: 16,
      }
    },
    preferredLineIds: ['clover','classic-solid']
  },
  {
    name: 'Tropical Paradise',
    styles: {
      page: { 
        backgroundColor: '#FFF8DC', 
        backgroundImage: 'url(/beach-waves.svg)', 
        backgroundSize: '400px 400px', 
        backgroundRepeat: 'repeat', 
        backgroundPosition: 'top left',
        backgroundImageOpacity: 0.15
      },
      title: { 
        fontFamily: 'var(--font-righteous)', 
        color: 'transparent',
        backgroundImage: 'linear-gradient(45deg, #FF4500, #FFD700, #FF4500, #FF6347)',
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        textShadow: '0 0 10px rgba(255, 69, 0, 0.8)',
        textAlign: 'center',
        textEffectId: 'fire'
      },
      date: { fontFamily: 'var(--font-comfortaa)', color: '#FF6347', textAlign: 'center' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#FF6347',
        headingFontFamily: 'var(--font-righteous)',
        contentColor: '#8B4513',
        contentFontFamily: 'var(--font-comfortaa)',
        backgroundColor: '#FFFFFF',
        borderColor: '#FFD700',
        borderRadius: 20,
      }
    },
    preferredLineIds: ['beachball','wavy','classic-solid']
  },
  {
    name: 'Beach Day',
    styles: {
      page: { 
        backgroundColor: '#F0F8FF',
        backgroundImage: 'url(/beach-waves.svg)', 
        backgroundSize: '300px 300px', 
        backgroundRepeat: 'repeat', 
        backgroundPosition: 'bottom',
        backgroundImageOpacity: 0.2
      },
      title: { 
        fontFamily: 'var(--font-kalam)', 
        color: 'transparent',
        backgroundImage: 'linear-gradient(45deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        textAlign: 'center',
        textEffectId: 'ocean'
      },
      date: { fontFamily: 'var(--font-comfortaa)', color: '#FF8C00', textAlign: 'center' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#00BFFF',
        headingFontFamily: 'var(--font-kalam)',
        contentColor: '#2F4F4F',
        contentFontFamily: 'var(--font-comfortaa)',
        backgroundColor: '#FFFFFF',
        borderColor: '#87CEEB',
        borderRadius: 16,
      }
    },
    preferredLineIds: ['beachball','wavy','classic-solid']
  },
  {
    name: 'Summer',
    styles: {
      page: { 
        backgroundColor: '#FFFACD'
      },
      title: { 
        fontFamily: 'var(--font-righteous)', 
        color: 'transparent',
        backgroundImage: 'linear-gradient(45deg, #FF512F, #F09819)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        textAlign: 'center',
        textEffectId: 'sunset'
      },
      date: { fontFamily: 'var(--font-kalam)', color: '#FF8C00', textAlign: 'center' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#FF8C00',
        headingFontFamily: 'var(--font-righteous)',
        contentColor: '#8B4513',
        contentFontFamily: 'var(--font-kalam)',
        backgroundColor: '#FFFFFF',
        borderColor: '#FFD700',
        borderRadius: 18,
      }
    },
    preferredLineIds: ['beachball','wavy','classic-solid']
  },
  {
    name: 'Sunset',
    styles: {
      page: { backgroundColor: '#FFF7ED' },
      title: { fontFamily: 'Playfair Display', color: '#9A3412' },
      date: { fontFamily: 'Lato', color: '#EA580C' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#F97316',
        headingFontFamily: 'Playfair Display',
        contentColor: '#451A03',
        contentFontFamily: 'Lato',
        backgroundColor: '#FFEDD5',
        borderColor: '#FED7AA',
        borderRadius: 16,
      }
    },
    preferredLineIds: ['classic-dotted','classic-solid']
  },
  {
    name: 'Halloween',
    styles: {
      page: { backgroundColor: '#1a1a1a' },
      title: { 
        fontFamily: 'Creepster', 
        color: '#FF7518',
        textShadow: '-2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff',
        textEffectId: 'white-outline'
      },
      date: { fontFamily: 'Merriweather', color: '#A0A0A0' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#000000',
        headingFontFamily: 'Creepster',
        contentColor: '#EAEAEA',
        contentFontFamily: 'Merriweather',
        backgroundColor: '#2a2a2a',
        borderColor: '#FF7518',
        borderRadius: 8, // 0.5rem
      }
    }
  },
  {
    name: 'Winter Holiday',
    styles: {
      // Slightly darkened from #EBF4FA to improve contrast with white snowflakes
      page: { backgroundColor: '#D6E7F2', backgroundImage: 'url(/snowflakes.svg)', backgroundSize: '300px 300px', backgroundRepeat: 'repeat', backgroundPosition: 'top left' },
      title: { fontFamily: 'var(--font-mountains-of-christmas)', color: '#0047AB' },
      date: { fontFamily: 'Playfair Display', color: '#B22222' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#0047AB',
        headingFontFamily: 'var(--font-mountains-of-christmas)',
        contentColor: '#1C3F6E',
        contentFontFamily: 'Playfair Display',
        backgroundColor: '#FFFFFF',
        borderColor: '#B22222',
        borderRadius: 16,
      }
    }
  },
  {
    name: 'Valentine\'s Day',
    styles: {
      page: { backgroundColor: '#FFF0F5', backgroundImage: 'url(/hearts.svg)', backgroundSize: '200px 200px', backgroundRepeat: 'repeat', backgroundPosition: 'top left', backgroundImageOpacity: 0.1 },
      title: { fontFamily: 'Pacifico', color: '#D90166' },
      date: { fontFamily: 'Raleway', color: '#FF69B4' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#FF69B4',
        headingFontFamily: 'Pacifico',
        contentColor: '#8B0000',
        contentFontFamily: 'Raleway',
        backgroundColor: '#FFFFFF',
        borderColor: '#FFC0CB',
        borderRadius: 16,
      }
    }
  },
  {
    name: 'Patriotic',
    styles: {
      page: {
        backgroundColor: '#F0F4F8',
        backgroundImage: 'url(/United_States_flag_waving_icon.svg)',
        backgroundSize: 'contain',
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
        backgroundImageOpacity: 0.25,
      },
      title: { fontFamily: 'Ultra', color: '#0D2244' },
      date: { fontFamily: 'Roboto Condensed', color: '#B22234' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#0D2244',
        headingFontFamily: 'Ultra',
        contentColor: '#212121',
        contentFontFamily: 'Roboto Condensed',
        backgroundColor: '#FFFFFF',
        borderColor: '#B22234',
        borderRadius: 8,
      }
    }
  },
  {
    name: 'Storybook',
    styles: {
      page: { backgroundColor: '#FFFDF8' },
      title: { fontFamily: 'Fredoka', color: '#5A3E85' },
      date: { fontFamily: 'Comic Neue', color: '#8B6BB5' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#5A3E85',
        headingFontFamily: 'Fredoka',
        contentColor: '#3A2A55',
        contentFontFamily: 'Comic Neue',
        backgroundColor: '#FFFFFF',
        borderColor: '#E4D9F7',
        borderRadius: 16,
      }
    }
  },
  {
    name: 'Arcade',
    styles: {
      page: { backgroundColor: '#0D0F17' },
      title: { 
        fontFamily: 'var(--font-share-tech-mono)', 
        color: '#FF00FF',
        textShadow: '1px 1px 0px #00FFFF, 2px 2px 0px #00FFFF, 3px 3px 0px #00FFFF, 4px 4px 0px #00FFFF',
        textEffectId: 'retro-3d'
      },
      date: { fontFamily: 'Orbitron', color: '#08F7FE' },
      section: {
        headingColor: '#0D0F17',
        headingBackgroundColor: '#08F7FE',
        headingFontFamily: 'var(--font-share-tech-mono)',
        contentColor: '#E6E6E6',
        contentFontFamily: 'Orbitron',
        backgroundColor: '#1A1F2B',
        borderColor: '#39FF14',
        borderRadius: 12,
      }
    }
  },
  {
    name: 'Comic Boom',
    styles: {
      page: { backgroundColor: '#FFF8E1',
        backgroundImage: 'url(/halftone.svg)',
        backgroundSize: 'contain',
        backgroundPosition: 'left',
        backgroundRepeat: 'repeat',
        backgroundImageOpacity: 0.1,
      },
      title: { 
        fontFamily: 'Bangers', 
        color: '#FF1744',
        textShadow: '3px 3px 0px #000000, 6px 6px 0px #FFD700',
        transform: 'rotate(-2deg)',
        textEffectId: 'comic-pop'
      },
      date: { fontFamily: 'Comic Neue', color: '#3949AB' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#D81B60',
        headingFontFamily: 'Bangers',
        contentColor: '#212121',
        contentFontFamily: 'Comic Neue',
        backgroundColor: '#FFFFFF',
        borderColor: '#FFCDD2',
        borderRadius: 16,
      }
    }
  },
  {
    name: 'Galaxy Mission',
    styles: {
      page: { backgroundColor: '#05060A', backgroundImage: 'url(/starfield.svg)', backgroundSize: '400px 400px', backgroundRepeat: 'repeat', backgroundPosition: 'top left' },
      title: { 
        fontFamily: 'Orbitron', 
        color: '#ffffff',
        textShadow: '0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 15px #39FF14, 0 0 20px #39FF14',
        textEffectId: 'neon-glow'
      },
      date: { fontFamily: 'var(--font-share-tech-mono)', color: '#2CB67D' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#7F5AF0',
        headingFontFamily: 'Orbitron',
        contentColor: '#D9D9E3',
        contentFontFamily: 'var(--font-share-tech-mono)',
        backgroundColor: '#161B22',
        borderColor: '#2CB67D',
        borderRadius: 12,
      }
    }
  },
  {
    name: 'Western',
    styles: {
      page: { backgroundColor: '#FCF7EE', backgroundImage: 'url(/western.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundImageOpacity: 0.5 },
      title: { 
        fontFamily: 'Rye', 
        color: '#5C3B18',
        textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)',
        textEffectId: 'bold-shadow'
      },
      date: { fontFamily: 'Special Elite', color: '#A36833' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#8B5A2B',
        headingFontFamily: 'Rye',
        contentColor: '#4A3624',
        contentFontFamily: 'Special Elite',
        backgroundColor: '#FFFDF9',
        borderColor: '#D9BA94',
        borderRadius: 8,
      }
    }
  },
  {
    name: 'Hollywood',
    styles: {
      page: { backgroundColor: '#0B0B0D' },
      title: { 
        fontFamily: 'Cinzel Decorative', 
        color: '#ffffff',
        textShadow: '0 0 5px #FF8C00, 0 0 10px #FF8C00, 0 0 15px #FF8C00',
        textEffectId: 'warm-glow'
      },
      date: { fontFamily: 'Cinzel', color: '#C0C0C0' },
      section: {
        headingColor: '#0B0B0D',
        headingBackgroundColor: '#FFD700',
        headingFontFamily: 'Cinzel Decorative',
        contentColor: '#E4E4E4',
        contentFontFamily: 'Cinzel',
        backgroundColor: '#141417',
        borderColor: '#FFD700',
        borderRadius: 12,
      }
    }
  },
  {
    name: 'Magazine',
    styles: {
      page: { backgroundColor: '#F5F6F8' },
      title: { fontFamily: 'Oswald', color: '#111827' },
      date: { fontFamily: 'var(--font-source-sans3)', color: '#6B7280' },
      section: {
        headingColor: '#111827',
        headingBackgroundColor: '#E5E7EB',
        headingFontFamily: 'Oswald',
        contentColor: '#374151',
        contentFontFamily: 'var(--font-source-sans3)',
        backgroundColor: '#FFFFFF',
        borderColor: '#D1D5DB',
        borderRadius: 12,
      }
    }
  },
  {
    name: 'Christmas',
    styles: {
      page: { backgroundColor: '#C8B292', backgroundImage: 'url(/snowflakes.svg)', backgroundSize: '300px 300px', backgroundRepeat: 'repeat', backgroundPosition: 'top left' },
      title: { fontFamily: 'var(--font-mountains-of-christmas)', color: '#B3001B' },
      date: { fontFamily: 'Playfair Display', color: '#0F8A0F' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#B3001B',
        headingFontFamily: 'var(--font-mountains-of-christmas)',
        contentColor: '#1F3D1F',
        contentFontFamily: 'Merriweather',
        backgroundColor: '#FFFFFF',
        borderColor: '#0F8A0F',
        borderRadius: 16,
      }
    }
  },
  {
    name: 'Thanksgiving',
    styles: {
      page: { backgroundColor: '#FFF8F0' },
      title: { fontFamily: 'Alegreya SC', color: '#8B4513' },
      date: { fontFamily: 'Lora', color: '#D2691E' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#D2691E',
        headingFontFamily: 'Alegreya SC',
        contentColor: '#4A3624',
        contentFontFamily: 'Lora',
        backgroundColor: '#FFFFFF',
        borderColor: '#F4C28A',
        borderRadius: 12,
      }
    }
  },
  {
    name: "St. Patrick's Day",
    styles: {
      page: {
        backgroundColor: '#F0FFF4',
        // Two-layer staggered ("diamond") tiling: second layer offset to create diagonal pattern
        backgroundImage: 'url(/clover.svg)',
        backgroundSize: '100px 100px',
        backgroundPosition: 'center', 
        backgroundRepeat: 'repeat',
        backgroundImageOpacity: 0.1,
      },
      title: { fontFamily: 'Irish Grover', color: '#065F46' },
      date: { fontFamily: 'Nunito', color: '#059669' },
      section: {
        headingColor: '#FFFFFF',
        headingBackgroundColor: '#059669',
        headingFontFamily: 'Irish Grover',
        contentColor: '#064E3B',
        contentFontFamily: 'Nunito',
        backgroundColor: '#FFFFFF',
        borderColor: '#34D399',
        borderRadius: 16,
      }
    }
  }
];
