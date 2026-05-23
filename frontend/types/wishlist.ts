/**
 * Wishlist domain types.
 * WishlistProduct mirrors the backend WishlistProductSnapshot schema.
 */

export interface WishlistProduct {
  id: number;
  title: string;
  brand: string | null;
  price: number;
  original_price: number | null;
  discount_percent: number;
  image_url: string | null;
  rating: number;
  rating_count: number;
  stock: number;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product: WishlistProduct;
  created_at: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  total: number;
}

export interface WishlistToggleResponse {
  wishlisted: boolean;
  product_id: number;
  message: string;
}