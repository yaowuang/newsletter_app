import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageSourceDialog from '@/components/common/ImageSourceDialog';
import { ThemeType } from '@/lib/themes';
import InspectorSection from '@/components/ui/InspectorSection';
import FormGroup from '@/components/ui/FormGroup';

interface PageBackgroundSectionProps {
  ids: { color: string; size: string; position: string; repeat: string };
  themeStyles: ThemeType['styles']['page'];
  setBgColor?: (v: string) => void;
  setBgImage?: (v: string | null) => void;
  setBgSize?: (v: string | null) => void;
  setBgPosition?: (v: string | null) => void;
  setBgRepeat?: (v: string | null) => void;
  setBgOpacity?: (v: number) => void;
}

const sizeOptions = ['cover', 'contain'];
const positionOptions = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'];
const repeatOptions = ['no-repeat', 'repeat', 'repeat-x', 'repeat-y', 'space', 'round'];
const DEFAULT_SENTINEL = 'DEFAULT';

export const PageBackgroundSection: React.FC<PageBackgroundSectionProps> = ({ ids, themeStyles, setBgColor, setBgImage, setBgSize, setBgPosition, setBgRepeat, setBgOpacity }) => {
  const currentSize = String(themeStyles.backgroundSize || '');
  const currentPosition = String(themeStyles.backgroundPosition || '');
  const currentRepeat = String(themeStyles.backgroundRepeat || '');
  const [editingCustomSize, setEditingCustomSize] = React.useState(false);
  const [editingCustomPosition, setEditingCustomPosition] = React.useState(false);
  const [editingCustomRepeat, setEditingCustomRepeat] = React.useState(false);
  const isCustomSize = (!!currentSize || editingCustomSize) && !sizeOptions.includes(currentSize) && currentSize !== DEFAULT_SENTINEL;
  const isCustomPosition = (!!currentPosition || editingCustomPosition) && !positionOptions.includes(currentPosition) && currentPosition !== DEFAULT_SENTINEL;
  const isCustomRepeat = (!!currentRepeat || editingCustomRepeat) && !repeatOptions.includes(currentRepeat) && currentRepeat !== DEFAULT_SENTINEL;

  React.useEffect(() => { if (!currentSize || sizeOptions.includes(currentSize)) setEditingCustomSize(false); }, [currentSize]);
  React.useEffect(() => { if (!currentPosition || positionOptions.includes(currentPosition)) setEditingCustomPosition(false); }, [currentPosition]);
  React.useEffect(() => { if (!currentRepeat || repeatOptions.includes(currentRepeat)) setEditingCustomRepeat(false); }, [currentRepeat]);

  return (
    <InspectorSection title="Page Background">
      <FormGroup label="Color" id={ids.color} inline>
        <Input id={ids.color} type="color" value={themeStyles.backgroundColor} onChange={e => setBgColor?.(e.target.value)} className="w-10 h-10 p-0 border-none" />
      </FormGroup>
      <FormGroup label="Image" id={ids.color} inline>
        <div className="flex items-center gap-2">
          <ImageSourceDialog buttonText={themeStyles.backgroundImage ? 'Change' : 'Select'} title='Background Image' onSelect={(src) => setBgImage?.(src.startsWith('http') || src.startsWith('data:') ? `url(${src})` : src.startsWith('url(') ? src : `url(${src})`)} />
          {themeStyles.backgroundImage && (
            <button type="button" onClick={() => setBgImage?.(null)} className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">Clear</button>
          )}
        </div>
      </FormGroup>
      {themeStyles.backgroundImage && (
        <FormGroup label="Opacity" id={`${ids.color}-opacity`} inline>
          <div className="flex items-center gap-2 w-full">
            <input type="range" min={0} max={1} step={0.05} value={themeStyles.backgroundImageOpacity ?? 1} onChange={e => setBgOpacity?.(parseFloat(e.target.value))} className="flex-1" />
            <span className="text-xs w-10 text-right">{Math.round((themeStyles.backgroundImageOpacity ?? 1)*100)}%</span>
          </div>
        </FormGroup>
      )}
      <FormGroup label="Size" id={ids.size} inline>
        <Select value={(editingCustomSize || isCustomSize) ? 'CUSTOM' : (currentSize ? currentSize : DEFAULT_SENTINEL)} onValueChange={v => {
          if (v === 'CUSTOM') { setEditingCustomSize(true); if (!isCustomSize) setBgSize?.(currentSize || ''); }
          else if (v === DEFAULT_SENTINEL) { setEditingCustomSize(false); setBgSize?.(null); }
          else { setEditingCustomSize(false); setBgSize?.(v || null); }
        }}>
          <SelectTrigger id={ids.size}><SelectValue placeholder="auto" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={DEFAULT_SENTINEL}>auto</SelectItem>
            {sizeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            <SelectItem value="CUSTOM">Custom</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      {(editingCustomSize || isCustomSize) && (
        <Input type="text" value={currentSize} placeholder="e.g. 160px 160px / cover" onChange={e => setBgSize?.(e.target.value)} />
      )}
      <FormGroup label="Position" id={ids.position} inline>
        <Select value={(editingCustomPosition || isCustomPosition) ? 'CUSTOM' : (currentPosition ? currentPosition : DEFAULT_SENTINEL)} onValueChange={v => {
          if (v === 'CUSTOM') { setEditingCustomPosition(true); if (!isCustomPosition) setBgPosition?.(currentPosition || ''); }
          else if (v === DEFAULT_SENTINEL) { setEditingCustomPosition(false); setBgPosition?.(null); }
          else { setEditingCustomPosition(false); setBgPosition?.(v || null); }
        }}>
          <SelectTrigger id={ids.position}><SelectValue placeholder="initial" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={DEFAULT_SENTINEL}>initial</SelectItem>
            {positionOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            <SelectItem value="CUSTOM">Custom</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      {(editingCustomPosition || isCustomPosition) && (
        <Input type="text" value={currentPosition} placeholder="e.g. 0 0, 80px 80px" onChange={e => setBgPosition?.(e.target.value)} />
      )}
      <FormGroup label="Repeat" id={ids.repeat} inline>
        <Select value={(editingCustomRepeat || isCustomRepeat) ? 'CUSTOM' : (currentRepeat ? currentRepeat : DEFAULT_SENTINEL)} onValueChange={v => {
          if (v === 'CUSTOM') { setEditingCustomRepeat(true); if (!isCustomRepeat) setBgRepeat?.(currentRepeat || ''); }
          else if (v === DEFAULT_SENTINEL) { setEditingCustomRepeat(false); setBgRepeat?.(null); }
          else { setEditingCustomRepeat(false); setBgRepeat?.(v || null); }
        }}>
          <SelectTrigger id={ids.repeat}><SelectValue placeholder="default" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={DEFAULT_SENTINEL}>default</SelectItem>
            {repeatOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            <SelectItem value="CUSTOM">Custom</SelectItem>
          </SelectContent>
        </Select>
      </FormGroup>
      {(editingCustomRepeat || isCustomRepeat) && (
        <Input type="text" value={currentRepeat} placeholder="e.g. repeat, no-repeat" onChange={e => setBgRepeat?.(e.target.value)} />
      )}
    </InspectorSection>
  );
};

export default PageBackgroundSection;
