"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

// Mock data — sera remplacé par l'API
const products = [
  { id: "1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro", price: 15000, stock: 23, image: "🎧", rating: 4.5, category: "Électronique" },
  { id: "2", slug: "montre-connectee-sport", name: "Montre Connectée Sport", price: 25000, stock: 15, image: "⌚", rating: 4.8, category: "Électronique" },
  { id: "3", slug: "sac-a-dos-urbain", name: "Sac à Dos Urbain", price: 18000, stock: 42, image: "🎒", rating: 4.2, category: "Mode" },
  { id: "4", slug: "lampe-led-decorative", name: "Lampe LED Décorative", price: 12000, stock: 8, image: "💡", rating: 4.6, category: "Maison" },
  { id: "5", slug: "batterie-externe-20000mah", name: "Batterie Externe 20000mAh", price: 22000, stock: 31, image: "🔋", rating: 4.7, category: "Électronique" },
  { id: "6", slug: "tapis-de-yoga-antiderapant", name: "Tapis de Yoga Antidérapant", price: 16000, stock: 19, image: "🧘", rating: 4.3, category: "Sport" },
  { id: "7", slug: "enceinte-portable-etanche", name: "Enceinte Portable Étanche", price: 35000, stock: 12, image: "🔊", rating: 4.9, category: "Électronique" },
  { id: "8", slug: "gourde-isotherme-750ml", name: "Gourde Isotherme 750ml", price: 9000, stock: 55, image: "🍶", rating: 4.4, category: "Sport" },
];

export default function HomePage() {
  const [cartCount, setCartCount] = useState(3); // Mock

  return (
    <div className="max-w-md mx-auto px-4 pt-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">
            Jogga<span className="text-accent">Store</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">Livraison express 24h</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/search" className="glass p-2.5 rounded-xl">
            <Search size={18} className="text-text-muted" />
          </Link>
          <Link href="/cart" className="glass p-2.5 rounded-xl relative">
            <ShoppingCart size={18} className="text-text-muted" />
            {cartCount > 0 && (
              <span className="badge absolute -top-1.5 -right-1.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Catégories rapides */}
      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-1">
        {["Tout", "Électronique", "Mode", "Maison", "Sport"].map((cat) => (
          <button
            key={cat}
            className="glass px-4 py-2 text-sm font-medium text-text whitespace-nowrap hover:bg-primary/5 transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille produits */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/${product.slug}`}>
              <div className="glass-strong p-3 hover:shadow-lg transition-shadow duration-300">
                {/* Image placeholder */}
                <div className="w-full h-28 bg-cream rounded-xl flex items-center justify-center text-4xl mb-3">
                  {product.image}
                </div>
                <h3 className="text-sm font-semibold text-text line-clamp-2 leading-tight mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-1.5">
                  <Star size={12} className="text-accent fill-accent" />
                  <span className="text-xs text-text-muted">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">
                    {product.price.toLocaleString()} FC
                  </span>
                  {product.stock < 10 && (
                    <span className="text-[10px] text-accent font-medium">
                      +{product.stock} restants
                    </span>
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
