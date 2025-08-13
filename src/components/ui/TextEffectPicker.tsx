import React from 'react';
import { PastelRotateText } from '@/components/common/PastelRotateText';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { textEffects, getTextEffectById, type TextEffect } from '@/lib/textEffects';

interface TextEffectPickerProps {
  value?: string;
  onChange: (effectId: string | undefined) => void;
  className?: string;
}

export const TextEffectPicker: React.FC<TextEffectPickerProps> = ({
  value,
  onChange,
  className
}) => {
  const groupedEffects = textEffects.reduce((acc, effect) => {
    if (!acc[effect.category]) {
      acc[effect.category] = [];
    }
    acc[effect.category].push(effect);
    return acc;
  }, {} as Record<string, TextEffect[]>);

  const categoryLabels = {
    gradient: 'Gradients',
    shadow: 'Shadows',
    glow: 'Glows',
    outline: 'Outlines',
    special: 'Special Effects'
  };

  return (
    <Select value={value || 'none'} onValueChange={val => onChange(val === 'none' ? undefined : val)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Choose text effect">
          {value ? (
            <TextEffectPreview effectId={value} />
          ) : (
            'Solid Color'
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">
          <span>Solid Color</span>
        </SelectItem>
        
        {Object.entries(groupedEffects).map(([category, effects]) => (
          <React.Fragment key={category}>
            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </div>
            {effects.map(effect => (
              <SelectItem key={effect.id} value={effect.id}>
                <div className="flex items-center gap-2">
                  <TextEffectPreview effectId={effect.id} showSample />
                  <div>
                    <div className="font-medium">{effect.name}</div>
                    <div className="text-xs text-gray-500">{effect.description}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  );
};

interface TextEffectPreviewProps {
  effectId: string;
  showSample?: boolean;
}

const TextEffectPreview: React.FC<TextEffectPreviewProps> = ({ effectId, showSample = false }) => {
  const effect = getTextEffectById(effectId);
  if (!effect) return <span>Unknown Effect</span>;

  const isPastel = effect.id === 'pastel-rotate';
  const pastelPalette = ['#F8B4D9','#B5E4FA','#FDE1A9','#C7F9CC','#E5D9FA','#FFE5EC'];

  return (
    <div className="flex items-center gap-2">
      {showSample && (
          isPastel ? <PastelRotateText text="Pastel" className="text-sm font-bold inline-flex gap-px" /> : (
            <span className="text-sm font-bold" style={effect.styles}>Aa</span>
          )
      )}
      <span>{effect.name}</span>
    </div>
  );
};
