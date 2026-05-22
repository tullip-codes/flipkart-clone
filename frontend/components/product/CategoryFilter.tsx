"use client";

import type { Category } from "@/types/product";

interface CategoryFilterProps {
  categories: Category[];
  selectedId: number | null;
  onChange: (id: number | null) => void;
  isLoading?: boolean;
}

/**
 * CategoryFilter — horizontally scrollable category pills.
 *
 * "All" option resets the filter (null category_id).
 * Designed to sit above the product grid on both desktop and mobile.
 */
export default function CategoryFilter({
  categories,
  selectedId,
  onChange,
  isLoading = false,
}: CategoryFilterProps) {
  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* All Products pill */}
      <button
        onClick={() => onChange(null)}
        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          selectedId === null
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
        }`}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            selectedId === cat.id
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          {cat.icon_url && <span>{cat.icon_url}</span>}
          {cat.name}
        </button>
      ))}
    </div>
  );
}