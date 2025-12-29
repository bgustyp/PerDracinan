export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black pb-20 md:pb-0">
      {/* Hero Backdrop Skeleton */}
      <div className="relative">
        <div className="absolute inset-0 h-[60vh] md:h-[70vh] bg-gray-800 animate-pulse"></div>
        
        {/* Navigation */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-4">
          <div className="max-w-7xl mx-auto">
            <div className="h-10 w-20 bg-gray-700/50 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Film Info Skeleton */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-32 md:pt-48">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              {/* Poster */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-40 md:w-52 aspect-[2/3] bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
              
              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="h-10 bg-gray-700 rounded-lg w-3/4 animate-pulse"></div>
                <div className="flex gap-3">
                  <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-7 w-20 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-7 w-20 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-7 w-20 bg-gray-700 rounded-full animate-pulse"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-12 w-36 bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-12 w-36 bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section Skeleton */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-32 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-5 w-24 bg-gray-800 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-700"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
