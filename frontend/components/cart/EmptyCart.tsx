"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmptyCart() {
  const router = useRouter();
  return (
    <div className="bg-white rounded-sm border border-gray-200 flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-5">
        <ShoppingCart size={40} className="text-blue-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty!</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        Looks like you haven't added anything to your cart yet. Explore our products and find something you'll love.
      </p>
      <button
        onClick={() => router.push("/products")}
        className="bg-[#2874F0] hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-sm text-sm transition-colors"
      >
        Shop Now
      </button>
    </div>
  );
}