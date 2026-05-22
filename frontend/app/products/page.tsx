"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductGrid from "@/components/product/ProductGrid";
import CategoryFilter from "@/components/product/CategoryFilter";
import SearchBar from "@/components/common/SearchBar";
import Pagination from "@/components/common/Pagination";
import SortDropdown from "@/components/common/SortDropdown";
import type { ProductFilters, SortOption } from "@/types/product";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const [search, setSearch]       = useState(searchParams.get("search") ?? "");
  const [categoryId, setCategoryId] = useState<number | null>(
    searchParams.get("category_id") ? Number(searchParams.get("category_id")) : null
  );
  const [sortBy, setSortBy] = useState<SortOption>("created_at");
  const [page, setPage]     = useState(1);

  // ── KEY FIX: re-sync local state whenever the URL changes ─────────────────
  // When the user clicks a navbar category link, Next.js updates searchParams
  // but the component state doesn't update automatically (it's initialised once).
  // This effect keeps state in sync with the URL on every navigation.
  useEffect(() => {
    const urlSearch     = searchParams.get("search") ?? "";
    const urlCategoryId = searchParams.get("category_id")
      ? Number(searchParams.get("category_id"))
      : null;

    setSearch(urlSearch);
    setCategoryId(urlCategoryId);
    setPage(1); // always reset to page 1 on URL-driven navigation
  }, [searchParams]);

  const { categories, isLoading: categoriesLoading } = useCategories();

  const filters: ProductFilters = useMemo(
    () => ({
      search:      search || undefined,
      category_id: categoryId ?? undefined,
      sort_by:     sortBy,
      order:       "desc",
      page,
      page_size:   20,
    }),
    [search, categoryId, sortBy, page]
  );

  const { products, data, isLoading, error } = useProducts(filters);

  // These handlers are for the in-page filter controls (SearchBar, CategoryFilter)
  // They also update the URL so it stays shareable
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
    <main className="min-h-screen bg-[#F1F3F6]">
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4 py-4">

        {/* Search + Sort toolbar */}
        <div className="bg-white rounded-sm shadow-sm px-4 py-3 mb-3 flex flex-col sm:flex-row gap-3">
          <SearchBar value={search} onChange={handleSearch} />
          <SortDropdown value={sortBy} onChange={handleSort} />
        </div>

        {/* Category pills */}
        <div className="bg-white rounded-sm shadow-sm px-4 py-3 mb-3">
          <CategoryFilter
            categories={categories}
            selectedId={categoryId}
            onChange={handleCategory}
            isLoading={categoriesLoading}
          />
        </div>

        {/* Results count */}
        {!isLoading && data && (
          <p className="text-xs text-gray-500 mb-2 px-1">
            {data.total.toLocaleString("en-IN")} products found
            {search && ` for "${search}"`}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-center text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Grid */}
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

        {/* Pagination */}
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