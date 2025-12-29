import Link from "next/link";
import Image from "next/image";
import { Film } from "@/lib/api";

export default function FilmCard({ film }: { film: Film }) {
  return (
    <Link href={`/video/${film.bookId}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
        <div className="aspect-[2/3] relative">
          {(film.cover || film.coverWap) ? (
            <Image
              src={film.cover || film.coverWap!}
              alt={film.bookName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-bold text-lg line-clamp-2 mb-1">{film.bookName}</h3>
            <p className="text-sm text-gray-300 line-clamp-2">{film.introduction}</p>
            {film.playCount && (
              <p className="text-xs text-gray-400 mt-1">{film.playCount} views</p>
            )}
          </div>
        </div>
        {film.tags && film.tags.length > 0 && (
          <div className="absolute top-2 left-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              {film.tags[0]}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
