"use client";

import { useState } from "react";
import { ShoppingCart, Zap } from "lucide-react";
import type { ProductDetail } from "@/types/product";

interface ProductActionsProps {
  product: ProductDetail;
}

/**
 * ProductActions — client component owning CTA buttons.
 *
 * Isolated as a client component so the parent detail page remains
 * a server component (better SEO, faster FCP).
 *
 * Cart logic is intentionally a stub here — the Cart module
 * (next phase) will wire this up to a cart context/API.
 */
export default function ProductActions({ product }: ProductActionsProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    // TODO: wire to CartContext in Cart module phase
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    // TODO: navigate to checkout with this product pre-filled
    window.location.href = "/checkout";
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all ${
          addedToCart
            ? "bg-green-500 text-white"
            : isOutOfStock
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-amber-400 hover:bg-amber-500 text-gray-900"
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
      </button>

      <button
        onClick={handleBuyNow}
        disabled={isOutOfStock}
        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-colors ${
          isOutOfStock
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600 text-white"
        }`}
      >
        <Zap className="w-4 h-4" />
        Buy Now
      </button>
    </div>
  );
}