import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FontSelect } from '@/components/inspector-panel/FontSelect';
import { TextEffectPicker } from '@/components/ui/TextEffectPicker';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';

interface TitleStylesSectionProps {
  titleColorId: string;
  titleFontId: string;
  titleAlignId: string;
  titleEffectId: string;
  value: { 
    color?: any; 
    fontFamily?: any; 
    textAlign?: any;
    backgroundImage?: any;
    backgroundColor?: any;
    WebkitBackgroundClip?: any;
    backgroundClip?: any;
    textEffectId?: string;
  };
  setColor?: (v: string) => void;
  setFont?: (v: string) => void;
  setAlign?: (v: 'left' | 'center' | 'right') => void;
  setTextEffect?: (effectId: string | undefined) => void;
}

export const TitleStylesSection: React.FC<TitleStylesSectionProps> = ({
  titleColorId,
  titleFontId,
  titleAlignId,
  titleEffectId,
  value,
  setColor,
  setFont,
  setAlign,
  setTextEffect
}) => {
  // Detect if text effect is active
  const hasTextEffect = Boolean(value.textEffectId);
  const displayColor = hasTextEffect ? '#3B82F6' : (value.color ?? '#000000');

  return (
    <InspectorSection title="Title Styles">
      <FormGroup label="Text Effect" id={titleEffectId} inline>
        <TextEffectPicker
          value={value.textEffectId}
          onChange={effectId => setTextEffect?.(effectId)}
          className="flex-1"
        />
      </FormGroup>
      
      {!hasTextEffect && (
        <FormGroup label="Title Color" id={titleColorId} inline>
          <Input 
            id={titleColorId} 
            type="color" 
            value={displayColor} 
            onChange={e => setColor?.(e.target.value)} 
            className="w-10 h-10 p-0 border-none" 
          />
        </FormGroup>
      )}
      
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
