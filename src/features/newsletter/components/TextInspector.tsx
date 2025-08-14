import React from "react";
import { useStore } from "@/lib/store";
import type { TextBlock, SectionStyle } from "@/features/newsletter/types";
import { Theme } from "@/lib/themes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FormattingToolbar, { FormattingAction } from '@/features/newsletter/components/FormattingToolbar';
import EmojiToolbar from '@/features/newsletter/components/EmojiIconToolbar';
import SectionTitleInput from '@/features/newsletter/components/SectionTitleInput';
import { FontSelect } from '@/features/newsletter/components/FontSelect';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';
import LockButton from '@/components/ui/LockButton';
import ColorInputWithReset from '@/components/ui/ColorInputWithReset';
import { Input } from '@/components/ui/input';

interface TextInspectorProps {
  block: TextBlock;
  theme: Theme;
  currentStyle: Partial<SectionStyle>;
  onUpdateTextBlock: (id: string, property: 'title' | 'content', value: string) => void;
  onStyleChange: (blockId: string, newStyles: Partial<SectionStyle>) => void;
}

export const TextInspector: React.FC<TextInspectorProps> = ({ block, theme, currentStyle, onUpdateTextBlock, onStyleChange }) => {
  const deleteElement = useStore(s => s.deleteElement);
  const setElementLocked = useStore(s => s.setElementLocked);
  const handleStyleChange = (property: keyof SectionStyle, value: string | number) => {
    onStyleChange(block.id, { [property]: value });
  };

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const setEditingCaret = useStore(s => s.setEditingCaret);
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

    const wrapOrInsert = (pre: string, post: string, placeholder: string) => selected ? pre + selected + post : pre + placeholder + post;

    switch(action) {
      case 'bold':
        replacement = wrapOrInsert('**', '**', 'bold text');
        newStart = start + 2; newEnd = start + (selected ? selected.length : 9) + 2; break;
      case 'italic':
        replacement = wrapOrInsert('*', '*', 'italic text');
        newStart = start + 1; newEnd = start + (selected ? selected.length : 11) + 1; break;
      case 'ul': {
        const text = selected || 'List item';
        replacement = text.split('\n').map(l => l ? `- ${l}` : '- ').join('\n');
        newStart = start + 2; newEnd = start + replacement.length; break; }
      case 'ol': {
        const text = selected || 'List item';
        replacement = text.split('\n').map((l,i) => `${i+1}. ${l || 'List item'}`).join('\n');
        newStart = start + 3; newEnd = start + replacement.length; break; }
      case 'link': {
        const placeholder = selected || 'link text';
        replacement = `[${placeholder}](https://)`;
        newStart = start + 1; newEnd = start + 1 + placeholder.length; break; }
      case 'table':
        replacement = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Value 1 | Value 2 | Value 3 |\n';
        newStart = start + 2; newEnd = start + replacement.length; break;
      case 'hr':
        replacement = '\n---\n';
        newStart = start + 1; newEnd = newStart + 3; break;
      default: return;
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

  const locked = !!block.locked;

  // IDs for a11y
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
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">Section</h3>
        <div className="flex gap-2">
          <LockButton locked={locked} onToggle={() => setElementLocked(block.id, 'text', !locked)} />
          <Button type="button" size="sm" variant="destructive" onClick={() => deleteElement(block.id, 'text')} aria-label="Delete section" disabled={locked}>Delete</Button>
        </div>
      </div>

      <InspectorSection title="Title & Content">
        <FormGroup label="Section Title" id={`section-title-${block.id}`}> 
          <SectionTitleInput
            blockId={block.id}
            value={block.title || ''}
            onChange={(v) => onUpdateTextBlock(block.id, 'title', v)}
            onCommit={(v) => onUpdateTextBlock(block.id, 'title', v)}
            onUpdateContent={onUpdateTextBlock}
            currentContent={typeof block.content === 'string' ? block.content : ''}
            disabled={locked}
            onCaretChange={(idx) => setEditingCaret && setEditingCaret(block.id,'title', idx)}
          />
        </FormGroup>
        <FormGroup label="Section Content" id={`section-content-${block.id}`}> 
          <FormattingToolbar onAction={(a: FormattingAction) => applyFormatting(a)} />
          <Textarea
            id={`section-content-${block.id}`}
            name={`sectionContent-${block.id}`}
            ref={textareaRef}
            value={typeof block.content === 'string' ? block.content : ''}
            onChange={e => { onUpdateTextBlock(block.id, 'content', e.target.value); if (setEditingCaret) { setEditingCaret(block.id,'content', e.target.selectionStart ?? e.target.value.length); } }}
            onClick={e => { const el = e.currentTarget; if (setEditingCaret) { setEditingCaret(block.id,'content', el.selectionStart ?? 0); } }}
            onKeyUp={e => { const el = e.currentTarget; if (setEditingCaret) { setEditingCaret(block.id,'content', el.selectionStart ?? 0); } }}
            disabled={locked}
            className="h-32 text-sm"
          />
          <EmojiToolbar onInsert={insertToken} />
        </FormGroup>
      </InspectorSection>

      <InspectorSection title="Heading Styles">
        <FormGroup label="Heading Color" id={headingColorId} inline>
          <ColorInputWithReset
            id={headingColorId}
            value={currentStyle.headingColor || theme.styles.section.headingColor || '#000000'}
            disabled={locked}
            onChange={v => handleStyleChange('headingColor', v)}
            onReset={() => handleStyleChange('headingColor', theme.styles.section.headingColor || '#000000')}
          />
        </FormGroup>
        <FormGroup label="Heading Background" id={headingBgId} inline>
          <ColorInputWithReset
            id={headingBgId}
            value={currentStyle.headingBackgroundColor || theme.styles.section.headingBackgroundColor || '#ffffff'}
            disabled={locked}
            onChange={v => handleStyleChange('headingBackgroundColor', v)}
            onReset={() => handleStyleChange('headingBackgroundColor', theme.styles.section.headingBackgroundColor || '#ffffff')}
          />
        </FormGroup>
        <FormGroup label="Heading Font" id={headingFontId} inline>
          <FontSelect id={headingFontId} value={currentStyle.headingFontFamily || theme.styles.section.headingFontFamily} onChange={val => handleStyleChange('headingFontFamily', val)} disabled={locked} />
        </FormGroup>
      </InspectorSection>

      <InspectorSection title="Content Styles">
        <FormGroup label="Content Color" id={contentColorId} inline>
          <ColorInputWithReset
            id={contentColorId}
            value={currentStyle.contentColor || theme.styles.section.contentColor || '#000000'}
            disabled={locked}
            onChange={v => handleStyleChange('contentColor', v)}
            onReset={() => handleStyleChange('contentColor', theme.styles.section.contentColor || '#000000')}
          />
        </FormGroup>
        <FormGroup label="Content Background" id={contentBgId} inline>
          <ColorInputWithReset
            id={contentBgId}
            value={currentStyle.backgroundColor || theme.styles.section.backgroundColor || '#ffffff'}
            disabled={locked}
            onChange={v => handleStyleChange('backgroundColor', v)}
            onReset={() => handleStyleChange('backgroundColor', theme.styles.section.backgroundColor || '#ffffff')}
          />
        </FormGroup>
        <FormGroup label="Content Font" id={contentFontId} inline>
          <FontSelect id={contentFontId} value={currentStyle.fontFamily || theme.styles.section.contentFontFamily} onChange={val => handleStyleChange('fontFamily', val)} disabled={locked} />
        </FormGroup>
      </InspectorSection>

      <InspectorSection title="Border Styles">
        <FormGroup label="Border Color" id={borderColorId} inline>
          <ColorInputWithReset
            id={borderColorId}
            value={currentStyle.borderColor || theme.styles.section.borderColor || '#000000'}
            disabled={locked}
            onChange={v => handleStyleChange('borderColor', v)}
            onReset={() => handleStyleChange('borderColor', theme.styles.section.borderColor || '#000000')}
          />
        </FormGroup>
        <FormGroup label="Border Width" id={borderWidthId} inline>
          <Input id={borderWidthId} type="number" value={currentStyle.borderWidth ?? 1} disabled={locked} onChange={e => handleStyleChange('borderWidth', parseInt(e.target.value))} className="w-24" />
        </FormGroup>
        <FormGroup label="Border Radius" id={borderRadiusId} inline>
          <Input id={borderRadiusId} type="number" value={currentStyle.borderRadius ?? (theme.styles.section.borderRadius ?? 0)} disabled={locked} onChange={e => handleStyleChange('borderRadius', parseInt(e.target.value))} className="w-24" />
        </FormGroup>
      </InspectorSection>
    </div>
  );
};
