/**
 * useWishlist — central wishlist state hook.
 *
 * Architecture decisions:
 * - Single source of truth for wishlist state across the entire app
 * - wishlistedIds: Set<number> — O(1) lookup for heart button states
 *   without passing the full list to every ProductCard
 * - Optimistic updates: UI updates instantly, reverts on API error
 * - Unauthenticated users: toggle redirects to /auth/login (no API call)
 *
 * Usage:
 *   const { wishlistedIds, toggle, isLoading } = useWishlist();
 *   const isWishlisted = wishlistedIds.has(product.id);
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { wishlistApi } from "@/services/wishlistApi";
import type { WishlistItem } from "@/types/wishlist";

interface UseWishlistReturn {
  items: WishlistItem[];
  wishlistedIds: Set<number>;
  isLoading: boolean;
  error: string | null;
  toggle: (productId: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useWishlist(): UseWishlistReturn {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load wishlist state on mount when authenticated
  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      setWishlistedIds(new Set());
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch IDs first (cheap) for heart button states
      const [wishlistData, ids] = await Promise.all([
        wishlistApi.getWishlist(),
        wishlistApi.getWishlistedIds(),
      ]);

      setItems(wishlistData.items);
      setWishlistedIds(new Set(ids));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (productId: number) => {
      // Redirect guests to login
      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      // Optimistic update — flip the state immediately
      const wasWishlisted = wishlistedIds.has(productId);
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        wasWishlisted ? next.delete(productId) : next.add(productId);
        return next;
      });

      try {
        const result = await wishlistApi.toggle(productId);

        // Sync with server response (source of truth)
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          result.wishlisted ? next.add(productId) : next.delete(productId);
          return next;
        });

        // Refresh full item list to keep items[] in sync
        if (!result.wishlisted) {
          setItems((prev) => prev.filter((i) => i.product_id !== productId));
        } else {
          // Added — refresh to get the full item object with product snapshot
          wishlistApi.getWishlist().then((data) => setItems(data.items)).catch(() => {});
        }
      } catch {
        // Revert optimistic update on failure
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          wasWishlisted ? next.add(productId) : next.delete(productId);
          return next;
        });
      }
    },
    [isAuthenticated, wishlistedIds, router]
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      // Find product_id before removal for ID set cleanup
      const item = items.find((i) => i.id === itemId);

      // Optimistic update
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      if (item) {
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.delete(item.product_id);
          return next;
        });
      }

      try {
        await wishlistApi.removeItem(itemId);
      } catch {
        // Revert on failure
        refresh();
      }
    },
    [items, refresh]
  );

  return { items, wishlistedIds, isLoading, error, toggle, removeItem, refresh };
}