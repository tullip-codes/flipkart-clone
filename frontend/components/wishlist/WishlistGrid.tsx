/**
 * WishlistGrid — renders the grid of wishlisted products.
 *
 * Behaviour:
 * - "Add to Cart" calls cartApi directly, then auto-removes from wishlist
 * - Remove (×) button removes from wishlist only
 * - Per-card loading state for cart button feedback
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Check } from "lucide-react";

import type { WishlistItem } from "@/types/wishlist";
import { formatPrice, formatRating, formatRatingCount } from "@/utils/formatters";
import { cartApi } from "@/services/api";

interface WishlistGridProps {
  items: WishlistItem[];
  onRemove: (itemId: number) => void;
}

export default function WishlistGrid({ items, onRemove }: WishlistGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {items.map((item) => (
        <WishlistCard key={item.id} item={item} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ── Individual wishlist card ───────────────────────────────────────────────────

type AddState = "idle" | "loading" | "added" | "error";

function WishlistCard({
  item,
  onRemove,
}: {
  item: WishlistItem;
  onRemove: (itemId: number) => void;
}) {
  const { product } = item;
  const hasDiscount = product.discount_percent > 0;
  const isOutOfStock = product.stock === 0;

  const [addState, setAddState] = useState<AddState>("idle");

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || addState === "loading") return;

    setAddState("loading");
    try {
      await cartApi.addToCart(product.id, 1);
      setAddState("added");
      // Auto-remove from wishlist after cart add — standard ecommerce behaviour.
      // 800ms delay so user sees the "Added!" confirmation before card disappears.
      setTimeout(() => onRemove(item.id), 800);
    } catch {
      setAddState("error");
      setTimeout(() => setAddState("idle"), 2000);
    }
  }

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onRemove(item.id);
  }

  const cartButtonContent = {
    idle: {
      icon: <ShoppingCart className="w-3.5 h-3.5" />,
      label: "Add to Cart",
      className: "bg-[#FF9F00] hover:bg-[#f09000] text-white",
    },
    loading: {
      icon: (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
      ),
      label: "Adding…",
      className: "bg-[#FF9F00] text-white opacity-80 cursor-not-allowed",
    },
    added: {
      icon: <Check className="w-3.5 h-3.5" />,
      label: "Added!",
      className: "bg-green-600 text-white",
    },
    error: {
      icon: <ShoppingCart className="w-3.5 h-3.5" />,
      label: "Try again",
      className: "bg-red-500 text-white",
    },
  }[addState];

  return (
    <div className="relative group bg-white rounded-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col">

      {/* ── Remove (×) button — top-right ────────────────────────────────── */}
      <button
        onClick={handleRemove}
        aria-label="Remove from wishlist"
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white shadow
          border border-gray-100 flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-opacity
          hover:bg-red-50 hover:border-red-200"
      >
        <X className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
      </button>

      {/* ── Product image ─────────────────────────────────────────────────── */}
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={product.image_url ?? "/placeholder-product.png"}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-sm">
              {product.discount_percent}% off
            </span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* ── Product details ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <Link href={`/products/${product.id}`}>
          <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug hover:text-blue-600 transition-colors">
            {product.title}
          </p>
        </Link>

        {product.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
              {formatRating(product.rating)}
            </span>
            <span className="text-xs text-gray-400">
              {formatRatingCount(product.rating_count)}
            </span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        {/* ── Add to Cart button ────────────────────────────────────────────── */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || addState === "loading"}
          className={`mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold
            py-2 rounded-sm transition-colors w-full
            ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : cartButtonContent.className
            }`}
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : (
            <>
              {cartButtonContent.icon}
              {cartButtonContent.label}
            </>
          )}
        </button>
      </div>
    </div>
  );
}