"use client";

import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

const products = [
  { id: "1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro ANC", price: 15000, oldPrice: 25000, image: "🎧", rating: 4.8, reviews: 234, badge: "Best Seller" },
  { id: "2", slug: "montre-connectee-sport", name: "Montre Connectée Sport IP68", price: 25000, oldPrice: 35000, image: "⌚", rating: 4.7, reviews: 567, badge: "Populaire" },
  { id: "3", slug: "sac-a-dos-urbain", name: "Sac à Dos Urbain Premium", price: 18000, image: "🎒", rating: 4.5, reviews: 89, badge: "Nouveau" },
  { id: "4", slug: "lampe-led-decorative", name: "Lampe LED Ambiance RGB", price: 12000, oldPrice: 18000, image: "💡", rating: 4.6, reviews: 432 },
  { id: "5", slug: "batterie-externe", name: "Power Bank 20000mAh", price: 22000, image: "🔋", rating: 4.9, reviews: 156, badge: "Top Ventes" },
  { id: "6", slug: "enceinte-portable", name: "Enceinte Bluetooth Étanche", price: 35000, oldPrice: 45000, image: "🔊", rating: 4.8, reviews: 723, badge: "Nouveau" },
  { id: "7", slug: "tapis-yoga", name: "Tapis de Yoga Premium 6mm", price: 16000, image: "🧘", rating: 4.4, reviews: 91 },
  { id: "8", slug: "gourde-isotherme", name: "Gourde Isotherme 750ml", price: 9000, oldPrice: 14000, image: "🍶", rating: 4.3, reviews: 312 },
];

export function ProductGrid() {
  const { formatPrice } = useCurrency();

  return (
    <div className="bg-surface px-4 pt-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-black text-text uppercase tracking-wider">Meilleures Ventes</h3>
        <Link href="/search?category=best-sellers" className="text-[11px] font-bold text-primary">Tout voir →</Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {products.map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link href={`/${product.slug}`} className="block group">
              {/* Image */}
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                {/* Badge */}
                {product.badge && (
                  <span className={`absolute top-3 left-3 z-10 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    product.badge === "Nouveau" ? "bg-primary text-white" : "bg-accent text-white"
                  }`}>
                    {product.badge}
                  </span>
                )}
                {/* Discount */}
                {product.oldPrice && (
                  <span className="badge-discount absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}
                {/* Wishlist */}
                <button className="absolute bottom-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                  <Heart size={14} className="text-text-muted hover:text-red-500 transition-colors" />
                </button>
                {/* Image */}
                <div className="aspect-[3/4] flex items-center justify-center text-5xl bg-gradient-to-b from-slate-50 to-white p-6">
                  {product.image}
                </div>
              </div>

              {/* Info */}
              <div className="px-1 pt-2.5">
                <h3 className="text-xs font-semibold text-text leading-snug line-clamp-2 mb-1.5">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-1.5">
                  <Star size={10} className="text-star fill-star" />
                  <span className="text-[10px] font-bold text-text">{product.rating}</span>
                  <span className="text-[9px] text-text-light">({product.reviews})</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="price-tag text-sm text-primary">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-[11px] text-text-light line-through font-medium">{formatPrice(product.oldPrice)}</span>
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
