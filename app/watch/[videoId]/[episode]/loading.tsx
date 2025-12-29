export default function Loading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header Skeleton */}
      <header className="bg-black/90 border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="h-8 w-16 bg-gray-800 rounded animate-pulse"></div>
            <div className="flex-1 text-center">
              <div className="h-5 w-40 bg-gray-800 rounded mx-auto mb-1 animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-800 rounded mx-auto animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-9 h-9 bg-gray-800 rounded-lg animate-pulse"></div>
              <div className="w-9 h-9 bg-gray-800 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <main className="flex-1">
          {/* Video Player Skeleton */}
          <div className="w-full bg-black">
            <div className="max-w-6xl mx-auto">
              <div className="w-full aspect-video bg-gray-900 animate-pulse"></div>
            </div>
          </div>

          {/* Episode Info Skeleton */}
          <div className="px-4 py-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="hidden md:block w-28 aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-3">
                <div className="h-7 w-3/4 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-800 rounded animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-full bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Skeleton - Desktop */}
        <aside className="hidden lg:block w-80 xl:w-96 border-l border-gray-800/50 bg-gray-900/50">
          <div className="p-4 border-b border-gray-800/50">
            <div className="h-6 w-24 bg-gray-800 rounded animate-pulse"></div>
          </div>
          <div className="p-2 space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-3 w-32 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
