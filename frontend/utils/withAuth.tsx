/**
 * withAuth HOC — wraps a page component to require authentication.
 *
 * Usage:
 *   export default withAuth(WishlistPage);
 *
 * Redirects to /auth/login if user is not authenticated.
 * Shows a loading spinner during hydration.
 */

"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  function ProtectedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace("/auth/login");
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F1F3F6]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2874F0] border-t-transparent" />
        </div>
      );
    }

    if (!isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  }

  ProtectedComponent.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name})`;
  return ProtectedComponent;
}