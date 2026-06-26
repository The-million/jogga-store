"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";
import { api, ApiProduct } from "@/lib/api";

export function FlashSale() {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 23, s: 45 });

  useEffect(() => {
    api.get<ApiProduct[]>("/products?category=electronique")
      .then((data) => {
        // Pick 4 products with the best discounts
        const withDiscount = data
          .filter((p) => p.comparePrice && Number(p.comparePrice) > Number(p.price))
          .sort((a, b) => {
            const da = 1 - Number(a.price) / Number(a.comparePrice!);
            const db = 1 - Number(b.price) / Number(b.comparePrice!);
            return db - da;
          })
          .slice(0, 4);
        setProducts(withDiscount.length >= 4 ? withDiscount : data.slice(0, 4));
      })
      .catch(() => {});
  }, []);

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
    <div className="bg-white py-4 border-b border-border">
      {/* Header */}
      <div className="px-4 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="section-title text-accent">OFFRES FLASH</span>
          <div className="flex items-center gap-0.5">
            {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((val, i) => (
              <span key={i} className="flex items-center gap-0.5">
                <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-display">{val}</span>
                {i < 2 && <span className="text-[10px] font-bold text-accent">:</span>}
              </span>
            ))}
          </div>
        </div>
        <Link href="/category/electronique" className="text-[11px] font-bold text-primary no-underline">
          Tout voir →
        </Link>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="flex gap-3 px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shrink-0 w-36 animate-pulse">
              <div className="bg-surface rounded-xl aspect-[3/4] mb-2" />
              <div className="h-3 bg-surface rounded w-2/3 mb-1" />
              <div className="h-3 bg-surface rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4">
          {products.map((product, i) => {
            const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);
            const discountPct = hasDiscount
              ? Math.round((1 - Number(product.price) / Number(product.comparePrice!)) * 100)
              : 0;
            const sold = 45 + (i * 17) % 50; // pseudo sold %

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="shrink-0 w-36"
              >
                <Link href={`/${product.slug}`} className="block no-underline">
                  <div className="relative bg-surface rounded-xl aspect-[3/4] mb-2 overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🎧</div>
                    )}
                    {hasDiscount && (
                      <span className="badge-discount absolute top-2 left-2">-{discountPct}%</span>
                    )}
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/30 px-2 pt-1 pb-2">
                      <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${sold}%` }} />
                      </div>
                      <p className="text-[9px] text-white/90 mt-0.5 font-medium">{sold}% vendu</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-text line-clamp-1 mb-1">{product.name}</p>
                  <p className="text-sm font-black text-accent price-tag">{formatPrice(Number(product.price))}</p>
                  {hasDiscount && (
                    <p className="text-[10px] text-text-light line-through">{formatPrice(Number(product.comparePrice))}</p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
