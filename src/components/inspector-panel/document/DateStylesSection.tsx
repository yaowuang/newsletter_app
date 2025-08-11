import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FontSelect } from '@/components/inspector-panel/FontSelect';

interface DateStylesSectionProps {
  dateColorId: string;
  dateFontId: string;
  dateAlignId: string;
  value: { color?: string; fontFamily?: string; textAlign?: string };
  setColor?: (v: string) => void;
  setFont?: (v: string) => void;
  setAlign?: (v: 'left' | 'center' | 'right') => void;
}

export const DateStylesSection: React.FC<DateStylesSectionProps> = ({
  dateColorId,
  dateFontId,
  dateAlignId,
  value,
  setColor,
  setFont,
  setAlign
}) => {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-800 shadow p-4 space-y-3 border border-gray-100 dark:border-gray-800">
      <h3 className="text-md font-semibold mb-2">Date Styles</h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Label htmlFor={dateColorId} className="min-w-[120px]">Date Color</Label>
          <Input id={dateColorId} type="color" value={value.color ?? '#000000'} onChange={e => setColor?.(e.target.value)} className="w-10 h-10 p-0 border-none" />
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor={dateFontId} className="min-w-[120px]">Date Font</Label>
          <FontSelect id={dateFontId} value={value.fontFamily} onChange={val => setFont?.(val)} />
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor={dateAlignId} className="min-w-[120px]">Date Align</Label>
          <Select value={value.textAlign || 'center'} onValueChange={v => setAlign?.(v as 'left' | 'center' | 'right')}>
            <SelectTrigger id={dateAlignId}><SelectValue placeholder="Alignment" /></SelectTrigger>
            <SelectContent>
              {['left','center','right'].map(a => <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase()+a.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DateStylesSection;
