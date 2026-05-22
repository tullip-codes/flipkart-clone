import Link from "next/link";
import Image from "next/image";
import type { ProductCard as ProductCardType } from "@/types/product";
import { formatPrice, formatRating, formatRatingCount } from "@/utils/formatters";

interface ProductCardProps {
  product: ProductCardType;
}

/**
 * ProductCard — self-contained, reusable product tile.
 *
 * Design decisions:
 * - Uses Next/Image for optimised image loading
 * - Wraps in Link for native navigation (no JS needed)
 * - Flipkart-inspired: white card, blue accents, green rating badge
 */
export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discount_percent > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      {/* ── Image ──────────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image_url ?? "/placeholder-product.png"}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-sm">
            {product.discount_percent}% off
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500">Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Details ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        {/* Title */}
        <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {product.title}
        </p>

        {/* Rating badge */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
              {formatRating(product.rating)}
            </span>
            <span className="text-xs text-gray-400">{formatRatingCount(product.rating_count)}</span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        {/* Free delivery label — always present for Flipkart feel */}
        <p className="text-xs text-gray-500">Free delivery</p>
      </div>
    </Link>
  );
}