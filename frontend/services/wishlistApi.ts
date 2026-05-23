/**
 * Wishlist API layer.
 *
 * All calls attach Bearer token automatically via getStoredToken —
 * same pattern as authApi.ts. No duplication of apiFetch logic.
 */

import { getStoredToken } from "@/services/authApi";
import type { WishlistResponse, WishlistToggleResponse } from "@/types/wishlist";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

async function wishlistFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getStoredToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail ?? `Error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const wishlistApi = {
  /** Full wishlist with product snapshots */
  getWishlist: (): Promise<WishlistResponse> =>
    wishlistFetch<WishlistResponse>("/wishlist"),

  /**
   * Toggle add/remove. Returns { wishlisted: boolean }.
   * Frontend updates local state based on the response — no refetch needed.
   */
  toggle: (product_id: number): Promise<WishlistToggleResponse> =>
    wishlistFetch<WishlistToggleResponse>("/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ product_id }),
    }),

  /** Remove by wishlist item id (used on the wishlist page) */
  removeItem: (item_id: number): Promise<void> =>
    wishlistFetch<void>(`/wishlist/${item_id}`, { method: "DELETE" }),

  /** Flat list of wishlisted product_ids — used to hydrate heart button states */
  getWishlistedIds: (): Promise<number[]> =>
    wishlistFetch<number[]>("/wishlist/ids"),
};