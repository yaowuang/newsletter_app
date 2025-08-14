import React, { useRef } from 'react';
import CalendarCellContent from './CalendarCellContent';
import type { CalendarCell as CalendarCellType } from '../utils/calendar';
import { useStore } from '@/lib/store/index';

// Define the props interface for SplitCalendarCell
interface SplitCalendarCellProps {
  dayIndex: number;
  rowTop: number;
  cellWidth: number;
  cellHeight: number;
  calendarStyles: any;
  topCell: CalendarCellType;
  bottomCell?: CalendarCellType;
  topCellContent: string;
  bottomCellContent: string;
  topStyles: React.CSSProperties;
  bottomStyles: React.CSSProperties;
  toDateKey: (d: Date) => string;
  onClick: (date: Date) => void;
  onDoubleClick: (date: Date) => void;
}

const SplitCalendarCell: React.FC<SplitCalendarCellProps> = (props) => {
  const { dayIndex, rowTop, cellWidth, cellHeight, calendarStyles, topCell, bottomCell, topCellContent, bottomCellContent, topStyles, bottomStyles, toDateKey, onClick, onDoubleClick } = props;

  const editingDateKey = useStore(s => s.calendarData.editingDateKey);
  const draftContent = useStore(s => s.calendarData.draftContent) ?? '';
  const setEditingDateKey = useStore(s => s.setEditingDateKey);
  const setDraftContent = useStore(s => s.setDraftContent);
  const setCellContent = useStore(s => s.setCellContent);

  const isEditingTop = editingDateKey === toDateKey(topCell.date);
  const isEditingBottom = !!(bottomCell && editingDateKey === toDateKey(bottomCell.date));

  const handleBeginEditTop = () => {
    setEditingDateKey?.(toDateKey(topCell.date));
    setDraftContent?.(topCellContent);
  };
  const handleCommitEditTop = () => {
    setCellContent(toDateKey(topCell.date), draftContent || '');
    setEditingDateKey?.(null);
    setDraftContent?.('');
  };
  const handleCancelEditTop = () => {
    setEditingDateKey?.(null);
    setDraftContent?.('');
  };

  const handleBeginEditBottom = () => {
    if (!bottomCell) return;
    setEditingDateKey?.(toDateKey(bottomCell.date));
    setDraftContent?.(bottomCellContent);
  };
  const handleCommitEditBottom = () => {
    if (!bottomCell) return;
    setCellContent(toDateKey(bottomCell.date), draftContent || '');
    setEditingDateKey?.(null);
    setDraftContent?.('');
  };
  const handleCancelEditBottom = () => {
    setEditingDateKey?.(null);
    setDraftContent?.('');
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: dayIndex * cellWidth,
        top: rowTop,
        width: cellWidth,
        height: cellHeight,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${calendarStyles.cellBorderColor || '#e5e7eb'}`,
        boxSizing: 'border-box'
      }}
    >
      <div
        onClick={e => {
          e.stopPropagation();
          onClick(topCell.date);
        }}
        onDoubleClick={e => {
          e.stopPropagation();
          handleBeginEditTop();
        }}
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          ...topStyles,
          borderBottom: `1px solid ${calendarStyles.cellBorderColor || '#e5e7eb'}`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 'normal', marginBottom: '2px' }}>{topCell.date.getDate()}</div>
        <CalendarCellContent
          date={topCell.date}
          content={topCellContent}
          isEditing={isEditingTop}
          draftContent={draftContent || ''}
          onChange={setDraftContent ?? (() => {})}
          onAccept={handleCommitEditTop}
          onCancel={handleCancelEditTop}
          useModalEditor={true}
          fontSize="10px"
          style={{}}
        />
      </div>
      <div
        onClick={e => {
          if (bottomCell) {
            e.stopPropagation();
            onClick(bottomCell.date);
          }
        }}
        onDoubleClick={e => {
          if (bottomCell) {
            e.stopPropagation();
            handleBeginEditBottom();
          }
        }}
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          ...bottomStyles
        }}
      >
        {bottomCell && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 'normal', marginBottom: '2px' }}>{bottomCell.date.getDate()}</div>
            <CalendarCellContent
              date={bottomCell.date}
              content={bottomCellContent}
              isEditing={isEditingBottom}
              draftContent={draftContent || ''}
              onChange={setDraftContent ?? (() => {})}
              onAccept={handleCommitEditBottom}
              onCancel={handleCancelEditBottom}
              useModalEditor={true}
              fontSize="10px"
              fontFamily={bottomStyles.fontFamily}
              color={bottomStyles.color}
              style={{}}
              label={`Edit content for ${toDateKey(bottomCell.date)}`}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default SplitCalendarCell;
