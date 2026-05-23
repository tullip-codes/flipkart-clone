import Link from "next/link";
import Image from "next/image";
import type { ProductCard as ProductCardType } from "@/types/product";
import { formatPrice, formatRating, formatRatingCount } from "@/utils/formatters";
import WishlistButton from "@/components/wishlist/WishlistButton";  // ← add

interface ProductCardProps {
  product: ProductCardType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discount_percent > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-white rounded-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      {/*  Image  */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image_url ?? "/placeholder-product.png"}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />

        {/*  Wishlist heart — top-right overlay  */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <WishlistButton productId={product.id} size="sm" />    {/* ← add */}
        </div>

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

      {/*  Details — unchanged  */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {product.title}
        </p>

        {product.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
              {formatRating(product.rating)}
            </span>
            <span className="text-xs text-gray-400">{formatRatingCount(product.rating_count)}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500">Free delivery</p>
      </div>
    </Link>
  );
}