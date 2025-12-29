export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black pb-20 md:pb-0">
      {/* Header Skeleton */}
      <div className="h-16 bg-gray-900/50 border-b border-gray-800"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-pulse">
          <div className="h-6 bg-gray-800 rounded w-24 mb-4"></div>
          <div className="h-10 bg-gray-800 rounded w-48 mb-2"></div>
          <div className="h-5 bg-gray-800 rounded w-36"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-800 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
