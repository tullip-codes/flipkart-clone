/**
 * AuthCard — Flipkart-accurate split layout.
 *
 * Left  : blue panel with headline + subtitle + illustration
 * Right : white panel — receives form content via children
 *
 * Rendered below the fixed navbar (pt-[112px] handled by layout).
 * The card is NOT full-viewport-centered — it sits in the page flow
 * matching Flipkart's actual auth page layout.
 */

import React from "react";

interface AuthCardProps {
  /** "login" shows Login headline; "signup" shows signup headline */
  variant?: "login" | "signup";
  children: React.ReactNode;
}

export default function AuthCard({
  variant = "login",
  children,
}: AuthCardProps) {
  const headline =
    variant === "signup" ? (
      <>
        Looks like you&apos;re
        <br />
        new here!
      </>
    ) : (
      "Login"
    );

  const subtitle =
    variant === "signup"
      ? "Sign up with your email to get started"
      : "Get access to your Orders,\nWishlist and Recommendations";

  return (
    <div className="min-h-[calc(100vh-112px)] bg-[#F1F3F6] flex items-start justify-center pt-8 pb-12 px-4">
      <div className="w-full max-w-[750px] flex shadow-md rounded-sm overflow-hidden">

        {/* ── Left blue panel ──────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-col justify-between bg-[#2874F0] w-[288px] flex-shrink-0 p-10 pb-0">
          <div>
            <h1 className="text-[28px] font-semibold text-white leading-snug">
              {headline}
            </h1>
            <p className="mt-4 text-[15px] text-blue-100 leading-relaxed whitespace-pre-line">
              {subtitle}
            </p>
          </div>

          {/* SVG illustration — faithful Flipkart-style laptop scene */}
          <div className="mt-8">
            <FlipkartIllustration />
          </div>
        </div>

        {/* ── Right white panel ─────────────────────────────────────────────── */}
        <div className="flex-1 bg-white px-8 py-10 md:px-10">
          {children}
        </div>

      </div>
    </div>
  );
}

/**
 * Inline SVG illustration — matches Flipkart's laptop + shopping bags scene.
 * No external asset dependency.
 */
function FlipkartIllustration() {
  return (
    <svg
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
    >
      {/* Ground shadow */}
      <ellipse cx="120" cy="188" rx="90" ry="8" fill="rgba(0,0,0,0.15)" />

      {/* Laptop base */}
      <rect x="55" y="120" width="130" height="8" rx="3" fill="#1a1a2e" />
      <rect x="45" y="126" width="150" height="6" rx="2" fill="#16213e" />

      {/* Laptop screen body */}
      <rect x="60" y="55" width="120" height="68" rx="4" fill="#1a1a2e" />
      {/* Screen bezel */}
      <rect x="64" y="59" width="112" height="58" rx="2" fill="#e8eaf6" />

      {/* Screen content — user profile icon */}
      <circle cx="120" cy="81" r="14" fill="#bdbdbd" />
      <circle cx="120" cy="76" r="6" fill="#9e9e9e" />
      <ellipse cx="120" cy="92" rx="10" ry="6" fill="#9e9e9e" />

      {/* Red shopping bag - left */}
      <rect x="32" y="100" width="36" height="44" rx="3" fill="#e53935" />
      <path d="M40 100 Q40 88 50 88 Q60 88 60 100" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Heart on red bag */}
      <path d="M50 118 C50 118 43 113 43 108 C43 105 46 103 50 107 C54 103 57 105 57 108 C57 113 50 118 50 118Z" fill="white" opacity="0.9" />

      {/* Yellow shopping bag - right */}
      <rect x="172" y="108" width="36" height="38" rx="3" fill="#FDD835" />
      <path d="M180 108 Q180 97 190 97 Q200 97 200 108" stroke="#F9A825" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Flipkart F on yellow bag */}
      <text x="184" y="133" fontSize="16" fontWeight="bold" fill="#2874F0" fontFamily="Arial">F</text>

      {/* Dark bag - top right of laptop */}
      <rect x="158" y="72" width="28" height="34" rx="3" fill="#37474F" />
      <path d="M164 72 Q164 64 172 64 Q180 64 180 72" stroke="#546E7A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Up arrow on dark bag */}
      <path d="M172 82 L172 94 M168 86 L172 82 L176 86" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Sun / yellow circle top */}
      <circle cx="168" cy="48" r="14" fill="#FDD835" />
      <circle cx="168" cy="48" r="9" fill="#FFB300" />

      {/* Cloud */}
      <ellipse cx="140" cy="42" rx="18" ry="11" fill="white" opacity="0.9" />
      <ellipse cx="128" cy="46" rx="12" ry="9" fill="white" opacity="0.9" />
      <ellipse cx="152" cy="47" rx="10" ry="8" fill="white" opacity="0.9" />
    </svg>
  );
}