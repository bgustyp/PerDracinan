'use client';

import { useState, useEffect } from 'react';
import { Film, FilmDetail } from "@/lib/api";

export default function AddToWatchlistButton({ film }: { film: Film | FilmDetail }) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    if (stored) {
      const watchlist = JSON.parse(stored);
      setIsInWatchlist(watchlist.some((f: Film) => f.bookId === film.bookId));
    }
  }, [film.bookId]);

  const toggleWatchlist = () => {
    const stored = localStorage.getItem("watchlist");
    const watchlist = stored ? JSON.parse(stored) : [];
    
    if (isInWatchlist) {
      const updated = watchlist.filter((f: Film) => f.bookId !== film.bookId);
      localStorage.setItem("watchlist", JSON.stringify(updated));
      setIsInWatchlist(false);
    } else {
      watchlist.push(film);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      setIsInWatchlist(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={toggleWatchlist}
      className={`flex items-center gap-2 font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
        isInWatchlist
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-gray-600/80 hover:bg-gray-500/80 text-white'
      } ${isAnimating ? 'scale-110' : ''}`}
    >
      {isInWatchlist ? (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          In Watchlist
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add to List
        </>
      )}
    </button>
  );
}
