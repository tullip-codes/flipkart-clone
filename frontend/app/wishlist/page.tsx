/**
 * Wishlist page — /wishlist
 *
 * Protected: unauthenticated users are redirected to /auth/login.
 * Uses WishlistContext (loaded once in layout) — no redundant fetches.
 *
 * Layout:
 *  - Header row: "My Wishlist (N items)"
 *  - Loading skeleton
 *  - Empty state
 *  - WishlistGrid
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useWishlistContext } from "@/context/WishlistContext";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import EmptyWishlist from "@/components/wishlist/EmptyWishlist";

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, isLoading, error, removeItem } = useWishlistContext();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Auth still hydrating
  if (authLoading) {
    return <PageSkeleton />;
  }

  // Not authenticated (will redirect — show nothing to avoid flash)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="max-w-screen-xl mx-auto px-3 py-6">

      {/*  Page header  */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            My Wishlist
            {!isLoading && items.length > 0 && (
              <span className="ml-2 text-base font-normal text-gray-500">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
        </div>
      </div>

      {/*  Error state  */}
      {error && (
        <div className="mb-4 rounded bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/*  Loading skeleton  */}
      {isLoading && <WishlistSkeleton />}

      {/*  Empty state  */}
      {!isLoading && items.length === 0 && <EmptyWishlist />}

      {/*  Wishlist grid  */}
      {!isLoading && items.length > 0 && (
        <WishlistGrid items={items} onRemove={removeItem} />
      )}

    </main>
  );
}

//  Skeletons 

function PageSkeleton() {
  return (
    <main className="max-w-screen-xl mx-auto px-3 py-6">
      <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6" />
      <WishlistSkeleton />
    </main>
  );
}

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-sm border border-gray-100 overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-gray-200" />
          <div className="p-3 flex flex-col gap-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-1" />
            <div className="h-7 bg-gray-200 rounded mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}