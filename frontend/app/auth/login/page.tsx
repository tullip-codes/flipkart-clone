/**
 * Login page — pixel-accurate Flipkart auth UI.
 *
 * Layout matches screenshots:
 * - Left blue panel: "Login" + subtitle + illustration
 * - Right white panel: underline email input → underline password input
 *   → terms text → orange CONTINUE button → "New to Flipkart? Create an account"
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import { useAuth } from "@/context/AuthContext";

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.email.trim()) {
    errors.email = "Please enter your email address";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Please enter your password";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [values, setValues] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await login({ email: values.email, password: values.password });
      router.push("/");
    } catch (err) {
      setErrors({
        general:
          err instanceof Error ? err.message : "Login failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard variant="login">

      {/* General error banner */}
      {errors.general && (
        <div className="mb-5 rounded bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">

        {/* Email */}
        <AuthInput
          label="Enter Email/Mobile number"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          autoFocus
        />

        {/* Password */}
        <AuthInput
          label="Enter Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        {/* Terms */}
        <p className="text-[13px] text-gray-500 leading-relaxed -mt-2">
          By continuing, you agree to Flipkart&apos;s{" "}
          <Link
            href="/terms"
            className="text-[#2874F0] hover:underline"
          >
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[#2874F0] hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {/* CONTINUE button — Flipkart orange, full width, uppercase */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#FB641B] hover:bg-[#f4581a] active:bg-[#e04e16]
            text-white font-medium text-[14px] tracking-wider uppercase
            py-3.5 rounded-sm transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed
            shadow-sm"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Logging in…
            </span>
          ) : (
            "Continue"
          )}
        </button>

      </form>

      {/* Divider + signup link — bottom of right panel */}
      <div className="mt-auto pt-12">
        <Link
          href="/auth/signup"
          className="block text-center text-[14px] text-[#2874F0] font-medium hover:underline"
        >
          New to Flipkart? Create an account
        </Link>
      </div>

    </AuthCard>
  );
}