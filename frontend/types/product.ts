//  Domain Types 

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  is_active: boolean;
  created_at: string;
}

/** Lightweight shape returned in listing/grid views */
export interface ProductCard {
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
  category: Category | null;
}

/** Full shape returned on the detail page */
export interface ProductDetail extends ProductCard {
  description: string | null;
  images: string[];
  specifications: string | null;   // raw JSON string; parse on use
  is_active: boolean;
  created_at: string;
}

// API Response Types 

export interface ProductListResponse {
  items: ProductCard[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Query Param Types 

export type SortOption = "created_at" | "price" | "rating" | "discount_percent";
export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: SortOption;
  order?: SortOrder;
  page?: number;
  page_size?: number;
}