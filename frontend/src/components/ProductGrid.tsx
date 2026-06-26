"use client";

import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

const products = [
  { id: "1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro ANC", price: 15000, oldPrice: 25000, image: "🎧", rating: 4.8, reviews: 234, isNew: true, tag: "Best Seller" },
  { id: "2", slug: "montre-connectee-sport", name: "Montre Connectée Sport IP68", price: 25000, oldPrice: 35000, image: "⌚", rating: 4.7, reviews: 567, tag: "Populaire" },
  { id: "3", slug: "sac-a-dos-urbain", name: "Sac à Dos Urbain Premium", price: 18000, image: "🎒", rating: 4.5, reviews: 89, isNew: true },
  { id: "4", slug: "lampe-led-decorative", name: "Lampe LED Ambiance RGB", price: 12000, oldPrice: 18000, image: "💡", rating: 4.6, reviews: 432 },
  { id: "5", slug: "batterie-externe", name: "Power Bank 20000mAh Fast Charge", price: 22000, image: "🔋", rating: 4.9, reviews: 156, tag: "Top Ventes" },
  { id: "6", slug: "enceinte-portable", name: "Enceinte Bluetooth Étanche", price: 35000, oldPrice: 45000, image: "🔊", rating: 4.8, reviews: 723, isNew: true },
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
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/${product.slug}`} className="block group">
              {/* Image card */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                {/* Wishlist heart */}
                <button className="absolute top-2.5 right-2.5 z-10 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart size={13} className="text-text-muted" />
                </button>

                {/* Tags */}
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
                  {product.isNew && (
                    <span className="bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                  )}
                  {product.tag && !product.isNew && (
                    <span className="bg-accent text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{product.tag}</span>
                  )}
                </div>

                {/* Discount badge */}
                {product.oldPrice && (
                  <span className="badge-discount absolute bottom-2.5 left-2.5 z-10 rounded-full px-2 py-0.5 text-[10px]">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}

                {/* Image */}
                <div className="aspect-[3/4] flex items-center justify-center text-5xl bg-surface p-4">
                  {product.image}
                </div>
              </div>

              {/* Info below card */}
              <div className="px-1 pt-2">
                <h3 className="text-[12px] font-semibold text-text leading-snug line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-1">
                  <Star size={10} className="text-star fill-star" />
                  <span className="text-[11px] font-semibold text-text">{product.rating}</span>
                  <span className="text-[10px] text-text-light">({product.reviews})</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-[11px] text-text-light line-through">{formatPrice(product.oldPrice)}</span>
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
