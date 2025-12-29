'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Film } from '@/lib/api';

interface FilmRowProps {
  title: string;
  films: Film[];
  showRank?: boolean;
}

export default function FilmRow({ title, films, showRank = false }: FilmRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (films.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex items-center justify-center w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {films.map((film, index) => (
          <Link
            key={film.bookId}
            href={`/video/${film.bookId}`}
            className="group flex-shrink-0 w-[140px] md:w-[160px] lg:w-[180px]"
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:z-10">
              {/* Rank Badge */}
              {showRank && (
                <div className="absolute -left-2 -bottom-2 z-20">
                  <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-400 to-gray-700 drop-shadow-lg" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}>
                    {index + 1}
                  </span>
                </div>
              )}

              {/* Poster */}
              <div className="aspect-[2/3] relative">
                {(film.cover || film.coverWap) ? (
                  <Image
                    src={film.cover || film.coverWap!}
                    alt={film.bookName}
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Info on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-sm font-medium line-clamp-1 mb-1">{film.bookName}</h3>
                  <p className="text-gray-300 text-xs line-clamp-2">{film.introduction}</p>
                </div>

                {/* Tag Badge */}
                {film.tags && film.tags.length > 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                      {film.tags[0]}
                    </span>
                  </div>
                )}

                {/* Episode Count */}
                <div className="absolute top-2 right-2">
                  <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    {film.chapterCount} Ep
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
