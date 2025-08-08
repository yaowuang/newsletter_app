import React from "react";
import { TextBlock, SectionStyle } from "@/lib/store";
import { Theme } from "@/lib/themes";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FONT_LABEL_TO_VALUE, FONT_VALUE_TO_LABEL } from "../inspector-panel";

interface TextInspectorProps {
  block: TextBlock;
  fonts: string[];
  theme: Theme;
  currentStyle: Partial<SectionStyle>;
  onUpdateTextBlock: (id: string, property: 'title' | 'content', value: string) => void;
  onStyleChange: (blockId: string, newStyles: Partial<SectionStyle>) => void;
}

export const TextInspector: React.FC<TextInspectorProps> = ({
  block,
  fonts,
  theme,
  currentStyle,
  onUpdateTextBlock,
  onStyleChange,
}) => {
  const handleStyleChange = (property: keyof SectionStyle, value: string | number) => {
    onStyleChange(block.id, { [property]: value });
  };

  // Convert stored css variable to label for select value
  const toLabel = (val: string | undefined) => {
    if (!val) return fonts[0];
    return FONT_VALUE_TO_LABEL[val] || val;
  };
  const fromLabel = (label: string) => FONT_LABEL_TO_VALUE[label] || label;

  // Emoji & icon helpers
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const emojiList = ['😀','😁','😂','🤣','😊','😍','🤔','😎','😭','😡','👍','👎','🙏','🎉','✨','🔥','💡','✅','❌','⚠️'];
  const iconList = ['⭐','📌','📎','📝','📣','🔔','🧪','🛠️','📊','📅','🚀','💼','💻','🧠','🔒','🧾'];
  const insertToken = (token: string) => {
    const current = typeof block.content === 'string' ? block.content : '';
    const el = textareaRef.current;
    if (!el) {
      onUpdateTextBlock(block.id, 'content', current + token);
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? start;
    const next = current.slice(0, start) + token + current.slice(end);
    onUpdateTextBlock(block.id, 'content', next);
    // restore cursor after React state update
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const pos = start + token.length;
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = pos;
        textareaRef.current.focus();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Content */}
      <div className="rounded-xl bg-white dark:bg-gray-900 shadow p-4 space-y-2 border border-gray-100 dark:border-gray-800">
        <Label className="text-base font-medium">Section Title</Label>
        <Input
          type="text"
          value={block.title || ''}
          onChange={e => onUpdateTextBlock(block.id, 'title', e.target.value)}
          className="text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <Label className="text-base font-medium">Section Content</Label>
        <Textarea
          ref={textareaRef}
          value={typeof block.content === 'string' ? block.content : ''}
          onChange={e => onUpdateTextBlock(block.id, 'content', e.target.value)}
          className="h-32 text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        {/* Emoji & Icon helper toolbar */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">Emoji 😊</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-56 w-56 overflow-y-auto grid grid-cols-6 gap-1 p-2">
              {emojiList.map(e => (
                <DropdownMenuItem key={e} className="justify-center px-0" onSelect={(ev) => { ev.preventDefault(); insertToken(e); }}>
                  {e}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">Icons ⭐</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-56 w-56 overflow-y-auto grid grid-cols-6 gap-1 p-2">
              {iconList.map(e => (
                <DropdownMenuItem key={e} className="justify-center px-0" onSelect={(ev) => { ev.preventDefault(); insertToken(e); }}>
                  {e}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Heading Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Heading Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Heading Color</Label>
            <Input type="color" value={currentStyle.headingColor || theme.styles.section.headingColor || '#000000'} onChange={e => handleStyleChange('headingColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.headingColor || theme.styles.section.headingColor || '#000000') === (theme.styles.section.headingColor || '#000000')} onClick={() => handleStyleChange('headingColor', theme.styles.section.headingColor || '#000000')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Heading Background</Label>
            <Input type="color" value={currentStyle.headingBackgroundColor || theme.styles.section.headingBackgroundColor || '#ffffff'} onChange={e => handleStyleChange('headingBackgroundColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.headingBackgroundColor || theme.styles.section.headingBackgroundColor || '#ffffff') === (theme.styles.section.headingBackgroundColor || '#ffffff')} onClick={() => handleStyleChange('headingBackgroundColor', theme.styles.section.headingBackgroundColor || '#ffffff')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Heading Font</Label>
            <Select onValueChange={value => handleStyleChange('headingFontFamily', fromLabel(value))} value={toLabel(currentStyle.headingFontFamily || theme.styles.section.headingFontFamily || fonts[0])}>
              <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
              <SelectContent>
                {fonts.map(font => {
                  const cssVal = FONT_LABEL_TO_VALUE[font] || font;
                  return (
                    <SelectItem key={font} value={font} style={{ fontFamily: cssVal }}>
                      {font}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={toLabel(currentStyle.headingFontFamily || theme.styles.section.headingFontFamily || fonts[0]) === toLabel(theme.styles.section.headingFontFamily || fonts[0])} onClick={() => handleStyleChange('headingFontFamily', theme.styles.section.headingFontFamily || fonts[0])}>↺</Button>
          </div>
        </div>
      </div>

      {/* Content Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Content Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Content Color</Label>
            <Input type="color" value={currentStyle.contentColor || theme.styles.section.contentColor || '#000000'} onChange={e => handleStyleChange('contentColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.contentColor || theme.styles.section.contentColor || '#000000') === (theme.styles.section.contentColor || '#000000')} onClick={() => handleStyleChange('contentColor', theme.styles.section.contentColor || '#000000')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Content Background</Label>
            <Input type="color" value={currentStyle.backgroundColor || theme.styles.section.backgroundColor || '#ffffff'} onChange={e => handleStyleChange('backgroundColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.backgroundColor || theme.styles.section.backgroundColor || '#ffffff') === (theme.styles.section.backgroundColor || '#ffffff')} onClick={() => handleStyleChange('backgroundColor', theme.styles.section.backgroundColor || '#ffffff')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Content Font</Label>
            <Select onValueChange={value => handleStyleChange('fontFamily', fromLabel(value))} value={toLabel(currentStyle.fontFamily || theme.styles.section.contentFontFamily || fonts[0])}>
              <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
              <SelectContent>
                {fonts.map(font => {
                  const cssVal = FONT_LABEL_TO_VALUE[font] || font;
                  return (
                    <SelectItem key={font} value={font} style={{ fontFamily: cssVal }}>
                      {font}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={toLabel(currentStyle.fontFamily ?? theme.styles.section.contentFontFamily ?? fonts[0]) === toLabel(theme.styles.section.contentFontFamily ?? fonts[0])} onClick={() => handleStyleChange('fontFamily', theme.styles.section.contentFontFamily ?? fonts[0])}>↺</Button>
          </div>
        </div>
      </div>

      {/* Border Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Border Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Border Color</Label>
            <Input type="color" value={currentStyle.borderColor || theme.styles.section.borderColor || '#000000'} onChange={e => handleStyleChange('borderColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.borderColor || theme.styles.section.borderColor || '#000000') === (theme.styles.section.borderColor || '#000000')} onClick={() => handleStyleChange('borderColor', theme.styles.section.borderColor || '#000000')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Border Width (px)</Label>
            <Input type="number" value={currentStyle.borderWidth ?? 1} onChange={e => handleStyleChange('borderWidth', parseInt(e.target.value))} className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.borderWidth ?? 1) === 1} onClick={() => handleStyleChange('borderWidth', 1)}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label className="min-w-[120px]">Border Radius (px)</Label>
            <Input type="number" value={currentStyle.borderRadius ?? 0} onChange={e => handleStyleChange('borderRadius', parseInt(e.target.value))} className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.borderRadius ?? 0) === 0} onClick={() => handleStyleChange('borderRadius', 0)}>↺</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
