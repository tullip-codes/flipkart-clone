"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { orderApi } from "@/services/api";
import type { ShippingAddress, PaymentMethod } from "@/types/order";
import { Loader2, MapPin, CreditCard, ShieldCheck, Tag, Truck } from "lucide-react";
import Image from "next/image";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: "cod",  label: "Cash on Delivery", icon: "💵" },
  { value: "upi",  label: "UPI",              icon: "📱" },
  { value: "card", label: "Credit / Debit Card", icon: "💳" },
];

const INITIAL_ADDRESS: ShippingAddress = {
  full_name: "", phone: "", address: "", city: "", state: "", pincode: "",
};

export default function CheckoutPage() {
  const router  = useRouter();
  const { cart, loading: cartLoading, refresh } = useCart();

  const [address, setAddress] = useState<ShippingAddress>(INITIAL_ADDRESS);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);
  const [errors,  setErrors]  = useState<Partial<ShippingAddress>>({});
  const [orderError, setOrderError] = useState<string | null>(null);  // ← replaces alert

  //  Validation 
  function validate(): boolean {
    const e: Partial<ShippingAddress> = {};
    if (!address.full_name.trim())        e.full_name = "Name is required";
    if (!/^\d{10}$/.test(address.phone))  e.phone     = "Enter a valid 10-digit number";
    if (!address.address.trim())          e.address   = "Address is required";
    if (!address.city.trim())             e.city      = "City is required";
    if (!address.state.trim())            e.state     = "State is required";
    if (!/^\d{6}$/.test(address.pincode)) e.pincode   = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    setOrderError(null);
    try {
      const order = await orderApi.placeOrder({
        shipping_address: address,
        payment_method:   payment,
      });
      await refresh();
      router.push(`/orders/${order.order_number}?success=1`);
    } catch (e: unknown) {
      // Properly extract error message — handles Error objects, API error shapes, and unknowns
      let message = "Failed to place order. Please try again.";
      if (e instanceof Error) {
        message = e.message;
      } else if (typeof e === "object" && e !== null && "detail" in e) {
        const detail = (e as { detail: unknown }).detail;
        message = typeof detail === "string" ? detail : JSON.stringify(detail);
      }
      setOrderError(message);
    } finally {
      setPlacing(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center">
        <div className="bg-white p-10 rounded text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-[#2874F0] text-white px-6 py-2 rounded text-sm font-semibold"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F3F6] py-4">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-lg font-semibold text-gray-800 mb-4">Checkout</h1>

        {/*  Order error banner — replaces browser alert  */}
        {orderError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-sm px-4 py-3 flex items-start gap-3">
            <span className="text-red-500 text-lg leading-none mt-0.5">⚠</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">Order Failed</p>
              <p className="text-sm text-red-600 mt-0.5">{orderError}</p>
            </div>
            <button
              onClick={() => setOrderError(null)}
              className="text-red-400 hover:text-red-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/*  Left column  */}
          <div className="flex-1 w-full space-y-4">

            {/* Shipping Address */}
            <div className="bg-white rounded-sm border border-gray-200">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
                <MapPin size={16} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Delivery Address
                </h2>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" error={errors.full_name}>
                  <input
                    value={address.full_name}
                    onChange={e => setAddress(a => ({ ...a, full_name: e.target.value }))}
                    placeholder="Harshita Yadav"
                    className={input(errors.full_name)}
                  />
                </Field>
                <Field label="Phone Number" error={errors.phone}>
                  <input
                    value={address.phone}
                    maxLength={10}
                    onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    className={input(errors.phone)}
                  />
                </Field>
                <Field
                  label="Address (House No, Street)"
                  error={errors.address}
                  className="sm:col-span-2"
                >
                  <textarea
                    value={address.address}
                    rows={2}
                    onChange={e => setAddress(a => ({ ...a, address: e.target.value }))}
                    placeholder="Flat / House No, Building, Street, Area"
                    className={input(errors.address) + " resize-none"}
                  />
                </Field>
                <Field label="City" error={errors.city}>
                  <input
                    value={address.city}
                    onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                    placeholder="e.g. Kota"
                    className={input(errors.city)}
                  />
                </Field>
                <Field label="State" error={errors.state}>
                  <input
                    value={address.state}
                    onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                    placeholder="e.g. Rajasthan"
                    className={input(errors.state)}
                  />
                </Field>
                <Field label="Pincode" error={errors.pincode}>
                  <input
                    value={address.pincode}
                    maxLength={6}
                    onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))}
                    placeholder="6-digit pincode"
                    className={input(errors.pincode)}
                  />
                </Field>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-sm border border-gray-200">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
                <CreditCard size={16} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Payment Method
                </h2>
              </div>
              <div className="p-5 space-y-3">
                {PAYMENT_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-colors ${
                      payment === opt.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={payment === opt.value}
                      onChange={() => setPayment(opt.value)}
                      className="accent-blue-600"
                    />
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                    {opt.value === "cod" && (
                      <span className="ml-auto text-xs text-green-600 font-medium">
                        Recommended
                      </span>
                    )}
                  </label>
                ))}
                <p className="text-xs text-gray-400 flex items-center gap-1 pt-1">
                  <ShieldCheck size={12} /> Secure & encrypted checkout
                </p>
              </div>
            </div>
          </div>

          {/* ── Right column — Order Summary ───────────────────────────────── */}
          <div className="w-full lg:w-80 lg:sticky lg:top-4 space-y-4">
            <div className="bg-white rounded-sm border border-gray-200">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order Summary
                </h2>
              </div>

              {/* Items list */}
              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-3 px-4 py-3">
                    <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded border border-gray-100">
                      {item.product.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.title}
                          fill
                          className="object-contain p-0.5"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 line-clamp-2 leading-snug">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="p-4 space-y-2 border-t border-gray-100">
                <SummaryRow
                  label={`Price (${cart.total_quantity} items)`}
                  value={`₹${cart.subtotal.toLocaleString("en-IN")}`}
                  icon={<Tag size={13} />}
                />
                {cart.total_discount > 0 && (
                  <SummaryRow
                    label="Discount"
                    value={`−₹${cart.total_discount.toLocaleString("en-IN")}`}
                    className="text-green-600"
                    icon={<Tag size={13} />}
                  />
                )}
                <SummaryRow
                  label="Delivery"
                  value={cart.delivery_charge === 0 ? "FREE" : `₹${cart.delivery_charge}`}
                  className={cart.delivery_charge === 0 ? "text-green-600" : ""}
                  icon={<Truck size={13} />}
                />
                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900 text-sm">Total</span>
                  <span className="font-bold text-gray-900">
                    ₹{cart.grand_total.toLocaleString("en-IN")}
                  </span>
                </div>
                {cart.total_discount > 0 && (
                  <p className="text-xs text-green-600 bg-green-50 rounded px-2 py-1.5 text-center">
                    You save ₹{cart.total_discount.toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              {/* CTA */}
              <div className="px-4 pb-4">
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full bg-[#FB641B] hover:bg-orange-600 disabled:bg-orange-300
                    text-white font-semibold py-3 rounded-sm text-sm transition-colors
                    flex items-center justify-center gap-2"
                >
                  {placing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

//  Small helpers 

function input(err?: string) {
  return `w-full border rounded-sm px-3 py-2 text-sm outline-none transition-colors ${
    err
      ? "border-red-400 focus:border-red-500"
      : "border-gray-300 focus:border-blue-500"
  }`;
}

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
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