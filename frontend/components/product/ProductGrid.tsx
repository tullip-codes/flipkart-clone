import type { ProductCard } from "@/types/product";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductGridProps {
  products: ProductCard[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
}

/**
 * ProductGrid — renders a responsive CSS grid of product cards.
 *
 * Handles three states:
 *  1. Loading  → skeleton placeholders
 *  2. Empty    → contextual empty state message
 *  3. Loaded   → actual product cards
 */
export default function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  emptyMessage = "No products found.",
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-gray-200">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🛍️</div>
        <p className="text-lg font-medium text-gray-600">{emptyMessage}</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-gray-200">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}