import Link from "next/link";
import { getLatest, getTrending, getPopularSearch, getForYou, searchDrama, Film } from "@/lib/api";
import FilmCard from "@/components/FilmCard";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import FilmRow from "@/components/FilmRow";
import ContinueWatching from "@/components/ContinueWatching";
import BottomNav from "@/components/BottomNav";
import { Metadata } from "next";

async function getDashboardData(search?: string) {
  if (search) {
    try {
      const results = await searchDrama(search);
      return { latest: [], trending: [], popular: [], forYou: [], searchResults: results };
    } catch (error) {
      console.error(error);
      return { latest: [], trending: [], popular: [], forYou: [], searchResults: [] };
    }
  }
  try {
    const [latest, trending, popular, forYou] = await Promise.all([
      getLatest(),
      getTrending(),
      getPopularSearch(),
      getForYou(),
    ]);
    return { latest, trending, popular, forYou, searchResults: null };
  } catch (error) {
    console.error(error);
    return { latest: [], trending: [], popular: [], forYou: [], searchResults: null };
  }
}

function FilmGrid({ films, title }: { films: Film[]; title: string }) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {films.map((film) => (
          <FilmCard key={film.bookId} film={film} />
        ))}
      </div>
    </section>
  );
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'PerDracinan';

export const metadata: Metadata = {
  title: `${APP_NAME} Streaming - Tonton Drama Terbaru`,
  description: `Streaming drama terbaru, trending, dan populer dari ${APP_NAME} API.`,
  openGraph: {
    title: `${APP_NAME} Streaming`,
    description: "Tonton drama favorit Anda secara online.",
    type: "website",
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const { latest, trending, popular, forYou, searchResults } = await getDashboardData(params.search);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />
      <main className="pb-20 md:pb-8">
        {searchResults ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
              <p className="text-gray-400">Found {searchResults.length} results for "{params.search}"</p>
            </div>
            {searchResults.length > 0 ? (
              <FilmGrid films={searchResults} title={`Results for "${params.search}"`} />
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
                <p className="text-gray-400">Try searching with different keywords</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Hero Carousel */}
            <div className="px-4 sm:px-6 lg:px-8 pt-6">
              <div className="max-w-7xl mx-auto">
                <HeroCarousel films={trending} />
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Continue Watching */}
              <ContinueWatching />

              {/* Trending with Rank */}
              <FilmRow title="🔥 Trending Now" films={trending} showRank />

              {/* Latest */}
              <FilmRow title="✨ Latest Releases" films={latest} />

              {/* For You */}
              {forYou.length > 0 && (
                <FilmRow title="💝 For You" films={forYou} />
              )}

              {/* Popular */}
              <FilmRow title="⭐ Popular" films={popular} />
            </div>
          </div>
        )}
      </main>

      {/* Footer - Hidden on mobile because of BottomNav */}
      <footer className="hidden md:block bg-gray-900/50 border-t border-gray-800 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {APP_NAME.split(' ').map(word => word[0]).join('').toUpperCase()}
                </span>
              </div>
              <span className="text-white font-semibold">{APP_NAME}</span>
            </div>
            <div className="text-center text-gray-500 text-sm">
              <p>&copy; 2025 {APP_NAME} Streaming. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <Link href="/watchlist" className="hover:text-white transition-colors">Watchlist</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
}
