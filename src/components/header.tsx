"use client";
import React from 'react';
import { Sun, Moon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toPng, toSvg } from 'html-to-image';
import { useStore } from "@/lib/store";
import type { EditorSnapshot } from "@/lib/types";
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

function encodeSnapshot(obj: Record<string, unknown>): Blob {
  const json = JSON.stringify(obj);
  // Simple binary encoding (UTF-8 bytes)
  const encoder = new TextEncoder();
  const bytes = encoder.encode(json);
  return new Blob([bytes], { type: 'application/octet-stream' });
}

async function decodeSnapshot(file: File): Promise<EditorSnapshot> {
  const buffer = await file.arrayBuffer();
  const decoder = new TextDecoder();
  const json = decoder.decode(buffer);
  return JSON.parse(json);
}

export function Header() {
  // Removed unused storeTitle subscription to avoid unnecessary re-renders
  const storeDate = useStore(state => state.date);
  // Removed stateForSnapshot subscription to avoid creating new object each render.
  const loadSnapshot = useStore(state => state.loadSnapshot);

  const buildSnapshot = () => {
    const state = useStore.getState();
    return {
      version: 1,
      title: state.title,
      date: state.date,
      textBlocks: state.textBlocks,
      images: state.images,
      sectionStyles: state.sectionStyles,
      theme: state.theme,
      layout: state.layout,
    };
  };

  // Format date for filename based on the date format
  const formatDateForFilename = (dateStr: string) => {
    if (!dateStr) return '';
    
    // Check if it's a month format (YYYY-MM)
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      const [year, month] = dateStr.split('-');
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      return `${monthNames[parseInt(month) - 1]}-${year}`;
    }
    
    // Check if it's a business week range (e.g., "2025-08-04 to 2025-08-08")
    if (dateStr.includes(' to ')) {
      const mondayDate = dateStr.split(' to ')[0];
      // Monday should be in YYYY-MM-DD format, convert to YYYYMMDD
      if (/^\d{4}-\d{2}-\d{2}$/.test(mondayDate)) {
        return mondayDate.replace(/-/g, '');
      }
    }
    
    // Check if it's a single date in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr.replace(/-/g, '');
    }
    
    // Try to parse other date formats as fallback
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}${month}${day}`;
    }
    
    return '';
  };

  const handleDownload = async (format: 'enl' | 'png' | 'svg' | 'pdf') => {
    try {
      const snapshot = buildSnapshot();
      const dateFormatted = formatDateForFilename(storeDate);
      const titlePart = (snapshot.title || 'newsletter').replace(/\s+/g, '-');
      const safeTitle = dateFormatted ? `${titlePart}-${dateFormatted}` : titlePart;

      if (format === 'enl') {
        const blob = encodeSnapshot(snapshot);
        saveAs(blob, `${safeTitle}.enl`);
        return;
      }
      const inner = document.getElementById('newsletter-canvas');
      if (!inner) return;
      const wrapper = inner.parentElement as HTMLElement | null;
      const captureTarget = wrapper || inner;

      const selectedBorders = captureTarget.querySelectorAll('.border-blue-500');
      selectedBorders.forEach(el => el.classList.remove('border-blue-500', 'border-2'));

      if (format === 'png') {
        const dataUrl = await toPng(captureTarget, { cacheBust: true, pixelRatio: 3 });
        const link = document.createElement('a');
        link.download = `${safeTitle}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'svg') {
        const dataUrl = await toSvg(captureTarget, { cacheBust: true });
        const res = await fetch(dataUrl);
        const svgText = await res.text();
        const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        saveAs(blob, `${safeTitle}.svg`);
      } else if (format === 'pdf') {
        // Reuse html-to-image (already working for PNG) to avoid html2canvas lab() parsing error
        const dataUrl = await toPng(captureTarget, { cacheBust: true, pixelRatio: 3 });
        const img = new Image();
        img.src = dataUrl;
        await new Promise(res => { img.onload = () => res(null); });
        const orientation = img.width > img.height ? 'landscape' : 'portrait';
        const pdf = new jsPDF({ orientation, unit: 'pt', format: 'letter' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;
        pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);
        pdf.save(`${safeTitle}.pdf`);
      }

      selectedBorders.forEach(el => el.classList.add('border-blue-500', 'border-2'));
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const snapshot = await decodeSnapshot(file);
      loadSnapshot(snapshot);
    } catch (err) {
      console.error('Import failed', err);
    } finally {
      e.target.value = '';
    }
  };

  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const enable = stored ? stored === 'dark' : prefers;
      if (enable) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    } catch {}
  }, []);
  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme','dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme','light');
      }
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-2 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="h-8 w-8 text-blue-600 dark:text-blue-400 drop-shadow-sm" aria-hidden="true">
            <rect x="6" y="14" width="16" height="36" rx="2" className="fill-blue-500/90 dark:fill-blue-500" />
            <rect x="24" y="10" width="16" height="40" rx="2" className="fill-purple-500/90 dark:fill-purple-500" />
            <rect x="42" y="18" width="16" height="32" rx="2" className="fill-pink-500/90 dark:fill-pink-500" />
            <rect x="9" y="20" width="10" height="2" className="fill-white/80" />
            <rect x="27" y="16" width="10" height="2" className="fill-white/80" />
            <rect x="45" y="24" width="10" height="2" className="fill-white/80" />
          </svg>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold tracking-tight text-sm sm:text-base bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Elementary School Newsletters</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Unified Download dropdown: ENL (project), PNG, SVG */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Download</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleDownload('enl')}>Download Project (.enl)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('png')}>Download PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('svg')}>Download SVG</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('pdf')}>Download PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Load project */}
        <div>
          <input id="import-file" type="file" accept=".enl" className="hidden" onChange={handleImport} />
          <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>Load</Button>
        </div>
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme} aria-pressed={isDark}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}