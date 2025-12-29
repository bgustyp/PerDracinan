import Link from "next/link";
import { getAllEpisodes, getDetail, Episode, FilmDetail } from "@/lib/api";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import Image from "next/image";
import { Metadata } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'DramaBox';

async function getEpisodeData(videoId: string, episodeIndex: number): Promise<{ episode: Episode; film: FilmDetail; allEpisodes: Episode[] }> {
  try {
    const [episodes, film] = await Promise.all([
      getAllEpisodes(videoId),
      getDetail(videoId)
    ]);
    const episode = episodes.find((ep: Episode) => ep.chapterIndex === episodeIndex);
    if (!episode) notFound();
    return { episode, film, allEpisodes: episodes };
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export async function generateMetadata({ params }: { params: { videoId: string; episode: string } }): Promise<Metadata> {
  try {
    const { videoId, episode: episodeParam } = await params;
    const episodeIndex = parseInt(episodeParam);
    const { episode, film } = await getEpisodeData(videoId, episodeIndex);
    return {
      title: `${film.bookName} - Episode ${episode.chapterIndex + 1} | ${APP_NAME}`,
      description: `Watch ${episode.chapterName} - ${film.introduction}`,
    };
  } catch {
    return {
      title: `Watch Episode - ${APP_NAME}`,
    };
  }
}

export default async function WatchEpisode({
  params,
}: {
  params: { videoId: string; episode: string };
}) {
  const { videoId, episode: episodeParam } = await params;
  const episodeIndex = parseInt(episodeParam);
  const { episode, film, allEpisodes } = await getEpisodeData(videoId, episodeIndex);

  const prevEpisode = allEpisodes.find(ep => ep.chapterIndex === episodeIndex - 1);
  const nextEpisode = allEpisodes.find(ep => ep.chapterIndex === episodeIndex + 1);

  return (
    <div className="min-h-screen bg-black">
      {/* Compact Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link 
              href={`/video/${videoId}`} 
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </Link>
            
            <div className="flex-1 text-center min-w-0">
              <h1 className="text-white font-semibold truncate">{film.bookName}</h1>
              <p className="text-gray-400 text-sm">Episode {episode.chapterIndex + 1}</p>
            </div>

            <div className="flex items-center gap-2">
              {prevEpisode && (
                <Link
                  href={`/watch/${videoId}/${prevEpisode.chapterIndex}`}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Previous Episode"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              )}
              {nextEpisode && (
                <Link
                  href={`/watch/${videoId}/${nextEpisode.chapterIndex}`}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  title="Next Episode"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <main className="flex-1">
          {/* Video Player - Full Width */}
          <div className="w-full bg-black">
            <VideoPlayer episode={episode} videoId={videoId} />
          </div>

          {/* Episode Info */}
          <div className="px-4 py-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Film Poster - Hidden on mobile */}
              <div className="hidden md:block flex-shrink-0">
                <Link href={`/video/${videoId}`}>
                  <div className="w-28 aspect-[2/3] relative rounded-lg overflow-hidden ring-1 ring-white/10 hover:ring-red-500/50 transition-all">
                    {(film.cover || film.coverWap) ? (
                      <Image
                        src={film.cover || film.coverWap!}
                        alt={film.bookName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800" />
                    )}
                  </div>
                </Link>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                      {episode.chapterName}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <Link href={`/video/${videoId}`} className="text-red-400 hover:text-red-300">
                        {film.bookName}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {film.tags?.slice(0, 4).map((tag, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                  {film.introduction}
                </p>
              </div>
            </div>

            {/* Episode Navigation - Mobile */}
            <div className="flex gap-3 mt-6 lg:hidden">
              {prevEpisode ? (
                <Link
                  href={`/watch/${videoId}/${prevEpisode.chapterIndex}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Prev</span>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {nextEpisode && (
                <Link
                  href={`/watch/${videoId}/${nextEpisode.chapterIndex}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-colors"
                >
                  <span>Next</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </main>

        {/* Episode Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 xl:w-96 border-l border-gray-800/50 bg-gray-900/50">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-800/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Episodes</h3>
                <span className="text-gray-400 text-sm">{allEpisodes.length} total</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {allEpisodes.map((ep) => {
                const isActive = ep.chapterIndex === episode.chapterIndex;
                return (
                  <Link
                    key={ep.chapterId}
                    href={`/watch/${videoId}/${ep.chapterIndex}`}
                    className={`flex items-center gap-3 p-3 rounded-lg mb-1 transition-all duration-200 ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                    }`}
                  >
                    {/* Episode Number */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-white/20' : 'bg-gray-800'
                    }`}>
                      {isActive ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{ep.chapterIndex + 1}</span>
                      )}
                    </div>
                    
                    {/* Episode Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {ep.chapterName}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
