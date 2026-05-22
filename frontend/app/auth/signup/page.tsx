/**
 * Signup page — Flipkart-accurate UI.
 *
 * Left panel: "Looks like you're new here!" + subtitle + illustration
 * Right panel: Full Name → Email → Password → Confirm Password
 *              → terms → CONTINUE button → "Existing User? Log in"
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthCard from "@/components/auth/AuthCard";
import AuthInput from "@/components/auth/AuthInput";
import { useAuth } from "@/context/AuthContext";

interface FormState {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
  general?: string;
}

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.full_name.trim()) {
    errors.full_name = "Please enter your full name";
  } else if (values.full_name.trim().length < 2) {
    errors.full_name = "Name must be at least 2 characters";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Please enter a password";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/\d/.test(values.password)) {
    errors.password = "Password must include at least one number";
  } else if (!/[a-zA-Z]/.test(values.password)) {
    errors.password = "Password must include at least one letter";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Please confirm your password";
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = "Passwords do not match";
  }

  return errors;
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [values, setValues] = useState<FormState>({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
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
      await signup({
        email: values.email,
        full_name: values.full_name.trim(),
        password: values.password,
      });
      router.push("/");
    } catch (err) {
      setErrors({
        general:
          err instanceof Error ? err.message : "Signup failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard variant="signup">

      {/* General error banner */}
      {errors.general && (
        <div className="mb-5 rounded bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

        <AuthInput
          label="Full Name"
          type="text"
          name="full_name"
          value={values.full_name}
          onChange={handleChange}
          error={errors.full_name}
          autoComplete="name"
          autoFocus
        />

        <AuthInput
          label="Email Address"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          name="confirm_password"
          value={values.confirm_password}
          onChange={handleChange}
          error={errors.confirm_password}
          autoComplete="new-password"
        />

        {/* Terms */}
        <p className="text-[13px] text-gray-500 leading-relaxed">
          By continuing, you agree to Flipkart&apos;s{" "}
          <Link href="/terms" className="text-[#2874F0] hover:underline">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#2874F0] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        {/* CONTINUE button */}
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
              Creating account…
            </span>
          ) : (
            "Continue"
          )}
        </button>

      </form>

      {/* Login link at bottom — matches "Existing User? Log in" from screenshot */}
      <div className="mt-auto pt-10">
        <Link
          href="/auth/login"
          className="block text-center text-[14px] text-[#2874F0] font-medium hover:underline"
        >
          Existing User? Log in
        </Link>
      </div>

    </AuthCard>
  );
}