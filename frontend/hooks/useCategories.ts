"use client";

import { useState, useEffect } from "react";
import type { Category } from "@/types/product";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic import avoids SSR issues with the API module
    import("@/services/api")
      .then(({ categoryApi }) => categoryApi.list())
      .then(setCategories)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading, error };
}