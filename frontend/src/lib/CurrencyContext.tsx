"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Currency = "FC" | "USD";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  formatPrice: (priceFC: number) => string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "FC",
  toggleCurrency: () => {},
  formatPrice: () => "",
  exchangeRate: 2800,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("FC");

  const toggleCurrency = useCallback(() => {
    setCurrency((c) => (c === "FC" ? "USD" : "FC"));
  }, []);

  const formatPrice = useCallback(
    (priceFC: number) => {
      if (currency === "USD") {
        return `$${(priceFC / 2800).toFixed(2)}`;
      }
      return `${priceFC.toLocaleString()} FC`;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice, exchangeRate: 2800 }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
