"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductGrid from "@/components/product/ProductGrid";
import CategoryFilter from "@/components/product/CategoryFilter";
import SearchBar from "@/components/common/SearchBar";
import Pagination from "@/components/common/Pagination";
import SortDropdown, { type SortValue } from "@/components/common/SortDropdown";
import type { ProductFilters } from "@/types/product";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const [search, setSearch]         = useState(searchParams.get("search") ?? "");
  const [categoryId, setCategoryId] = useState<number | null>(
    searchParams.get("category_id") ? Number(searchParams.get("category_id")) : null
  );
  const [sortBy, setSortBy] = useState<SortValue["sort_by"]>("created_at");
  const [order, setOrder]   = useState<"asc" | "desc">("desc");
  const [page, setPage]     = useState(1);

  // Re-sync when URL changes (navbar category clicks)
  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setCategoryId(
      searchParams.get("category_id") ? Number(searchParams.get("category_id")) : null
    );
    setPage(1);
  }, [searchParams]);

  const { categories, isLoading: categoriesLoading } = useCategories();

  const filters: ProductFilters = useMemo(
    () => ({
      search:      search || undefined,
      category_id: categoryId ?? undefined,
      sort_by:     sortBy,
      order,
      page,
      page_size:   20,
    }),
    [search, categoryId, sortBy, order, page]
  );

  const { products, data, isLoading, error } = useProducts(filters);

  const handleSearch   = useCallback((val: string) => { setSearch(val); setPage(1); }, []);
  const handleCategory = useCallback((id: number | null) => { setCategoryId(id); setPage(1); }, []);
  const handleSort     = useCallback(({ sort_by, order }: SortValue) => {
    setSortBy(sort_by);
    setOrder(order);
    setPage(1);
  }, []);

  return (
    <main className="min-h-screen bg-[#F1F3F6]">
      <div className="max-w-screen-xl mx-auto px-2 sm:px-4 py-4">

        {/* Filter bar */}
<div className="bg-white shadow-sm mb-3 border-t-4 border-[#2874F0]">
  <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
      Filter &amp; Sort
    </h2>
    <div className="flex items-center gap-3">
      <SearchBar value={search} onChange={handleSearch} />
      <SortDropdown sortBy={sortBy} order={order} onChange={handleSort} />
    </div>
  </div>
  <div className="px-4 py-2.5">
    <CategoryFilter
      categories={categories}
      selectedId={categoryId}
      onChange={handleCategory}
      isLoading={categoriesLoading}
    />
  </div>
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
          <div className="bg-red-50 border border-red-200 rounded p-4 text-center text-red-600 text-sm mb-3">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="bg-white shadow-sm overflow-hidden">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            emptyMessage={
              search ? `No products matching "${search}"` : "No products in this category yet."
            }
          />
        </div>

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="mt-4">
            <Pagination currentPage={page} totalPages={data.total_pages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </main>
  );
}