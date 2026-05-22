"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProductCard, ProductListResponse, ProductFilters } from "@/types/product";

interface UseProductsState {
  data: ProductListResponse | null;
  products: ProductCard[];
  isLoading: boolean;
  error: string | null;
}

export function useProducts(filters: ProductFilters = {}) {
  const [state, setState] = useState<UseProductsState>({
    data: null,
    products: [],
    isLoading: true,
    error: null,
  });

  const fetchProducts = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { productApi } = await import("@/services/api");
      const data = await productApi.list(filters);
      setState({ data, products: data.items, isLoading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load products",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { ...state, refetch: fetchProducts };
}