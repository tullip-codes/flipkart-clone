"use client";

import { useState, useEffect, useCallback } from "react";
import { orderApi } from "@/services/api";
import type { Order, OrderListResponse } from "@/types/order";

export function useOrders() {
  const [data, setData]     = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderApi.getMyOrders();
      setData(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { orders: data?.orders ?? [], total: data?.total ?? 0, loading, error, refresh: fetch };
}