/**
 * WishlistContext — makes wishlist state available app-wide.
 *
 * Why a context (not just the hook)?
 * ProductCards across the homepage, listing page, and detail page
 * all need to know if a product is wishlisted. Without context,
 * every page would independently fetch wishlist IDs.
 * Context fetches once, shares everywhere.
 */

"use client";

import React, { createContext, useContext } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import type { WishlistItem } from "@/types/wishlist";

interface WishlistContextValue {
  items: WishlistItem[];
  wishlistedIds: Set<number>;
  isLoading: boolean;
  error: string | null;
  toggle: (productId: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const wishlist = useWishlist();

  return (
    <WishlistContext.Provider value={wishlist}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlistContext must be used inside <WishlistProvider>");
  return ctx;
}