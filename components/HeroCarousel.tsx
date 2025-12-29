'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Film } from '@/lib/api';

interface HeroCarouselProps {
  films: Film[];
}

export default function HeroCarousel({ films }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredFilms = films.slice(0, 5);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredFilms.length);
  }, [featuredFilms.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredFilms.length) % featuredFilms.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying || featuredFilms.length === 0) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, featuredFilms.length]);

  if (featuredFilms.length === 0) return null;

  const currentFilm = featuredFilms[currentIndex];

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden rounded-2xl mb-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        {(currentFilm.coverWap || currentFilm.cover) ? (
          <Image
            src={currentFilm.coverWap || currentFilm.cover}
            alt={currentFilm.bookName}
            fill
            className="object-cover transition-transform duration-700"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 px-6 md:px-12 lg:px-16">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-end max-w-5xl">
          {/* Poster */}
          <div className="hidden md:block flex-shrink-0">
            {(currentFilm.cover || currentFilm.coverWap) ? (
              <Image
                src={currentFilm.cover || currentFilm.coverWap!}
                alt={currentFilm.bookName}
                width={180}
                height={270}
                className="rounded-xl shadow-2xl ring-1 ring-white/10"
              />
            ) : (
              <div className="w-[180px] h-[270px] bg-gray-800 rounded-xl flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {currentFilm.tags?.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-red-500/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 line-clamp-2">
              {currentFilm.bookName}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {currentFilm.playCount || currentFilm.viewCount?.toLocaleString() || '0'} views
              </span>
              <span>{currentFilm.chapterCount} Episodes</span>
            </div>

            <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 max-w-2xl mb-6">
              {currentFilm.introduction}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/watch/${currentFilm.bookId}/1`}
                className="flex items-center gap-2 bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Now
              </Link>
              <Link
                href={`/video/${currentFilm.bookId}`}
                className="flex items-center gap-2 bg-gray-600/80 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-500/80 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredFilms.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
