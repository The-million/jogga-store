"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { api, ApiCart } from "./api";
import { useAuth } from "./AuthContext";

type CartContextType = {
  cart: ApiCart | null;
  itemCount: number;
  loading: boolean;
  addItem: (productId: string, quantity?: number, variantLabel?: Record<string, string>) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<ApiCart>("/cart");
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [user, refreshCart]);

  const addItem = async (productId: string, quantity = 1, variantLabel?: Record<string, string>) => {
    await api.post("/cart/items", { productId, quantity, ...(variantLabel ? { variantLabel } : {}) });
    await refreshCart();
  };

  const updateItem = async (itemId: string, quantity: number) => {
    await api.put(`/cart/items/${itemId}`, { quantity });
    await refreshCart();
  };

  const removeItem = async (itemId: string) => {
    await api.delete(`/cart/items/${itemId}`);
    await refreshCart();
  };

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, loading, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
