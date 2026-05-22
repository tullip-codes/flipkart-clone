"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, CheckCircle, Loader2 } from "lucide-react";
import type { ProductDetail } from "@/types/product";
import { cartApi } from "@/services/api";

interface ProductActionsProps {
  product: ProductDetail;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [cartState, setCartState] = useState<"idle" | "loading" | "added">("idle");
  const [error, setError] = useState<string | null>(null);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    if (cartState === "loading" || cartState === "added") return;
    setError(null);
    setCartState("loading");

    try {
      await cartApi.addToCart(product.id, 1);
      setCartState("added"); // stays "added" permanently — no setTimeout reset
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add to cart");
      setCartState("idle");
    }
  };

  const handleBuyNow = async () => {
    setError(null);
    try {
      await cartApi.addToCart(product.id, 1);
      router.push("/checkout");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Add to Cart / Go to Cart */}
        <button
          onClick={cartState === "added" ? () => router.push("/cart") : handleAddToCart}
          disabled={isOutOfStock || cartState === "loading"}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all ${
            cartState === "added"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : isOutOfStock || cartState === "loading"
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-amber-400 hover:bg-amber-500 text-gray-900"
          }`}
        >
          {cartState === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : cartState === "added" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
          {cartState === "loading"
            ? "Adding..."
            : cartState === "added"
            ? "Go to Cart"
            : "Add to Cart"}
        </button>

        {/* Buy Now */}
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

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}