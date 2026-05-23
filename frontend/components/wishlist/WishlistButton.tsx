/**
 * WishlistButton — heart toggle button.
 *
 * Used in two places:
 *  1. Overlaid on ProductCard (position absolute, top-right)
 *  2. On the WishlistPage as a remove button
 *
 * Consumes WishlistContext — no prop drilling needed.
 * Unauthenticated click → redirects to /auth/login via the hook.
 */

"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlistContext } from "@/context/WishlistContext";

interface WishlistButtonProps {
  productId: number;
  /** Size variant — "sm" for card overlay, "md" for detail page */
  size?: "sm" | "md";
  className?: string;
}

export default function WishlistButton({
  productId,
  size = "sm",
  className = "",
}: WishlistButtonProps) {
  const { wishlistedIds, toggle } = useWishlistContext();
  const [isPending, setIsPending] = useState(false);

  const isWishlisted = wishlistedIds.has(productId);

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const btnSize  = size === "sm" ? "w-8 h-8"  : "w-10 h-10";

  async function handleClick(e: React.MouseEvent) {
    // Prevent the parent <Link> from navigating
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;
    setIsPending(true);

    try {
      await toggle(productId);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`
        flex items-center justify-center rounded-full bg-white shadow-md
        border border-gray-100 transition-all
        hover:scale-110 active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed
        ${btnSize} ${className}
      `}
    >
      <Heart
        className={`${iconSize} transition-colors ${
          isWishlisted
            ? "fill-red-500 stroke-red-500"
            : "fill-none stroke-gray-400 hover:stroke-red-400"
        }`}
      />
    </button>
  );
}