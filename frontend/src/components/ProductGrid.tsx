"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

const products = [
  { id: "1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro ANC", price: 15000, oldPrice: 25000, image: "🎧", rating: 4.8, reviews: 234, isNew: true },
  { id: "2", slug: "montre-connectee-sport", name: "Montre Connectée Sport IP68", price: 25000, oldPrice: 35000, image: "⌚", rating: 4.7, reviews: 567 },
  { id: "3", slug: "sac-a-dos-urbain", name: "Sac à Dos Urbain Premium", price: 18000, image: "🎒", rating: 4.5, reviews: 89, isNew: true },
  { id: "4", slug: "lampe-led-decorative", name: "Lampe LED Ambiance RGB", price: 12000, oldPrice: 18000, image: "💡", rating: 4.6, reviews: 432 },
  { id: "5", slug: "batterie-externe", name: "Power Bank 20000mAh Fast Charge", price: 22000, image: "🔋", rating: 4.9, reviews: 156 },
  { id: "6", slug: "enceinte-portable", name: "Enceinte Bluetooth Étanche", price: 35000, oldPrice: 45000, image: "🔊", rating: 4.8, reviews: 723, isNew: true },
  { id: "7", slug: "tapis-yoga", name: "Tapis de Yoga Premium 6mm", price: 16000, image: "🧘", rating: 4.4, reviews: 91 },
  { id: "8", slug: "gourde-isotherme", name: "Gourde Isotherme 750ml", price: 9000, oldPrice: 14000, image: "🍶", rating: 4.3, reviews: 312 },
];

export function ProductGrid() {
  const { formatPrice } = useCurrency();

  return (
    <div className="bg-surface px-4 pt-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black text-text uppercase tracking-wider">Pour Vous</h3>
        <Link href="/search" className="text-[11px] font-bold text-primary">Voir tout →</Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/${product.slug}`} className="block bg-white rounded-xl overflow-hidden group">
              {/* Image */}
              <div className="relative bg-surface aspect-[3/4] flex items-center justify-center text-5xl">
                {product.image}
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded">NEW</span>
                )}
                {product.oldPrice && (
                  <span className="badge-discount absolute top-2 right-2">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}
              </div>
              {/* Info */}
              <div className="p-2.5">
                <h3 className="text-[11px] font-semibold text-text leading-snug line-clamp-2 mb-1">
                  {product.name}
                </h3>
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-1">
                  <Star size={10} className="text-star fill-star" />
                  <span className="text-[10px] font-semibold text-text-muted">{product.rating}</span>
                  <span className="text-[9px] text-text-light">({product.reviews})</span>
                </div>
                {/* Price */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-[10px] text-text-light line-through">{formatPrice(product.oldPrice)}</span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
