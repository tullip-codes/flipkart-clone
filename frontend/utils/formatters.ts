/**
 * formatters.ts — Pure utility functions for display formatting.
 * No dependencies, fully unit-testable.
 */

/**
 * Format a number as Indian Rupees.
 * e.g. 89999 → "₹89,999"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Compute savings amount between original and current price.
 */
export function savingsAmount(original: number, current: number): number {
  return Math.max(0, original - current);
}

/**
 * Return a star-rating label, e.g. "4.5 ★"
 */
export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} ★`;
}

/**
 * Format rating count, e.g. 28341 → "28,341 ratings"
 */
export function formatRatingCount(count: number): string {
  return `${new Intl.NumberFormat("en-IN").format(count)} ratings`;
}

/**
 * Derive a stock status label and urgency level.
 */
export function stockStatus(stock: number): { label: string; level: "ok" | "low" | "out" } {
  if (stock === 0) return { label: "Out of Stock", level: "out" };
  if (stock <= 5) return { label: `Only ${stock} left!`, level: "low" };
  return { label: "In Stock", level: "ok" };
}

/**
 * Parse specifications JSON string safely.
 * Returns a plain object or empty object on parse failure.
 */
export function parseSpecifications(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}