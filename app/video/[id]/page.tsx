import Link from "next/link";
import Image from "next/image";
import { getDetail, getAllEpisodes, FilmDetail, Episode } from "@/lib/api";
import AddToWatchlistButton from "@/components/AddToWatchlistButton";
import BottomNav from "@/components/BottomNav";
import { Metadata } from "next";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'DramaBox';

async function getFilmData(bookId: string): Promise<FilmDetail> {
  try {
    const [detail, episodes] = await Promise.all([
      getDetail(bookId),
      getAllEpisodes(bookId),
    ]);
    return { ...detail, episodes };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to load film data");
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const film = await getFilmData(id);
    return {
      title: `${film.bookName} - ${APP_NAME} Streaming`,
      description: film.introduction,
      openGraph: {
        title: film.bookName,
        description: film.introduction,
        images: [film.cover || film.coverWap || ''],
        type: 'video.tv_show',
      },
    };
  } catch {
    return {
      title: `Detail Film - ${APP_NAME} Streaming`,
    };
  }
}

export default async function VideoDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const film = await getFilmData(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black pb-20 md:pb-0">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        {/* Backdrop Image */}
        <div className="absolute inset-0 h-[60vh] md:h-[70vh]">
          {(film.coverWap || film.cover) ? (
            <Image
              src={film.coverWap || film.cover}
              alt={film.bookName}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-transparent to-transparent" />
        </div>

        {/* Navigation */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-4">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>
        </div>

        {/* Film Info */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-32 md:pt-48">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              {/* Poster */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative w-40 md:w-52 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                  {(film.cover || film.coverWap) ? (
                    <Image
                      src={film.cover || film.coverWap!}
                      alt={film.bookName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {film.bookName}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-300 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {film.playCount || film.viewCount?.toLocaleString() || '0'} views
                  </span>
                  <span className="text-gray-600">•</span>
                  <span>{film.chapterCount} Episodes</span>
                  {film.followCount && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span>{film.followCount.toLocaleString()} followers</span>
                    </>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  {film.tags?.slice(0, 5).map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                  {film.episodes && film.episodes.length > 0 && (
                    <Link
                      href={`/watch/${film.bookId}/${film.episodes[0].chapterIndex}`}
                      className="flex items-center gap-2 bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Play Episode 1
                    </Link>
                  )}
                  <AddToWatchlistButton film={film} />
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl">
                  {film.introduction}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Episodes</h2>
            <span className="text-gray-400 text-sm">{film.episodes?.length || 0} episodes</span>
          </div>

          {/* Episode Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {film.episodes?.map((episode) => (
              <Link
                key={episode.chapterId}
                href={`/watch/${film.bookId}/${episode.chapterIndex}`}
                className="group relative bg-gray-800/50 hover:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-red-500/50"
              >
                {/* Episode Thumbnail */}
                <div className="aspect-video relative bg-gray-900">
                  {(film.cover || film.coverWap) ? (
                    <Image
                      src={film.cover || film.coverWap!}
                      alt={episode.chapterName}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      sizes="200px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
                  )}
                  
                  {/* Episode Number Badge */}
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
                    EP {episode.chapterIndex}
                  </div>

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Episode Info */}
                <div className="p-3">
                  <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-red-400 transition-colors">
                    {episode.chapterName}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Navigation for Mobile */}
      <BottomNav />
    </div>
  );
}
