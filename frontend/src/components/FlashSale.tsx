"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCurrency } from "@/lib/CurrencyContext";

const flashProducts = [
  { id: "f1", name: "Écouteurs ANC", price: 12000, oldPrice: 25000, image: "🎧", sold: 85 },
  { id: "f2", name: "Montre Sport", price: 18000, oldPrice: 35000, image: "⌚", sold: 62 },
  { id: "f3", name: "Power Bank", price: 15000, oldPrice: 28000, image: "🔋", sold: 93 },
  { id: "f4", name: "Enceinte BT", price: 22000, oldPrice: 45000, image: "🔊", sold: 47 },
];

export function FlashSale() {
  const { formatPrice } = useCurrency();
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 23, s: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        else return { h: 5, m: 23, s: 45 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="bg-white py-4">
      {/* Header */}
      <div className="px-4 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black text-text uppercase tracking-wider">⚡ Offres Flash</h3>
          <div className="flex items-center gap-1">
            <span className="bg-text text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{pad(timeLeft.h)}</span>
            <span className="text-[10px] font-bold text-text">:</span>
            <span className="bg-text text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{pad(timeLeft.m)}</span>
            <span className="text-[10px] font-bold text-text">:</span>
            <span className="bg-text text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{pad(timeLeft.s)}</span>
          </div>
        </div>
        <button className="text-[11px] font-bold text-primary">Tout voir →</button>
      </div>

      {/* Products horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4">
        {flashProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="shrink-0 w-36"
          >
            <div className="relative bg-surface rounded-xl aspect-[3/4] flex items-center justify-center text-4xl mb-2 overflow-hidden">
              {product.image}
              <span className="badge-discount absolute top-2 left-2">
                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </span>
              {/* Progress bar */}
              <div className="absolute bottom-2 left-2 right-2">
                <div className="h-1 bg-white/40 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${product.sold}%` }} />
                </div>
                <p className="text-[9px] text-white/80 mt-0.5 font-medium">{product.sold}% vendu</p>
              </div>
            </div>
            <p className="text-xs font-bold text-accent">{formatPrice(product.price)}</p>
            <p className="text-[10px] text-text-light line-through">{formatPrice(product.oldPrice)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
