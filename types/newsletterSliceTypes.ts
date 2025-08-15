// Types for newsletter slice
import { LayoutDecorationType } from '@/features/newsletter/utils/layouts';
import { TextBlockType } from '@/features/newsletter/types';
import { ThemeType } from '@/lib/themes';

export interface LayoutBase {
  id: string;
}

export interface LayoutVariant {
  name: string;
  sectionCharTargets?: number[];
  decorations?: LayoutDecorationType[];
  titleAlign?: 'left' | 'center' | 'right';
  dateAlign?: 'left' | 'center' | 'right';
}

export interface LayoutType {
  base: LayoutBase;
  variant: LayoutVariant;
}

export interface SectionStyle {
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  textAlign?: 'left' | 'center' | 'right';
  borderColor?: string;
  borderWidth?: string | number;
  borderStyle?: string;
  margin?: string | number;
  padding?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  boxShadow?: string;
  opacity?: number;
}

export interface NewsletterSliceType {
  title: string;
  date: string;
  textBlockMap: Record<string, TextBlockType>;
  textBlockOrder: string[];
  sectionStyles: Record<string, SectionStyle>;
  theme: ThemeType;
  layout: LayoutType;
  denseMode: boolean;
  setTitle: (title: string) => void;
  setDate: (date: string) => void;
  setTheme: (theme: ThemeType) => void;
  setThemeTitleFont: (font: string) => void;
  setThemeDateFont: (font: string) => void;
  setThemeTitleColor: (color: string) => void;
  setThemeDateColor: (color: string) => void;
  setThemeTitleAlignment: (align: 'left' | 'center' | 'right') => void;
  setThemeDateAlignment: (align: 'left' | 'center' | 'right') => void;
  setThemeTitleTextEffect: (effectId: string | undefined) => void;
  setThemePageBackgroundColor: (color: string) => void;
  setThemePageBackgroundImage: (image: string) => void;
  setThemePageBackgroundSize: (size: string) => void;
  setThemePageBackgroundPosition: (position: string) => void;
  setThemePageBackgroundRepeat: (repeat: string) => void;
  setThemePageBackgroundImageOpacity: (opacity: number) => void;
  setLayout: (layout: LayoutType) => void;
  setSectionCount: (count: number) => void;
  setDenseMode: (denseMode: boolean) => void;
  updateStyle: (blockId: string, newStyles: Record<string, unknown>) => void;
  deleteTextBlock: (id: string) => void;
  addTextBlock: (id?: string) => void;
  setElementLocked_text: (id: string, locked: boolean) => void;
  updateTextBlock: (id: string, property: 'title' | 'content', value: string) => void;
}
