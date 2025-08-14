import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FontSelect } from '@/features/newsletter/components/FontSelect';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';
import { TextAlign } from '@/lib/themes';

interface DateStylesSectionProps {
  dateColorId: string;
  dateFontId: string;
  dateAlignId: string;
  value: { color?: string; fontFamily?: string; textAlign?: TextAlign };
  setColor?: (v: string) => void;
  setFont?: (v: string) => void;
  setAlign?: (v: TextAlign) => void;
}

export const DateStylesSection: React.FC<DateStylesSectionProps> = ({ dateColorId, dateFontId, dateAlignId, value, setColor, setFont, setAlign }) => {
  return (
    <InspectorSection title="Date Styles">
      <FormGroup label="Date Color" id={dateColorId} inline>
        <Input id={dateColorId} type="color" value={value.color ?? '#000000'} onChange={e => setColor?.(e.target.value)} className="w-10 h-10 p-0 border-none" />
      </FormGroup>
      <FormGroup label="Date Font" id={dateFontId} inline>
        <FontSelect id={dateFontId} value={value.fontFamily} onChange={val => setFont?.(val)} />
      </FormGroup>
      <FormGroup label="Date Align" id={dateAlignId} inline>
        <Select value={value.textAlign || 'center'} onValueChange={v => setAlign?.(v as TextAlign)}>
          <SelectTrigger id={dateAlignId}><SelectValue placeholder="Alignment" /></SelectTrigger>
          <SelectContent>
            {(['left','center','right'] as const).map(a => <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase()+a.slice(1)}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormGroup>
    </InspectorSection>
  );
};

export default DateStylesSection;
