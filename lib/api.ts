const BASE_URL = process.env.API_BASE_URL;

if (!BASE_URL) {
  throw new Error('API_BASE_URL is not defined');
}

export interface Film {
  bookId: string;
  bookName: string;
  cover: string;
  coverWap?: string; // Add this as optional for backward compatibility
  chapterCount: number;
  introduction: string;
  tags: string[];
  playCount?: string;
  viewCount?: number;
  followCount?: number;
  bookShelfTime?: number;
  shelfTime?: string;
  inLibrary?: boolean;
}

export interface FilmDetail extends Film {
  episodes?: Episode[];
}

export interface Episode {
  chapterId: string;
  chapterName: string;
  chapterIndex: number;
  url?: string;
}

async function fetchApi(
  endpoint: string, 
  params?: Record<string, string>,
  options?: RequestInit
): Promise<any> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  }
  
  // Add timeout and retry logic
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
      ...options, // Merge additional options (including cache config)
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      // Log the error for debugging
      console.error(`API Error ${res.status}: ${res.statusText} for ${endpoint}`);
      throw new Error(`Failed to fetch ${endpoint} (${res.status})`);
    }
    
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Timeout fetching ${endpoint}`);
      throw new Error(`Request timeout for ${endpoint}`);
    }
    
    console.error(`Network error fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function getVip(): Promise<Film[]> {
  const data = await fetchApi('/dramabox/vip');
  // Assume columnVoList[0].bookList
  return data.columnVoList?.[0]?.bookList || [];
}

export async function getDubindo(): Promise<Film[]> {
  const data = await fetchApi('/dramabox/dubindo');
  return data.columnVoList?.[0]?.bookList || [];
}

export async function getRandomDrama(): Promise<Film[]> {
  const data = await fetchApi('/dramabox/randomdrama');
  return data.columnVoList?.[0]?.bookList || [];
}

export async function getForYou(): Promise<Film[]> {
  const data = await fetchApi('/dramabox/foryou');
  return data.columnVoList?.[0]?.bookList || [];
}

export async function getLatest(): Promise<Film[]> {
  const data = await fetchApi('/dramabox/latest');
  return data.columnVoList?.[0]?.bookList || data; // fallback if direct array
}

export async function getTrending(): Promise<Film[]> {
  const data = await fetchApi('/dramabox/trending');
  return data.columnVoList?.[0]?.bookList || data;
}

export async function getPopularSearch(): Promise<Film[]> {
  const data = await fetchApi('/dramabox/populersearch');
  return data.columnVoList?.[0]?.bookList || data;
}

export async function searchDrama(query: string): Promise<Film[]> {
  const data = await fetchApi('/dramabox/search', { query });
  return data.columnVoList?.[0]?.bookList || data;
}

export async function getDetail(bookId: string): Promise<FilmDetail> {
  const data = await fetchApi('/dramabox/detail', { bookId }, {
    next: { 
      revalidate: 3600, // Cache for 1 hour
      tags: [`detail-${bookId}`]
    }
  });
  return data.data.book;
}

export async function getAllEpisodes(bookId: string): Promise<Episode[]> {
  const data = await fetchApi('/dramabox/allepisode', { bookId }, {
    next: { 
      revalidate: 3600, // Cache for 1 hour
      tags: [`episodes-${bookId}`] // Tag untuk invalidation jika perlu
    }
  });
  // Transform the API response to match our Episode interface
  return data.map((ep: any) => {
    // Find the default CDN and default video quality
    const defaultCdn = ep.cdnList?.find((cdn: any) => cdn.isDefault === 1);
    const defaultVideo = defaultCdn?.videoPathList?.find((video: any) => video.isDefault === 1);

    return {
      chapterId: ep.chapterId,
      chapterName: ep.chapterName?.replace(/^EP\s+(\d+)/, 'Episode $1') || `Episode ${ep.chapterIndex + 1}`,
      chapterIndex: ep.chapterIndex,
      url: defaultVideo?.videoPath || null,
    };
  });
}
