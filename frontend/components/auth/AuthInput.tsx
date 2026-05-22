"use client";

import React, { forwardRef } from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none transition-all
            placeholder:text-gray-400
            focus:border-[#2874F0] focus:ring-2 focus:ring-[#2874F0]/20
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-300"}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
export default AuthInput;