/**
 * EmptyWishlist — shown when the user's wishlist has no items.
 * Flipkart-inspired: centered illustration + CTA to browse products.
 */

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

export default function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      {/* Icon stack */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
          <Heart className="w-12 h-12 text-red-300 fill-red-100" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center border-2 border-white">
          <ShoppingBag className="w-4 h-4 text-[#2874F0]" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Your wishlist is empty
      </h2>
      <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
        Save your favourite items here so you can easily find them later.
      </p>

      <Link
        href="/products"
        className="inline-flex items-center gap-2 bg-[#2874F0] hover:bg-blue-700
          text-white text-sm font-semibold px-8 py-3 rounded-sm transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}