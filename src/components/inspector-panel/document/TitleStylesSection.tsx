import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FontSelect } from '@/components/inspector-panel/FontSelect';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';

interface TitleStylesSectionProps {
  titleColorId: string;
  titleFontId: string;
  titleAlignId: string;
  value: { color?: string; fontFamily?: string; textAlign?: string };
  setColor?: (v: string) => void;
  setFont?: (v: string) => void;
  setAlign?: (v: 'left' | 'center' | 'right') => void;
}

export const TitleStylesSection: React.FC<TitleStylesSectionProps> = ({
  titleColorId,
  titleFontId,
  titleAlignId,
  value,
  setColor,
  setFont,
  setAlign
}) => {
  return (
    <InspectorSection title="Title Styles">
      <FormGroup label="Title Color" id={titleColorId} inline>
        <Input id={titleColorId} type="color" value={value.color ?? '#000000'} onChange={e => setColor?.(e.target.value)} className="w-10 h-10 p-0 border-none" />
      </FormGroup>
      <FormGroup label="Title Font" id={titleFontId} inline>
        <FontSelect id={titleFontId} value={value.fontFamily} onChange={val => setFont?.(val)} />
      </FormGroup>
      <FormGroup label="Title Align" id={titleAlignId} inline>
        <Select value={value.textAlign || 'center'} onValueChange={v => setAlign?.(v as 'left' | 'center' | 'right')}>
          <SelectTrigger id={titleAlignId}><SelectValue placeholder="Alignment" /></SelectTrigger>
          <SelectContent>
            {['left','center','right'].map(a => <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase()+a.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormGroup>
    </InspectorSection>
  );
};

export default TitleStylesSection;
