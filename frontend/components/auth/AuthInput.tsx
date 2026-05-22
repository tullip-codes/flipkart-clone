/**
 * AuthInput — Flipkart-style underline input.
 * Uses bottom border only (no box), matching Flipkart's actual auth form.
 * Label floats above as a placeholder-style hint.
 */

"use client";

import React, { forwardRef } from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, id, className: _className, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {/* Floating label above the underline input */}
        <label
          htmlFor={inputId}
          className="text-[13px] text-gray-500 mb-0.5"
        >
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          className={`
            w-full pb-2 text-[15px] text-gray-800 bg-transparent outline-none
            border-b-2 transition-colors
            placeholder:text-gray-300
            ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-[#2874F0]"
            }
          `}
          {...props}
        />

        {error && (
          <p className="text-xs text-red-500 mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
export default AuthInput;