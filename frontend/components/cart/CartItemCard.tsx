"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/services/api";

interface Props {
  item: CartItem;
  onQuantityChange: (item_id: number, qty: number) => void;
  onRemove: (item_id: number) => void;
  isUpdating?: boolean;
}

export default function CartItemCard({ item, onQuantityChange, onRemove, isUpdating }: Props) {
  const { product, quantity, id } = item;
  const savings = product.original_price
    ? (product.original_price - product.price) * quantity
    : 0;

  return (
    <div className={`bg-white p-4 sm:p-5 border-b border-gray-100 transition-opacity ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-gray-50 rounded-sm border border-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-contain p-1"
              sizes="112px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
              No image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base text-gray-800 font-medium leading-snug line-clamp-2">
            {product.title}
          </p>
          {product.brand && (
            <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>
          )}

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              ₹{(product.price * quantity).toLocaleString("en-IN")}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{(product.original_price * quantity).toLocaleString("en-IN")}
              </span>
            )}
            {savings > 0 && (
              <span className="text-xs font-medium text-green-600">
                Save ₹{savings.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Delivery tag */}
          <p className="text-xs text-gray-500 mt-1.5">
            <span className="text-green-600 font-medium">Free delivery</span>
          </p>

          {/* Quantity Controls + Remove */}
          <div className="flex items-center gap-3 mt-3">
            {/* Quantity stepper */}
            <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
              <button
                onClick={() => quantity > 1 && onQuantityChange(id, quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-blue-600 font-bold text-lg hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold text-gray-800 border-x border-gray-300 select-none">
                {quantity}
              </span>
              <button
                onClick={() => quantity < Math.min(10, product.stock) && onQuantityChange(id, quantity + 1)}
                disabled={quantity >= 10 || quantity >= product.stock}
                className="w-8 h-8 flex items-center justify-center text-blue-600 font-bold text-lg hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => onRemove(id)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-2 py-1 rounded"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}