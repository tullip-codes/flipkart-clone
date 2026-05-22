import type { ShippingAddress, OrderStatus } from "@/types/order";

export function parseShippingAddress(raw: string): ShippingAddress {
  try {
    return JSON.parse(raw) as ShippingAddress;
  } catch {
    return { full_name: "", phone: "", address: "", city: "", state: "", pincode: "" };
  }
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending:   "Order Placed",
  confirmed: "Confirmed",
  shipped:   "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending:   "text-yellow-600 bg-yellow-50",
  confirmed: "text-blue-600 bg-blue-50",
  shipped:   "text-purple-600 bg-purple-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
};

export function formatOrderDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}