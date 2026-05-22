import React from "react";
import Image from "next/image";

interface AuthCardProps {
  children: React.ReactNode;
}

/**
 * Flipkart-style split auth card.
 * Left panel: brand + tagline (hidden on mobile)
 * Right panel: form content
 */
export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F1F3F6] px-4 py-12">
      <div className="w-full max-w-[800px] overflow-hidden rounded-md shadow-lg flex">
        
        {/* Left panel — Flipkart blue brand panel */}
        <div className="hidden md:flex flex-col justify-between bg-[#2874F0] p-10 w-[40%]">
          <div>
            <h1 className="text-[28px] font-semibold text-white leading-snug">
              Login
            </h1>
            <p className="mt-3 text-[15px] text-blue-100 leading-relaxed">
              Get access to your Orders,
              <br />
              Wishlist and Recommendations
            </p>
          </div>
          {/* Decorative illustration placeholder */}
          <img
            src="/auth-illustration.svg"
            alt=""
            className="w-full opacity-80"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Right panel — white form area */}
        <div className="flex-1 bg-white p-8 md:p-10">
          {/* Mobile-only logo */}
          <div className="mb-6 flex items-center gap-1 md:hidden">
            <span className="text-2xl font-bold text-[#2874F0]">Flipkart</span>
            <span className="text-[10px] text-[#FFE500] font-medium italic bg-[#2874F0] px-1 rounded">
              Plus
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}