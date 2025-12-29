'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Film } from '@/lib/api';

interface WatchProgress {
  videoId: string;
  episode: number;
  timestamp: number;
  film?: Film;
}

export default function ContinueWatching() {
  const [progress, setProgress] = useState<WatchProgress | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('continueWatching');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setProgress(data);
      } catch {
        setProgress(null);
      }
    }
  }, []);

  if (!progress) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-1">Continue Watching</h2>
      
      <Link
        href={`/watch/${progress.videoId}/${progress.episode}`}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl">
          <div className="flex gap-4 p-4">
            {/* Thumbnail placeholder */}
            <div className="flex-shrink-0 w-24 h-16 md:w-32 md:h-20 bg-gray-800 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-600">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1 group-hover:text-red-400 transition-colors">
                Episode {progress.episode}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm mt-1">
                Tap to continue watching
              </p>
              
              {/* Progress bar */}
              <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                  style={{ width: '45%' }}
                />
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 flex items-center">
              <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
