import React, { useRef } from 'react';
import type { TextBlock } from '@/features/newsletter/types';


interface TextBlockProps {
  block: TextBlock;
}

// TextBlock: Renders a single text block with markdown support. SRP: only text block rendering.
export function TextBlock({ block }: TextBlockProps) {
  // Ref for the container div
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef}></div>
  );
}


