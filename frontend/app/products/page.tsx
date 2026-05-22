"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductGrid from "@/components/product/ProductGrid";
import CategoryFilter from "@/components/product/CategoryFilter";
import SearchBar from "@/components/common/SearchBar";
import Pagination from "@/components/common/Pagination";
import SortDropdown from "@/components/common/SortDropdown";
import type { ProductFilters, SortOption } from "@/types/product";

/**
 * ProductsPage — main listing page.
 *
 * Architecture notes:
 * - All filter state lives in this component and is passed down as props.
 * - useSearchParams lets users bookmark/share filtered URLs.
 * - useProducts handles the actual API call with debounced filters.
 */
export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialise state from URL search params (for shareable URLs)
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categoryId, setCategoryId] = useState<number | null>(
    searchParams.get("category_id") ? Number(searchParams.get("category_id")) : null
  );
  const [sortBy, setSortBy] = useState<SortOption>("created_at");
  const [page, setPage] = useState(1);

  const { categories, isLoading: categoriesLoading } = useCategories();

  // Memoised so useProducts doesn't re-fetch on unrelated renders
  const filters: ProductFilters = useMemo(
    () => ({
      search: search || undefined,
      category_id: categoryId ?? undefined,
      sort_by: sortBy,
      order: "desc",
      page,
      page_size: 20,
    }),
    [search, categoryId, sortBy, page]
  );

  const { products, data, isLoading, error } = useProducts(filters);

  // Reset to page 1 on filter change
  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleCategory = useCallback((id: number | null) => {
    setCategoryId(id);
    setPage(1);
  }, []);

  const handleSort = useCallback((sort: SortOption) => {
    setSortBy(sort);
    setPage(1);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4 py-4">

        {/* Filters toolbar  */}
        <div className="bg-white rounded-sm shadow-sm px-4 py-3 mb-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <SearchBar value={search} onChange={handleSearch} />

          {/* Sort */}
          <SortDropdown value={sortBy} onChange={handleSort} />
        </div>

        {/* Category pills  */}
        <div className="bg-white rounded-sm shadow-sm px-4 py-3 mb-3">
          <CategoryFilter
            categories={categories}
            selectedId={categoryId}
            onChange={handleCategory}
            isLoading={categoriesLoading}
          />
        </div>

        {/* Results count  */}
        {!isLoading && data && (
          <p className="text-xs text-gray-500 mb-2 px-1">
            {data.total.toLocaleString("en-IN")} products found
            {search && ` for "${search}"`}
          </p>
        )}

        {/* Error state  */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-center text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Product grid  */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            emptyMessage={
              search
                ? `No products matching "${search}"`
                : "No products in this category yet."
            }
          />
        </div>

        {/* Pagination  */}
        {data && data.total_pages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={data.total_pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </main>
  );
}