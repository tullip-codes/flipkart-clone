/**
 * AuthContext — global auth state.
 *
 * Provides: user, token, isAuthenticated, isLoading,
 *           login(), signup(), logout()
 *
 * Consumed via the useAuth() hook.
 * Wraps the entire app in layout.tsx.
 */

"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  authApi,
  clearAuth,
  getStoredToken,
  getStoredUser,
  storeAuth,
} from "@/services/authApi";
import type { LoginPayload, SignupPayload, User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true on mount — hydrating from storage

  // Hydrate from localStorage on first render
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await authApi.login(payload);
    storeAuth(data.access_token, data.user);
    setToken(data.access_token);
    setUser(data.user);
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    const data = await authApi.signup(payload);
    storeAuth(data.access_token, data.user);
    setToken(data.access_token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}