"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { orderApi } from "@/services/api";
import type { Order } from "@/types/order";
import { parseShippingAddress, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, formatOrderDate } from "@/utils/order";
import { CheckCircle, Package, MapPin, CreditCard, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const searchParams    = useSearchParams();
  const router          = useRouter();
  const isSuccess       = searchParams.get("success") === "1";

  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    orderApi.getOrder(orderNumber)
      .then(setOrder)
      .catch(e => setError(e instanceof Error ? e.message : "Order not found"))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return (
    <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-blue-500" />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center">
      <div className="bg-white p-8 rounded text-center">
        <p className="text-red-500 font-medium">{error ?? "Order not found"}</p>
        <button onClick={() => router.push("/orders")}
          className="mt-4 text-blue-600 text-sm hover:underline">
          View all orders
        </button>
      </div>
    </div>
  );

  const address = parseShippingAddress(order.shipping_address);

  return (
    <div className="min-h-screen bg-[#F1F3F6] py-4">
      <div className="max-w-3xl mx-auto px-4">

        {/* Success banner */}
        {isSuccess && (
          <div className="bg-green-500 text-white rounded-sm px-5 py-4 mb-4 flex items-center gap-3">
            <CheckCircle size={22} />
            <div>
              <p className="font-semibold">Order placed successfully!</p>
              <p className="text-sm text-green-100">
                Order ID: <span className="font-mono font-bold">{order.order_number}</span>
              </p>
            </div>
          </div>
        )}

        {/* Back */}
        <button onClick={() => router.push("/orders")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft size={14} /> My Orders
        </button>

        {/* Order header */}
        <div className="bg-white rounded-sm border border-gray-200 px-5 py-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
            <p className="font-mono font-bold text-gray-800">{order.order_number}</p>
            <p className="text-xs text-gray-400 mt-0.5">Placed on {formatOrderDate(order.created_at)}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full self-start sm:self-center ${ORDER_STATUS_COLOR[order.status]}`}>
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        </div>

        <div className="space-y-4">
          {/* Items */}
          <div className="bg-white rounded-sm border border-gray-200">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <Package size={15} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-gray-700">
                Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4 px-5 py-4">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded border border-gray-100">
                    {item.image_url
                      ? <Image src={item.image_url} alt={item.title} fill
                          className="object-contain p-1" sizes="64px" />
                      : <div className="w-full h-full bg-gray-100 rounded" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium line-clamp-2">{item.title}</p>
                    {item.brand && <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>}
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{item.total_price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₹{item.unit_price.toLocaleString("en-IN")} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Address */}
            <div className="bg-white rounded-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={15} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-700">Delivery Address</h3>
              </div>
              <p className="text-sm font-semibold text-gray-800">{address.full_name}</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {address.address}, {address.city},<br />
                {address.state} – {address.pincode}
              </p>
              <p className="text-sm text-gray-500 mt-1">📞 {address.phone}</p>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-sm border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={15} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-700">Price Details</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {order.total_discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>−₹{order.total_discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={order.delivery_charge === 0 ? "text-green-600" : ""}>
                    {order.delivery_charge === 0 ? "FREE" : `₹${order.delivery_charge}`}
                  </span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span>₹{order.grand_total.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-gray-400 pt-1">
                  Payment: {order.payment_method.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button onClick={() => router.push("/products")}
            className="flex-1 bg-[#2874F0] hover:bg-blue-700 text-white font-semibold py-3 rounded-sm text-sm transition-colors">
            Continue Shopping
          </button>
          <button onClick={() => router.push("/orders")}
            className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-sm text-sm transition-colors">
            My Orders
          </button>
        </div>

      </div>
    </div>
  );
}