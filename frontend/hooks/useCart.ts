"use client";

import { useState, useEffect, useCallback } from "react";
import { cartApi, CartSummary } from "@/services/api";

interface UseCartReturn {
  cart: CartSummary | null;
  loading: boolean;
  error: string | null;
  addToCart: (product_id: number, quantity?: number) => Promise<void>;
  updateQuantity: (item_id: number, quantity: number) => Promise<void>;
  removeItem: (item_id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartApi.getCart();
      setCart(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (product_id: number, quantity = 1) => {
    await cartApi.addToCart(product_id, quantity);
    await fetchCart();
  };

  const updateQuantity = async (item_id: number, quantity: number) => {
    await cartApi.updateQuantity(item_id, quantity);
    await fetchCart(); // re-fetch so summary recalculates
  };

  const removeItem = async (item_id: number) => {
    await cartApi.removeItem(item_id);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    await fetchCart();
  };

  return { cart, loading, error, addToCart, updateQuantity, removeItem, clearCart, refresh: fetchCart };
}