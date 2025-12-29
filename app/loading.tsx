export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header Skeleton */}
      <div className="h-16 bg-gray-900/50 border-b border-gray-800"></div>

      <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Carousel Skeleton */}
          <div className="relative w-full h-[70vh] min-h-[500px] max-h-[700px] rounded-2xl mb-8 bg-gray-800 animate-pulse">
            <div className="absolute bottom-16 left-6 md:left-12 lg:left-16 flex gap-6 md:gap-10">
              <div className="hidden md:block w-[180px] h-[270px] bg-gray-700 rounded-xl"></div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
                </div>
                <div className="h-12 w-80 bg-gray-700 rounded-lg"></div>
                <div className="h-4 w-48 bg-gray-700 rounded"></div>
                <div className="h-4 w-96 bg-gray-700 rounded"></div>
                <div className="flex gap-3 pt-4">
                  <div className="h-12 w-32 bg-gray-700 rounded-lg"></div>
                  <div className="h-12 w-32 bg-gray-700 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Film Rows Skeleton */}
          {[1, 2, 3].map((row) => (
            <div key={row} className="mb-10">
              <div className="h-7 w-48 bg-gray-800 rounded mb-4 animate-pulse"></div>
              <div className="flex gap-3 md:gap-4 overflow-hidden">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[140px] md:w-[160px] lg:w-[180px]">
                    <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
                    <div className="mt-2 space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
