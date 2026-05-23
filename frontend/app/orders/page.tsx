"use client";

import { useRouter } from "next/navigation";
import { useOrders } from "@/hooks/useOrders";
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, formatOrderDate } from "@/utils/order";
import { Package, ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function OrdersPage() {
  const router = useRouter();
  const { orders, loading, error } = useOrders();

  if (loading) return (
    <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center">
      <div className="bg-white p-8 rounded text-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-screen bg-[#F1F3F6]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-sm border border-gray-200 flex flex-col items-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <ShoppingBag size={36} className="text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            Looks like You haven&apos;t placed any orders. Start shopping!
          </p>
          <button onClick={() => router.push("/products")}
            className="bg-[#2874F0] text-white font-semibold px-8 py-3 rounded-sm text-sm hover:bg-blue-700 transition-colors">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F3F6] py-4">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} className="text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-800">
            My Orders
            <span className="ml-2 text-sm font-normal text-gray-500">({orders.length})</span>
          </h1>
        </div>

        <div className="space-y-3">
          {orders.map(order => {
            const firstItem = order.items[0];
            return (
              <div key={order.id}
                onClick={() => router.push(`/orders/${order.order_number}`)}
                className="bg-white rounded-sm border border-gray-200 p-4 sm:p-5 cursor-pointer hover:shadow-sm transition-shadow">

                {/* Order header row */}
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <p className="font-mono text-xs text-gray-500">{order.order_number}</p>
                    <p className="text-xs text-gray-400">{formatOrderDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ORDER_STATUS_COLOR[order.status]}`}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>

                {/* First item preview */}
                {firstItem && (
                  <div className="flex gap-3 items-center">
                    <div className="relative w-14 h-14 flex-shrink-0 bg-gray-50 rounded border border-gray-100">
                      {firstItem.image_url
                        ? <Image src={firstItem.image_url} alt={firstItem.title} fill
                            className="object-contain p-1" sizes="56px" />
                        : <div className="w-full h-full bg-gray-100 rounded" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium line-clamp-1">{firstItem.title}</p>
                      {order.items.length > 1 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          +{order.items.length - 1} more item{order.items.length > 2 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                      ₹{order.grand_total.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}