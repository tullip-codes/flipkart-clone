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
    errors.full_name = "Full name is required";
  } else if (values.full_name.trim().length < 2) {
    errors.full_name = "Name must be at least 2 characters";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/\d/.test(values.password)) {
    errors.password = "Password must contain at least one number";
  } else if (!/[a-zA-Z]/.test(values.password)) {
    errors.password = "Password must contain at least one letter";
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
        general: err instanceof Error ? err.message : "Signup failed. Try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Create Account
      </h2>

      {errors.general && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <AuthInput
          label="Full Name"
          type="text"
          name="full_name"
          value={values.full_name}
          onChange={handleChange}
          error={errors.full_name}
          placeholder="Enter your full name"
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
          placeholder="Enter your email"
          autoComplete="email"
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Min 8 characters with a number"
          autoComplete="new-password"
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          name="confirm_password"
          value={values.confirm_password}
          onChange={handleChange}
          error={errors.confirm_password}
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />

        <p className="text-xs text-gray-500 leading-relaxed">
          By creating an account, you agree to Flipkart&apos;s{" "}
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
          {isSubmitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-sm text-gray-500">Already have an account? </span>
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-[#2874F0] hover:underline"
        >
          Login
        </Link>
      </div>
    </AuthCard>
  );
}