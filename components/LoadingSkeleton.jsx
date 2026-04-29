// Loading skeleton components for better UX during content load

export function Logo3DSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-lg animate-pulse">
      <div className="w-16 h-16 bg-purple-500/20 rounded-full"></div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="border border-gray-800 rounded-lg p-6 animate-pulse">
      <div className="h-48 bg-gray-800 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-5/6"></div>
      <div className="flex gap-2 mt-4">
        <div className="h-6 bg-gray-800 rounded w-16"></div>
        <div className="h-6 bg-gray-800 rounded w-20"></div>
        <div className="h-6 bg-gray-800 rounded w-16"></div>
      </div>
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-800"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-800 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-800 rounded w-4/5 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-800 rounded w-20"></div>
          <div className="h-4 bg-gray-800 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function FormLoadingSpinner() {
  return (
    <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
