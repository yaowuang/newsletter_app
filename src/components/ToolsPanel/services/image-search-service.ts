// Service layer following Dependency Inversion Principle
// Abstracts external API dependencies from UI components

export interface ImageSearchResult {
  id: string | number;
  title: string;
  thumbnail: string;
  fullSize: string;
  isVector?: boolean;
  source: string;
}

// Pixabay API response structure
interface PixabayHit {
  id: number;
  tags: string;
  previewURL: string;
  largeImageURL?: string;
  webformatURL?: string;
  image_type?: string;
}

export interface ImageSearchService {
  search(query: string, options?: SearchOptions): Promise<ImageSearchResult[]>;
  validateApiKey?(): boolean;
}

export interface SearchOptions {
  imageType?: "illustration" | "vector" | "photo";
  category?: string;
  safeSearch?: boolean;
  perPage?: number;
  orderBy?: "popular" | "latest";
}

// Concrete implementation for Pixabay
export class PixabayImageSearchService implements ImageSearchService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  validateApiKey(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  async search(query: string, options: SearchOptions = {}): Promise<ImageSearchResult[]> {
    if (!this.validateApiKey()) {
      throw new Error("API key is required for image search");
    }

    if (!query.trim()) {
      return [];
    }

    const params = new URLSearchParams({
      key: this.apiKey,
      q: query.trim(),
      image_type: options.imageType || "illustration",
      category: options.category || "education",
      safesearch: options.safeSearch ? "true" : "false",
      per_page: (options.perPage || 60).toString(),
      order: options.orderBy || "popular",
    });

    const response = await fetch(`https://pixabay.com/api/?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch images`);
    }

    const data = await response.json();
    const hits = Array.isArray(data.hits) ? data.hits : [];

    return hits.map(
      (hit: PixabayHit): ImageSearchResult => ({
        id: hit.id,
        title: hit.tags,
        thumbnail: hit.previewURL,
        fullSize: hit.largeImageURL || hit.webformatURL || hit.previewURL,
        isVector: hit.image_type === "vector",
        source: "Pixabay",
      }),
    );
  }
}

// Factory for creating search services
export class ImageSearchServiceFactory {
  static createPixabayService(apiKey?: string): PixabayImageSearchService | null {
    const key = apiKey || process.env.NEXT_PUBLIC_PIXABAY_KEY;
    if (!key) {
      return null;
    }
    return new PixabayImageSearchService(key);
  }
}
