import type {
  Category,
  ProductCard,
  ProductDetail,
  ProductListResponse,
  ProductFilters,
} from "@/types/product";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail ?? `API error ${res.status}`);
  }

  // 204 No Content — nothing to parse
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}

// ─── Product API ──────────────────────────────────────────────────────────────

export const productApi = {
  list: (filters: ProductFilters = {}): Promise<ProductListResponse> => {
    const query = buildQuery(filters as Record<string, string | number | boolean | undefined>);
    return apiFetch<ProductListResponse>(`/products${query}`);
  },

  getById: (id: number): Promise<ProductDetail> =>
    apiFetch<ProductDetail>(`/products/${id}`),

  getFeatured: (limit = 8): Promise<ProductCard[]> =>
    apiFetch<ProductCard[]>(`/products/featured?limit=${limit}`),
};

// ─── Category API ─────────────────────────────────────────────────────────────

export const categoryApi = {
  list: (): Promise<Category[]> => apiFetch<Category[]>("/categories"),
};

// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartProductSnapshot {
  id: number;
  title: string;
  brand: string | null;
  price: number;
  original_price: number | null;
  discount_percent: number;
  image_url: string | null;
  stock: number;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: CartProductSnapshot;
  created_at: string;
  updated_at: string | null;
}

export interface CartSummary {
  items: CartItem[];
  item_count: number;
  total_quantity: number;
  subtotal: number;
  total_discount: number;
  total: number;
  delivery_charge: number;
  grand_total: number;
}

// ─── Cart API ─────────────────────────────────────────────────────────────────

export const cartApi = {
  getCart: (): Promise<CartSummary> =>
    apiFetch<CartSummary>("/cart"),

  addToCart: (product_id: number, quantity = 1): Promise<CartItem> =>
    apiFetch<CartItem>("/cart", {
      method: "POST",
      body: JSON.stringify({ product_id, quantity }),
    }),

  updateQuantity: (item_id: number, quantity: number): Promise<CartItem> =>
    apiFetch<CartItem>(`/cart/${item_id}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (item_id: number): Promise<void> =>
    apiFetch<void>(`/cart/${item_id}`, { method: "DELETE" }),

  clearCart: (): Promise<void> =>
    apiFetch<void>("/cart", { method: "DELETE" }),
};