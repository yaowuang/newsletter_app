import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

interface ClipartItem { id: string|number; title: string; thumb: string; full: string; isVector?: boolean; }

export const ClipartSearch: React.FC = () => {
  const pixabayKey = process.env.NEXT_PUBLIC_PIXABAY_KEY;
  const addImageStore = useStore(state => state.addImage);
  const updateImageStore = useStore(state => state.updateImage);
  const [query, setQuery] = useState('school');
  const [mode, setMode] = useState<'illustration'|'vector'>('illustration');
  const [results, setResults] = useState<ClipartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const addImageFromSrc = (src: string) => {
    addImageStore();
    const img = useStore.getState().images.slice(-1)[0];
    if (img) updateImageStore(img.id, { src });
  };

  const search = async () => {
    if (!query.trim()) return;
    if (!pixabayKey) { setError('Pixabay API key missing (set NEXT_PUBLIC_PIXABAY_KEY).'); return; }
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({
        key: pixabayKey,
        q: query.trim(),
        image_type: mode === 'vector' ? 'vector' : 'illustration',
        category: 'education',
        safesearch: 'true',
        per_page: '60',
        order: 'popular'
      });
      const res = await fetch(`https://pixabay.com/api/?${params.toString()}`);
      if (!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      const hits = Array.isArray(data.hits) ? data.hits : [];
      setResults(hits.map((h: {
        id: number;
        tags: string;
        previewURL: string;
        largeImageURL?: string;
        webformatURL?: string;
        image_type: string;
      }) => ({ id: h.id, title: h.tags, thumb: h.previewURL, full: h.largeImageURL || h.webformatURL || h.previewURL, isVector: h.image_type === 'vector' })));
    } catch (e: Error | unknown) {
      setResults([]); setError(e instanceof Error ? e.message : 'Error');
    } finally { setLoading(false); }
  };

  const insert = (item: ClipartItem) => { if (item.full) addImageFromSrc(item.full); };

  return (
    <div className='space-y-4'>
      <div className='flex gap-2 items-center'>
        <label htmlFor='clipart-search-query' className='sr-only'>Clipart search query</label>
        <input id='clipart-search-query' name='clipartSearchQuery' autoComplete='off' type='text' value={query} onChange={e => setQuery(e.target.value)} placeholder='Search (e.g. school, teacher, books)' className='flex-grow px-2 py-1 text-sm border rounded-md bg-transparent' onKeyDown={e => { if (e.key==='Enter') { e.preventDefault(); search(); } }} />
        <label htmlFor='clipart-search-mode' className='sr-only'>Image type</label>
        <select id='clipart-search-mode' name='clipartSearchMode' value={mode} onChange={e => setMode(e.target.value as 'illustration' | 'vector')} className='text-sm border rounded-md px-2 py-1 bg-transparent'>
          <option value='illustration'>Illustrations</option>
          <option value='vector'>Vectors</option>
        </select>
        <Button size='sm' onClick={search} disabled={loading || !query.trim()} aria-label='Search clipart'>{loading ? '...' : 'Search'}</Button>
      </div>
      {!pixabayKey && <p className='text-xs text-amber-600'>Set NEXT_PUBLIC_PIXABAY_KEY to enable search.</p>}
      {error && <p className='text-xs text-red-600'>{error}</p>}
      <div className='min-h-[140px] border rounded-md p-2 overflow-auto'>
        {loading && <p className='text-xs text-muted-foreground'>Loading...</p>}
        {!loading && results.length === 0 && !error && pixabayKey && <p className='text-xs text-muted-foreground'>No results. Try another term.</p>}
        {!loading && results.length > 0 && (
          <div className='grid grid-cols-4 gap-2'>
            {results.map(r => (
              <div key={r.id} className='group cursor-pointer border rounded-sm p-1 hover:border-blue-500 flex flex-col items-center' onClick={() => insert(r)}>
                {r.thumb ? <img src={r.thumb} alt={r.title} className='w-full h-14 object-contain' loading='lazy' /> : <div className='w-full h-14 flex items-center justify-center text-[10px] text-muted-foreground'>No Img</div>}
                <p className='text-[10px] mt-1 text-center line-clamp-2 leading-tight' title={r.title}>{r.title}</p>
                <p className='opacity-0 group-hover:opacity-100 text-[9px] text-blue-600 mt-0.5'>Insert</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className='text-[10px] text-muted-foreground'>Source: Pixabay (Illustrations/Vectors, free with API key, verify license for commercial use).</p>
    </div>
  );
};
