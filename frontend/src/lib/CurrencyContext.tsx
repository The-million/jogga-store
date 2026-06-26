"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Currency = "CDF" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceCDF: number) => string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "CDF",
  setCurrency: () => {},
  formatPrice: () => "",
  exchangeRate: 2800,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("CDF");

  const formatPrice = useCallback((priceCDF: number) => {
    if (currency === "USD") return `$${(priceCDF / 2800).toFixed(2)}`;
    return `${priceCDF.toLocaleString()} FC`;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, exchangeRate: 2800 }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
