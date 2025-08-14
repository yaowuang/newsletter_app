import React from 'react';
import { PastelRotateText } from '@/components/common/PastelRotateText';
import { RainbowRotateText } from '@/components/common/RainbowRotateText';

interface CalendarTitleProps {
  width: number;
  height: number;
  title: string;
  textEffectId: string;
  headerStyles: React.CSSProperties;
  headerTextStyle: React.CSSProperties;
}

const CalendarTitle: React.FC<CalendarTitleProps> = ({ width, height, title, textEffectId, headerStyles, headerTextStyle }) => {
  let renderedTitle: React.ReactNode = title;
  if (textEffectId === 'pastel-rotate') {
    renderedTitle = <PastelRotateText text={title} />;
  } else if (textEffectId === 'rainbow-rotate') {
    renderedTitle = <RainbowRotateText text={title} />;
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: 'bold',
        background: 'transparent',
        pointerEvents: 'none',
        zIndex: 2,
        ...headerStyles
      }}
    >
      <span style={headerTextStyle}>{renderedTitle}</span>
    </div>
  );
};

export default CalendarTitle;
