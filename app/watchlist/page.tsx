"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { Film } from "@/lib/api";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<Film[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    if (stored) {
      setWatchlist(JSON.parse(stored));
    }
  }, []);

  const removeFromWatchlist = (bookId: string) => {
    const updated = watchlist.filter((film) => film.bookId !== bookId);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black pb-20 md:pb-0">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-gray-400">{watchlist.length} {watchlist.length === 1 ? 'drama' : 'dramas'} saved</p>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto">
              Start adding dramas you want to watch later
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Browse Dramas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((film) => (
              <div key={film.bookId} className="group relative">
                <Link href={`/video/${film.bookId}`}>
                  <div className="relative overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
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
                      
                      {/* Episode Count */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                          {film.chapterCount} Ep
                        </span>
                      </div>
                    </div>

                    <div className="p-2 bg-gray-900">
                      <h3 className="text-white text-sm font-medium line-clamp-1">{film.bookName}</h3>
                      {film.tags && film.tags.length > 0 && (
                        <p className="text-gray-500 text-xs mt-0.5">{film.tags[0]}</p>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWatchlist(film.bookId);
                  }}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                  title="Remove from watchlist"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
