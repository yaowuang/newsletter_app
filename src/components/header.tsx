"use client";

import { FileText, Sun, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toPng, toSvg } from 'html-to-image';
import { useStore, EditorSnapshot } from "@/lib/store";
import { saveAs } from 'file-saver';

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
  const storeTitle = useStore(state => state.title);
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

  const handleDownload = async (format: 'enl' | 'png' | 'svg') => {
    try {
      if (format === 'enl') {
        const snapshot = buildSnapshot();
        const blob = encodeSnapshot(snapshot);
        saveAs(blob, `${(snapshot.title || 'newsletter').replace(/\s+/g,'-')}.enl`);
        return;
      }
      const inner = document.getElementById('newsletter-canvas');
      if (!inner) return;
      const wrapper = inner.parentElement as HTMLElement | null;
      const captureTarget = wrapper || inner;

      const selectedBorders = captureTarget.querySelectorAll('.border-blue-500');
      selectedBorders.forEach(el => el.classList.remove('border-blue-500', 'border-2'));

      const safeTitle = (storeTitle || 'newsletter').replace(/\s+/g,'-');

      if (format === 'png') {
        const dataUrl = await toPng(captureTarget, { cacheBust: true, pixelRatio: 3 });
        const link = document.createElement('a');
        link.download = `${safeTitle}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'svg') {
        const dataUrl = await toSvg(captureTarget, { cacheBust: true });
        // dataUrl is an SVG data URI; convert to blob for file-saver
        const res = await fetch(dataUrl);
        const svgText = await res.text();
        const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
        saveAs(blob, `${safeTitle}.svg`);
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

  return (
    <header className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6" />
        <span className="font-semibold">{storeTitle}</span>
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
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Load project */}
        <div>
          <input id="import-file" type="file" accept=".enl" className="hidden" onChange={handleImport} />
          <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>Load</Button>
        </div>
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          <Sun className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}