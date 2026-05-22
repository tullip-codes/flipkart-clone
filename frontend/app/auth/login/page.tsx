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
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!values.password) {
    errors.password = "Password is required";
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
    // Clear field error on change
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
        general: err instanceof Error ? err.message : "Login failed. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 md:hidden">
        Login
      </h2>

      {errors.general && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <AuthInput
          label="Email Address"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
          autoComplete="email"
          autoFocus
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <p className="text-xs text-gray-500 leading-relaxed">
          By continuing, you agree to Flipkart&apos;s{" "}
          <span className="text-[#2874F0] cursor-pointer hover:underline">
            Terms of Use
          </span>{" "}
          and{" "}
          <span className="text-[#2874F0] cursor-pointer hover:underline">
            Privacy Policy
          </span>
          .
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[#FB641B] px-4 py-3 text-sm font-semibold
            text-white transition-all hover:bg-[#e85d18] active:scale-[0.98]
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in…" : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-sm text-gray-500">New to Flipkart? </span>
        <Link
          href="/auth/signup"
          className="text-sm font-semibold text-[#2874F0] hover:underline"
        >
          Create an account
        </Link>
      </div>
    </AuthCard>
  );
}