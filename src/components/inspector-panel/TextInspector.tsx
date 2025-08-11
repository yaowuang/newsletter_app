import React from "react";
import { TextBlock, SectionStyle, useStore } from "@/lib/store";
import { Theme } from "@/lib/themes";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormattingToolbar, { FormattingAction } from '@/components/inspector-panel/FormattingToolbar';
import EmojiToolbar from '@/components/inspector-panel/EmojiIconToolbar';
import SectionTitleInput from '@/components/inspector-panel/SectionTitleInput';
import { FontSelect } from '@/components/inspector-panel/FontSelect';

interface TextInspectorProps {
  block: TextBlock;
  theme: Theme;
  currentStyle: Partial<SectionStyle>;
  onUpdateTextBlock: (id: string, property: 'title' | 'content', value: string) => void;
  onStyleChange: (blockId: string, newStyles: Partial<SectionStyle>) => void;
}

export const TextInspector: React.FC<TextInspectorProps> = ({
  block,
  theme,
  currentStyle,
  onUpdateTextBlock,
  onStyleChange,
}) => {
  const deleteElement = useStore(s => s.deleteElement);
  const handleStyleChange = (property: keyof SectionStyle, value: string | number) => {
    onStyleChange(block.id, { [property]: value });
  };

  // Emoji & icon helpers
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
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
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const pos = start + token.length;
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = pos;
        textareaRef.current.focus();
      }
    });
  };

  const applyFormatting = (action: string) => {
    const current = typeof block.content === 'string' ? block.content : '';
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? start;
    const selected = current.slice(start, end);

    let replacement = '';
    let newStart = start;
    let newEnd = end;

    const wrapOrInsert = (pre: string, post: string, placeholder: string) => {
      if (selected) {
        return pre + selected + post;
      }
      return pre + placeholder + post;
    };

    switch(action) {
      case 'bold':
        replacement = wrapOrInsert('**', '**', 'bold text');
        newStart = start + 2;
        newEnd = start + (selected ? selected.length : 9) + 2; // 'bold text'.length = 9
        break;
      case 'italic':
        replacement = wrapOrInsert('*', '*', 'italic text');
        newStart = start + 1;
        newEnd = start + (selected ? selected.length : 11) + 1;
        break;
      case 'ul': {
        const text = selected || 'List item';
        replacement = text.split('\n').map(l => l ? `- ${l}` : '- ').join('\n');
        newStart = start + 2;
        newEnd = start + replacement.length;
        break; }
      case 'ol': {
        const text = selected || 'List item';
        replacement = text.split('\n').map((l,i) => `${i+1}. ${l || 'List item'}`).join('\n');
        newStart = start + 3;
        newEnd = start + replacement.length;
        break; }
      case 'link': {
        const placeholder = selected || 'link text';
        replacement = `[${placeholder}](https://)`;
        newStart = start + 1;
        newEnd = start + 1 + placeholder.length;
        break; }
      case 'table': {
        replacement = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Value 1 | Value 2 | Value 3 |\n';
        newStart = start + 2;
        newEnd = start + replacement.length;
        break; }
      case 'hr': {
        replacement = '\n---\n';
        newStart = start + 1;
        newEnd = newStart + 3;
        break; }
      default:
        return;
    }

    const next = current.slice(0, start) + replacement + current.slice(end);
    onUpdateTextBlock(block.id, 'content', next);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newStart;
        textareaRef.current.selectionEnd = Math.min(newEnd, next.length);
      }
    });
  };

 // Generated IDs for a11y associations
  const headingColorId = `heading-color-${block.id}`;
  const headingBgId = `heading-bg-${block.id}`;
  const headingFontId = `heading-font-${block.id}`;
  const contentColorId = `content-color-${block.id}`;
  const contentBgId = `content-bg-${block.id}`;
  const contentFontId = `content-font-${block.id}`;
  const borderColorId = `border-color-${block.id}`;
  const borderWidthId = `border-width-${block.id}`;
  const borderRadiusId = `border-radius-${block.id}`;

  return (
    <div className="space-y-6">
      <div className="flex justify-end -mb-2">
        <Button type="button" size="sm" variant="destructive" onClick={() => deleteElement(block.id, 'text')} aria-label="Delete section">Delete Section</Button>
      </div>
      {/* Title & Content */}
      <div className="rounded-xl bg-white dark:bg-gray-900 shadow p-4 space-y-2 border border-gray-100 dark:border-gray-800">
        <Label className="text-base font-medium" htmlFor={`section-title-${block.id}`}>Section Title</Label>
        <SectionTitleInput
          blockId={block.id}
          value={block.title || ''}
          onChange={(v) => onUpdateTextBlock(block.id, 'title', v)}
          onCommit={(v) => onUpdateTextBlock(block.id, 'title', v)}
          onUpdateContent={onUpdateTextBlock}
          currentContent={typeof block.content === 'string' ? block.content : ''}
        />
        <Label className="text-base font-medium" htmlFor={`section-content-${block.id}`}>Section Content</Label>
        <FormattingToolbar onAction={(a: FormattingAction) => applyFormatting(a)} />
        <Textarea
          id={`section-content-${block.id}`}
          name={`sectionContent-${block.id}`}
          ref={textareaRef}
          value={typeof block.content === 'string' ? block.content : ''}
          onChange={e => onUpdateTextBlock(block.id, 'content', e.target.value)}
          className="h-32 text-base px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        {/* Emoji & Icon helper toolbar */}
        <EmojiToolbar onInsert={insertToken} />
      </div>

      {/* Heading Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Heading Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label htmlFor={headingColorId} className="min-w-[120px]">Heading Color</Label>
            <Input id={headingColorId} type="color" value={currentStyle.headingColor || theme.styles.section.headingColor || '#000000'} onChange={e => handleStyleChange('headingColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.headingColor || theme.styles.section.headingColor || '#000000') === (theme.styles.section.borderColor || '#000000')} onClick={() => handleStyleChange('headingColor', theme.styles.section.headingColor || '#000000')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={headingBgId} className="min-w-[120px]">Heading Background</Label>
            <Input id={headingBgId} type="color" value={currentStyle.headingBackgroundColor || theme.styles.section.headingBackgroundColor || '#ffffff'} onChange={e => handleStyleChange('headingBackgroundColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.headingBackgroundColor || theme.styles.section.headingBackgroundColor || '#ffffff') === (theme.styles.section.headingBackgroundColor || '#ffffff')} onClick={() => handleStyleChange('headingBackgroundColor', theme.styles.section.headingBackgroundColor || '#ffffff')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={headingFontId} className="min-w-[120px]">Heading Font</Label>
            <FontSelect id={headingFontId} value={currentStyle.headingFontFamily || theme.styles.section.headingFontFamily} onChange={val => handleStyleChange('headingFontFamily', val)} />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.headingFontFamily || theme.styles.section.headingFontFamily) === theme.styles.section.headingFontFamily} onClick={() => handleStyleChange('headingFontFamily', theme.styles.section.headingFontFamily || '')}>↺</Button>
          </div>
        </div>
      </div>

      {/* Content Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Content Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label htmlFor={contentColorId} className="min-w-[120px]">Content Color</Label>
            <Input id={contentColorId} type="color" value={currentStyle.contentColor || theme.styles.section.contentColor || '#000000'} onChange={e => handleStyleChange('contentColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.contentColor || theme.styles.section.contentColor || '#000000') === (theme.styles.section.borderColor || '#000000')} onClick={() => handleStyleChange('contentColor', theme.styles.section.contentColor || '#000000')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={contentBgId} className="min-w-[120px]">Content Background</Label>
            <Input id={contentBgId} type="color" value={currentStyle.backgroundColor || theme.styles.section.backgroundColor || '#ffffff'} onChange={e => handleStyleChange('backgroundColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.backgroundColor || theme.styles.section.backgroundColor || '#ffffff') === (theme.styles.section.backgroundColor || '#ffffff')} onClick={() => handleStyleChange('backgroundColor', theme.styles.section.backgroundColor || '#ffffff')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={contentFontId} className="min-w-[120px]">Content Font</Label>
            <FontSelect id={contentFontId} value={currentStyle.fontFamily || theme.styles.section.contentFontFamily} onChange={val => handleStyleChange('fontFamily', val)} />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.fontFamily ?? theme.styles.section.contentFontFamily) === theme.styles.section.contentFontFamily} onClick={() => handleStyleChange('fontFamily', theme.styles.section.contentFontFamily || '')}>↺</Button>
          </div>
        </div>
      </div>

      {/* Border Styles */}
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
        <h3 className="text-md font-semibold mb-2">Border Styles</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Label htmlFor={borderColorId} className="min-w-[120px]">Border Color</Label>
            <Input id={borderColorId} type="color" value={currentStyle.borderColor || theme.styles.section.borderColor || '#000000'} onChange={e => handleStyleChange('borderColor', e.target.value)} className="w-10 h-10 p-0 border-none" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.borderColor || theme.styles.section.borderColor || '#000000') === (theme.styles.section.borderColor || '#000000')} onClick={() => handleStyleChange('borderColor', theme.styles.section.borderColor || '#000000')}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={borderWidthId} className="min-w-[120px]">Border Width (px)</Label>
            <Input id={borderWidthId} type="number" value={currentStyle.borderWidth ?? 1} onChange={e => handleStyleChange('borderWidth', parseInt(e.target.value))} className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.borderWidth ?? 1) === 1} onClick={() => handleStyleChange('borderWidth', 1)}>↺</Button>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={borderRadiusId} className="min-w-[120px]">Border Radius (px)</Label>
            <Input id={borderRadiusId} type="number" value={currentStyle.borderRadius ?? (theme.styles.section.borderRadius ?? 0)} onChange={e => handleStyleChange('borderRadius', parseInt(e.target.value))} className="w-20 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700" />
            <Button type="button" size="icon" variant="ghost" className="rounded-full" disabled={(currentStyle.borderRadius ?? theme.styles.section.borderRadius ?? 0) === (theme.styles.section.borderRadius ?? 0)} onClick={() => handleStyleChange('borderRadius', theme.styles.section.borderRadius ?? 0)}>↺</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
