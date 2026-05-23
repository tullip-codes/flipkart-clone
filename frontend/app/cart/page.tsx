"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import CartItemCard from "@/components/cart/CartItemCard";
import CartSummaryPanel from "@/components/cart/CartSummaryPanel";
import EmptyCart from "@/components/cart/EmptyCart";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function CartPage() {
  const { cart, loading, error, updateQuantity, removeItem } = useCart();
 
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleQuantityChange = async (item_id: number, qty: number) => {
    setUpdatingId(item_id);
    try {
      await updateQuantity(item_id, qty);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (item_id: number) => {
    setUpdatingId(item_id);
    try {
      await removeItem(item_id);
    } finally {
      setUpdatingId(null);
    }
  };

  //  Loading state 
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  //  Error state 
  if (error) {
    return (
      <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center">
        <div className="bg-white rounded-sm border border-red-200 p-8 text-center max-w-md">
          <p className="text-red-500 font-medium mb-2">Something went wrong</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  //  Empty cart 
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F1F3F6]">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <EmptyCart />
        </div>
      </div>
    );
  }

  //  Cart with items 
  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Page header */}
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart size={20} className="text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-800">
            My Cart
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({cart.item_count} item{cart.item_count !== 1 ? "s" : ""})
            </span>
          </h1>
        </div>

        {/* Two-column layout: cart items left, summary right */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/* Cart Items */}
          <div className="flex-1 w-full bg-white rounded-sm border border-gray-200 overflow-hidden">
            {/* Delivery message banner */}
            <div className="bg-blue-50 border-b border-blue-100 px-5 py-2.5 flex items-center gap-2">
              <span className="text-sm text-blue-700">
                {cart.delivery_charge === 0
                  ? "🎉 Your order is eligible for FREE Delivery!"
                  : `Add ₹${(500 - cart.subtotal).toFixed(0)} more for FREE Delivery`}
              </span>
            </div>

            {/* Items list */}
            {cart.items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
                isUpdating={updatingId === item.id}
              />
            ))}

            {/* Bottom bar with total (visible on mobile when summary is below) */}
            <div className="lg:hidden bg-white border-t border-gray-200 px-5 py-3 flex justify-between items-center sticky bottom-0">
              <div>
                <p className="text-xs text-gray-500">Grand Total</p>
                <p className="text-base font-bold text-gray-900">
                  ₹{cart.grand_total.toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => window.location.href = "/checkout"}
                className="bg-[#FB641B] hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-sm text-sm transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>

          {/* Sticky Summary Panel — hidden on mobile (handled above) */}
          <div className="hidden lg:block w-full lg:w-80 lg:sticky lg:top-4">
            <CartSummaryPanel summary={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}