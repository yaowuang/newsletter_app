import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ClipartSearchProps } from './interfaces/picker-interfaces';
import { 
  ImageSearchService, 
  ImageSearchResult, 
  ImageSearchServiceFactory,
  SearchOptions 
} from './services/image-search-service';

// Refactored ClipartSearch following Single Responsibility and Dependency Inversion principles
export const ClipartSearch: React.FC<ClipartSearchProps> = ({ onResultSelect }) => {
  const [searchService] = useState<ImageSearchService | null>(() => 
    ImageSearchServiceFactory.createPixabayService()
  );
  
  const [query, setQuery] = useState('school');
  const [mode, setMode] = useState<'illustration' | 'vector'>('illustration');
  const [results, setResults] = useState<ImageSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim() || !searchService) return;

    setLoading(true);
    setError(null);

    try {
      const searchOptions: SearchOptions = {
        imageType: mode,
        category: 'education',
        safeSearch: true,
        perPage: 60,
        orderBy: 'popular'
      };

      const searchResults = await searchService.search(query.trim(), searchOptions);
      setResults(searchResults);
    } catch (err) {
      setResults([]);
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: ImageSearchResult) => {
    // Pass the entire result so consumers can choose which fields to use
    onResultSelect?.(result);
  };

  const hasValidApiKey = searchService?.validateApiKey?.() ?? false;

  return (
    <div className="space-y-4">
      <SearchControls
        query={query}
        mode={mode}
        loading={loading}
        onQueryChange={setQuery}
        onModeChange={setMode}
        onSearch={handleSearch}
      />
      
      {!hasValidApiKey && (
        <ApiKeyWarning />
      )}
      
      {error && (
        <ErrorMessage message={error} />
      )}
      
      <SearchResults
        results={results}
        loading={loading}
        hasValidApiKey={hasValidApiKey}
        onResultClick={handleResultClick}
      />
      
      <SourceAttribution />
    </div>
  );
};

// Extracted sub-components for better organization and testability
const SearchControls: React.FC<{
  query: string;
  mode: 'illustration' | 'vector';
  loading: boolean;
  onQueryChange: (query: string) => void;
  onModeChange: (mode: 'illustration' | 'vector') => void;
  onSearch: () => void;
}> = ({ query, mode, loading, onQueryChange, onModeChange, onSearch }) => (
  <div className="flex gap-2 items-center">
    <label htmlFor="clipart-search-query" className="sr-only">
      Clipart search query
    </label>
    <input
      id="clipart-search-query"
      name="clipartSearchQuery"
      autoComplete="off"
      type="text"
      value={query}
      onChange={e => onQueryChange(e.target.value)}
      placeholder="Search (e.g. school, teacher, books)"
      className="flex-grow px-2 py-1 text-sm border rounded-md bg-transparent"
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSearch();
        }
      }}
    />
    <label htmlFor="clipart-search-mode" className="sr-only">
      Image type
    </label>
    <select
      id="clipart-search-mode"
      name="clipartSearchMode"
      value={mode}
      onChange={e => onModeChange(e.target.value as 'illustration' | 'vector')}
      className="text-sm border rounded-md px-2 py-1 bg-transparent"
    >
      <option value="illustration">Illustrations</option>
      <option value="vector">Vectors</option>
    </select>
    <Button
      size="sm"
      onClick={onSearch}
      disabled={loading || !query.trim()}
      aria-label="Search clipart"
    >
      {loading ? '...' : 'Search'}
    </Button>
  </div>
);

const ApiKeyWarning: React.FC = () => (
  <p className="text-xs text-amber-600">
    Set NEXT_PUBLIC_PIXABAY_KEY to enable search.
  </p>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <p className="text-xs text-red-600">{message}</p>
);

const SearchResults: React.FC<{
  results: ImageSearchResult[];
  loading: boolean;
  hasValidApiKey: boolean;
  onResultClick: (result: ImageSearchResult) => void;
}> = ({ results, loading, hasValidApiKey, onResultClick }) => (
  <div className="min-h-[140px] border rounded-md p-2 overflow-auto">
    {loading && (
      <p className="text-xs text-muted-foreground">Loading...</p>
    )}
    
    {!loading && results.length === 0 && !hasValidApiKey && (
      <p className="text-xs text-muted-foreground">
        API key required for search.
      </p>
    )}
    
    {!loading && results.length === 0 && hasValidApiKey && (
      <p className="text-xs text-muted-foreground">
        No results. Try another term.
      </p>
    )}
    
    {!loading && results.length > 0 && (
      <div className="grid grid-cols-4 gap-2">
        {results.map(result => (
          <SearchResultItem
            key={result.id}
            result={result}
            onClick={() => onResultClick(result)}
          />
        ))}
      </div>
    )}
  </div>
);

const SearchResultItem: React.FC<{
  result: ImageSearchResult;
  onClick: () => void;
}> = ({ result, onClick }) => (
  <div
    className="group cursor-pointer border rounded-sm p-1 hover:border-blue-500 flex flex-col items-center"
    onClick={onClick}
  >
    {result.thumbnail ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={result.thumbnail}
        alt={result.title}
        className="w-full h-14 object-contain"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-14 flex items-center justify-center text-[10px] text-muted-foreground">
        No Img
      </div>
    )}
    <p
      className="text-[10px] mt-1 text-center line-clamp-2 leading-tight"
      title={result.title}
    >
      {result.title}
    </p>
    <p className="opacity-0 group-hover:opacity-100 text-[9px] text-blue-600 mt-0.5">
      Insert
    </p>
  </div>
);

const SourceAttribution: React.FC = () => (
  <p className="text-[10px] text-muted-foreground">
    Source: Pixabay (Illustrations/Vectors, free with API key, verify license for commercial use).
  </p>
);
