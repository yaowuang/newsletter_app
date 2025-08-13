import React from 'react';
import { horizontalLineLibrary } from '@/lib/horizontalLines';

interface HorizontalLineProps {
  color?: string;
  thickness?: number;
  style?: 'solid' | 'dashed' | 'dotted' | 'clipart' | 'shadow';
  width?: number | string;
  height?: number; // Height for SVG scaling
  clipartSrc?: string;
}

const HorizontalLine: React.FC<HorizontalLineProps> = ({
  color = '#888',
  thickness = 2,
  style = 'solid',
  width = '100%',
  height = 24, // default height for SVG scaling
  clipartSrc
}) => {
  // Move hooks to top level to avoid conditional hook calls
  const [svgContent, setSvgContent] = React.useState<string>('');
  
  // Determine if we need to fetch SVG content
  const shouldFetchSvg = style === 'clipart' && clipartSrc && clipartSrc.trim().endsWith('.svg');
  
  React.useEffect(() => {
    if (shouldFetchSvg) {
      const trimmed = clipartSrc!.trim();
      // Add cache busting parameter to force fresh fetch of updated SVG
      const cacheBustUrl = trimmed + (trimmed.includes('?') ? '&' : '?') + '_cb=' + Date.now();
      fetch(cacheBustUrl)
        .then(response => response.text())
        .then(svgText => setSvgContent(svgText))
        .catch(error => console.error('Error loading SVG:', error));
    } else {
      setSvgContent(''); // Reset when not needed
    }
  }, [shouldFetchSvg, clipartSrc]);

  if (style === 'clipart' && clipartSrc) {
    const trimmed = clipartSrc.trim();
    const isInlineSvg = trimmed.startsWith('<svg');
    const isSvgFile = trimmed.endsWith('.svg');
    
    // Detect if this svg is marked as repeatable in library
    const libEntry = horizontalLineLibrary.find(l => l.preview === clipartSrc);
    const repeatable = libEntry?.repeat;
    const isColorCustomizable = libEntry?.colorCustomizable !== false;
    
    if (isInlineSvg) {
      // Handle inline SVG (legacy support)
      if (repeatable) {
        // For repeatable SVGs, extract dimensions from viewBox
        const viewBoxMatch = trimmed.match(/viewBox=['"]([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)['"]/);
        
        let originalWidth = 48; // default fallback
        let originalHeight = 48; // default fallback
        
        if (viewBoxMatch) {
          originalWidth = parseFloat(viewBoxMatch[3]);
          originalHeight = parseFloat(viewBoxMatch[4]);
        }
        
        // Scale the SVG to match the desired height while maintaining aspect ratio
        const scaleFactor = height / originalHeight;
        const scaledWidth = originalWidth * scaleFactor;
        
        // Create a scaled version of the SVG for the background pattern
        // Apply color transformations only if the SVG is color customizable
        let scaledSvg;
        if (isColorCustomizable) {
          scaledSvg = trimmed
            .replace(/fill="currentColor"/g, `fill="${color}"`) // Replace currentColor with actual color
            .replace(/fill="[^"]*"/g, `fill="${color}"`) // Replace any other hardcoded fill colors
            .replace(/stroke="currentColor"/g, `stroke="${color}"`) // Also handle stroke colors
            .replace(/stroke="[^"]*"/g, `stroke="${color}"`) // Replace any hardcoded stroke colors
            .replace(/width=['"][^'"]*['"]/, `width="${scaledWidth}"`)
            .replace(/height=['"][^'"]*['"]/, `height="${height}"`);
        } else {
          scaledSvg = trimmed
            .replace(/fill="currentColor"/g, `fill="${color}"`) // Only replace currentColor
            .replace(/stroke="currentColor"/g, `stroke="${color}"`) // Only replace currentColor for stroke
            .replace(/width=['"][^'"]*['"]/, `width="${scaledWidth}"`)
            .replace(/height=['"][^'"]*['"]/, `height="${height}"`);
        }
        const encoded = encodeURIComponent(scaledSvg)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22');
        const dataUri = `url("data:image/svg+xml,${encoded}")`;
        
        return (
          <div
            style={{
              width: typeof width === 'number' ? `${width}px` : width,
              height: height,
              backgroundImage: dataUri,
              backgroundRepeat: 'repeat-x',
              backgroundSize: `${scaledWidth}px ${height}px`,
              backgroundPosition: 'center',
              lineHeight: 0,
              margin: 0,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              color: color, // Set color for currentColor in SVG
            }}
            aria-hidden
          />
        );
      }
      
      // For non-repeatable inline SVGs, scale to fill the full container
      const viewBoxMatch = trimmed.match(/viewBox=['"]([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)['"]/);
      
      let scaledSvg;
      if (isColorCustomizable) {
        scaledSvg = trimmed
          .replace(/fill="currentColor"/g, `fill="${color}"`) // Replace currentColor with actual color
          .replace(/fill="[^"]*"/g, `fill="${color}"`) // Replace any other hardcoded fill colors
          .replace(/stroke="currentColor"/g, `stroke="${color}"`) // Also handle stroke colors
          .replace(/stroke="[^"]*"/g, `stroke="${color}"`); // Replace any hardcoded stroke colors
      } else {
        scaledSvg = trimmed
          .replace(/fill="currentColor"/g, `fill="${color}"`) // Only replace currentColor
          .replace(/stroke="currentColor"/g, `stroke="${color}"`); // Only replace currentColor for stroke
      }
      
      if (viewBoxMatch) {
        // If we have a viewBox, set width and height to scale properly
        const containerWidth = typeof width === 'number' ? width : 400; // fallback width
        scaledSvg = scaledSvg
          .replace(/width=['"][^'"]*['"]/, `width="${containerWidth}"`)
          .replace(/height=['"][^'"]*['"]/, `height="${height}"`);
      } else {
        // If no viewBox, add one based on current width/height and scale
        const widthMatch = trimmed.match(/width=['"]([0-9.]+)['"]/);
        const heightMatch = trimmed.match(/height=['"]([0-9.]+)['"]/);
        
        if (widthMatch && heightMatch) {
          const origW = parseFloat(widthMatch[1]);
          const origH = parseFloat(heightMatch[1]);
          const containerWidth = typeof width === 'number' ? width : 400;
          
          scaledSvg = scaledSvg
            .replace(/<svg([^>]*)>/, `<svg$1 viewBox="0 0 ${origW} ${origH}" width="${containerWidth}" height="${height}">`)
            .replace(/width=['"][^'"]*['"]/, `width="${containerWidth}"`)
            .replace(/height=['"][^'"]*['"]/, `height="${height}"`);
        }
      }
      
      return (
        <div
           
          dangerouslySetInnerHTML={{ __html: scaledSvg }}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: typeof width === 'number' ? `${width}px` : width, 
            height: height,
            lineHeight: 0,
            margin: 0,
            padding: 0,
            color: color, // Set color for currentColor in SVG
          }}
        />
      );
    } else if (isSvgFile) {
      // Handle SVG file paths - fetch and inline them to apply colors
      if (!svgContent) {
        // Loading fallback
        return (
          <div
            style={{
              width: typeof width === 'number' ? `${width}px` : width,
              height: height,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Loading...
          </div>
        );
      }
      
      if (repeatable) {
        // For repeatable SVGs, extract dimensions from viewBox
        const viewBoxMatch = svgContent.match(/viewBox=['"]([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)['"]/);
        
        let originalWidth = 48; // default fallback
        let originalHeight = 48; // default fallback
        
        if (viewBoxMatch) {
          originalWidth = parseFloat(viewBoxMatch[3]);
          originalHeight = parseFloat(viewBoxMatch[4]);
        }
        
        // Scale the SVG to match the desired height while maintaining aspect ratio
        const scaleFactor = height / originalHeight;
        const scaledWidth = originalWidth * scaleFactor;
        
        // Create a scaled version of the SVG for the background pattern
        // Apply color transformations only if the SVG is color customizable
        let scaledSvg;
        if (isColorCustomizable) {
          scaledSvg = svgContent
            .replace(/fill="currentColor"/g, `fill="${color}"`) // Replace currentColor with actual color
            .replace(/fill="[^"]*"/g, `fill="${color}"`) // Replace any other hardcoded fill colors
            .replace(/stroke="currentColor"/g, `stroke="${color}"`) // Also handle stroke colors
            .replace(/stroke="[^"]*"/g, `stroke="${color}"`) // Replace any hardcoded stroke colors
            .replace(/width=['"][^'"]*['"]/, `width="${scaledWidth}"`)
            .replace(/height=['"][^'"]*['"]/, `height="${height}"`);
        } else {
          scaledSvg = svgContent
            .replace(/fill="currentColor"/g, `fill="${color}"`) // Only replace currentColor
            .replace(/stroke="currentColor"/g, `stroke="${color}"`) // Only replace currentColor for stroke
            .replace(/width=['"][^'"]*['"]/, `width="${scaledWidth}"`)
            .replace(/height=['"][^'"]*['"]/, `height="${height}"`);
        }
        const encoded = encodeURIComponent(scaledSvg)
          .replace(/'/g, '%27')
          .replace(/"/g, '%22');
        const dataUri = `url("data:image/svg+xml,${encoded}")`;
        
        return (
          <div
            style={{
              width: typeof width === 'number' ? `${width}px` : width,
              height: height,
              backgroundImage: dataUri,
              backgroundRepeat: 'repeat-x',
              backgroundSize: `${scaledWidth}px ${height}px`,
              backgroundPosition: 'center',
              lineHeight: 0,
              margin: 0,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              color: color, // Set color for currentColor in SVG
            }}
            aria-hidden
          />
        );
      } else {
        // For non-repeatable SVG files, inline the SVG and scale it
        const viewBoxMatch = svgContent.match(/viewBox=['"]([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)['"]/);
        
        let scaledSvg;
        if (isColorCustomizable) {
          scaledSvg = svgContent
            .replace(/fill="currentColor"/g, `fill="${color}"`) // Replace currentColor with actual color
            .replace(/fill="[^"]*"/g, `fill="${color}"`) // Replace any other hardcoded fill colors
            .replace(/stroke="currentColor"/g, `stroke="${color}"`) // Also handle stroke colors
            .replace(/stroke="[^"]*"/g, `stroke="${color}"`); // Replace any hardcoded stroke colors
        } else {
          scaledSvg = svgContent
            .replace(/fill="currentColor"/g, `fill="${color}"`) // Only replace currentColor
            .replace(/stroke="currentColor"/g, `stroke="${color}"`); // Only replace currentColor for stroke
        }
        
        if (viewBoxMatch) {
          // If we have a viewBox, set width and height to scale properly
          const containerWidth = typeof width === 'number' ? width : 400; // fallback width
          scaledSvg = scaledSvg
            .replace(/width=['"][^'"]*['"]/, `width="${containerWidth}"`)
            .replace(/height=['"][^'"]*['"]/, `height="${height}"`);
        } else {
          // If no viewBox, add one based on current width/height and scale
          const widthMatch = svgContent.match(/width=['"]([0-9.]+)['"]/);
          const heightMatch = svgContent.match(/height=['"]([0-9.]+)['"]/);
          
          if (widthMatch && heightMatch) {
            const origW = parseFloat(widthMatch[1]);
            const origH = parseFloat(heightMatch[1]);
            const containerWidth = typeof width === 'number' ? width : 400;
            
            scaledSvg = scaledSvg
              .replace(/<svg([^>]*)>/, `<svg$1 viewBox="0 0 ${origW} ${origH}" width="${containerWidth}" height="${height}">`)
              .replace(/width=['"][^'"]*['"]/, `width="${containerWidth}"`)
              .replace(/height=['"][^'"]*['"]/, `height="${height}"`);
          }
        }
        
        return (
          <div
             
            dangerouslySetInnerHTML={{ __html: scaledSvg }}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: typeof width === 'number' ? `${width}px` : width, 
              height: height,
              lineHeight: 0,
              margin: 0,
              padding: 0,
              color: color, // Set color for currentColor in SVG
            }}
          />
        );
      }
    }
    
    // Fallback for other image types
    return <img 
      src={clipartSrc} 
      alt="Horizontal Line Clipart" 
      style={{ 
        width, 
        height,
        margin: 0,
        padding: 0,
        display: 'block'
      }} 
    />;
  }

  if (style === 'shadow') {
    return (
      <hr
        style={{
          border: 'none',
          borderTop: `${thickness}px solid ${color}`,
          width,
          margin: 0,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      />
    );
  }

  // Handle standard border styles (solid, dashed, dotted)
  return (
    <hr
      style={{
        border: 'none',
        borderTop: `${thickness}px ${style} ${color}`,
        width,
        margin: 0,
      }}
    />
  );
};

export default HorizontalLine;
