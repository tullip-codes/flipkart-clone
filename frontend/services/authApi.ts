/**
 * Auth API calls.
 * Separated from api.ts to keep concerns isolated.
 * apiFetch is re-implemented here with token support.
 */

import type { AuthToken, LoginPayload, SignupPayload, User } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// Token storage helpers — centralised so storage key never drifts
export const TOKEN_KEY = "fk_auth_token";
export const USER_KEY = "fk_auth_user";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function storeAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ── API calls ─────────────────────────────────────────────────────────────────

async function authFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail ?? `Error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const authApi = {
  login: (payload: LoginPayload): Promise<AuthToken> =>
    authFetch<AuthToken>("/auth/login", payload),

  signup: (payload: SignupPayload): Promise<AuthToken> =>
    authFetch<AuthToken>("/auth/signup", payload),

  getMe: async (): Promise<User> => {
    const token = getStoredToken();
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Session expired");
    return res.json() as Promise<User>;
  },
};