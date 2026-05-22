/**
 * ProductCardSkeleton — animated shimmer placeholder.
 *
 * Matches the exact layout of ProductCard so the UI doesn't jump
 * when real content replaces it.
 */
export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white animate-pulse">
      {/* Image area */}
      <div className="aspect-square bg-gray-200" />

      {/* Details area */}
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-1" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}