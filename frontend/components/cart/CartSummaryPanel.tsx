// FILE: frontend/components/cart/CartSummaryPanel.tsx

"use client";

import { CartSummary } from "@/services/api";
import { ShoppingBag, Tag, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  summary: CartSummary;
}

function SummaryRow({
  label,
  value,
  className = "",
  icon,
}: {
  label: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`flex justify-between items-center text-sm ${className}`}>
      <span className="flex items-center gap-1.5 text-gray-600">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function CartSummaryPanel({ summary }: Props) {
  const router = useRouter();
  const { subtotal, total_discount, delivery_charge, grand_total, total_quantity } = summary;

  return (
    <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Price Details
        </h2>
      </div>

      <div className="p-4 space-y-3">
        <SummaryRow
          label={`Price (${total_quantity} item${total_quantity !== 1 ? "s" : ""})`}
          value={`₹${subtotal.toLocaleString("en-IN")}`}
          icon={<ShoppingBag size={14} />}
        />

        {total_discount > 0 && (
          <SummaryRow
            label="Discount"
            value={`−₹${total_discount.toLocaleString("en-IN")}`}
            className="text-green-600"
            icon={<Tag size={14} />}
          />
        )}

        <SummaryRow
          label="Delivery Charges"
          value={delivery_charge === 0 ? "FREE" : `₹${delivery_charge}`}
          className={delivery_charge === 0 ? "text-green-600" : ""}
          icon={<Truck size={14} />}
        />

        <div className="border-t border-dashed border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Amount</span>
            <span className="font-bold text-gray-900 text-lg">
              ₹{grand_total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {total_discount > 0 && (
          <p className="text-xs text-green-600 font-medium bg-green-50 rounded px-3 py-2 text-center">
            🎉 You will save ₹{total_discount.toLocaleString("en-IN")} on this order
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          onClick={() => router.push("/checkout")}
          className="w-full bg-[#FB641B] hover:bg-orange-600 text-white font-semibold py-3 rounded-sm text-sm transition-colors shadow-sm"
        >
          Place Order
        </button>
      </div>

      {/* Trust badges */}
      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
        <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
          <span>🔒</span>
          Safe and Secure Payments. Easy returns.
        </p>
      </div>
    </div>
  );
}