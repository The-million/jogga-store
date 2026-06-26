"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

const heroSlides = [
  { title: "Nouvelle Collection", subtitle: "Jusqu'à -50%", bg: "bg-primary", text: "text-white" },
  { title: "Livraison Express", subtitle: "En moins de 24h", bg: "bg-primary-dark", text: "text-white" },
  { title: "Qualité Premium", subtitle: "Produits vérifiés", bg: "bg-accent", text: "text-white" },
];

// Catégories style Shein
const mainCategories = [
  { name: "FEMMES", icon: "👩", slug: "femmes", color: "bg-pink-50" },
  { name: "HOMMES", icon: "👨", slug: "hommes", color: "bg-blue-50" },
  { name: "ENFANTS", icon: "👶", slug: "enfants", color: "bg-yellow-50" },
  { name: "ÉLECTRO", icon: "📱", slug: "electronique", color: "bg-purple-50" },
  { name: "MAISON", icon: "🏠", slug: "maison", color: "bg-green-50" },
  { name: "BEAUTÉ", icon: "💄", slug: "beaute", color: "bg-rose-50" },
  { name: "SPORT", icon: "⚽", slug: "sport", color: "bg-orange-50" },
  { name: "SACS", icon: "👜", slug: "sacs", color: "bg-amber-50" },
  { name: "CHAUSSURES", icon: "👟", slug: "chaussures", color: "bg-gray-50" },
  { name: "BIJOUX", icon: "💍", slug: "bijoux", color: "bg-red-50" },
  { name: "JOUETS", icon: "🧸", slug: "jouets", color: "bg-lime-50" },
  { name: "AUTO", icon: "🚗", slug: "auto", color: "bg-sky-50" },
];

const products = [
  { id: "1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro ANC", price: 15000, oldPrice: 25000, image: "🎧", sales: 234, isNew: true },
  { id: "2", slug: "montre-connectee-sport", name: "Montre Connectée Sport", price: 25000, oldPrice: 35000, image: "⌚", sales: 567 },
  { id: "3", slug: "sac-a-dos-urbain", name: "Sac à Dos Urbain Premium", price: 18000, image: "🎒", sales: 89, isNew: true },
  { id: "4", slug: "lampe-led-decorative", name: "Lampe LED Ambiance RGB", price: 12000, oldPrice: 18000, image: "💡", sales: 432 },
  { id: "5", slug: "batterie-externe", name: "Power Bank 20000mAh", price: 22000, image: "🔋", sales: 156 },
  { id: "6", slug: "enceinte-portable", name: "Enceinte Bluetooth Étanche", price: 35000, oldPrice: 45000, image: "🔊", sales: 723, isNew: true },
  { id: "7", slug: "tapis-yoga", name: "Tapis de Yoga Premium", price: 16000, image: "🧘", sales: 91 },
  { id: "8", slug: "gourde-isotherme", name: "Gourde Isotherme 750ml", price: 9000, oldPrice: 14000, image: "🍶", sales: 312 },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount] = useState(3);
  const { currency, setCurrency, formatPrice } = useCurrency();
  const isUSD = currency === "USD";

  const nextSlide = useCallback(() => setCurrentSlide((p) => (p + 1) % heroSlides.length), []);
  useEffect(() => { const t = setInterval(nextSlide, 4000); return () => clearInterval(t); }, [nextSlide]);

  return (
    <div className="max-w-md mx-auto bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <h1 className="text-xl font-black text-primary tracking-tight uppercase">JOGGA</h1>
            <span className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Store</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Currency toggle pill */}
            <div className="toggle-track relative">
              <motion.div
                className="toggle-thumb absolute top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)]"
                animate={{ x: isUSD ? "calc(100% + 0px)" : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
              <button onClick={() => setCurrency("CDF")} className={`toggle-option ${!isUSD ? "text-primary" : "text-text-muted"}`}>FC</button>
              <button onClick={() => setCurrency("USD")} className={`toggle-option ${isUSD ? "text-primary" : "text-text-muted"}`}>USD</button>
            </div>
            <Link href="/search" className="p-2"><Search size={19} className="text-text" /></Link>
            <Link href="/cart" className="p-2 relative">
              <ShoppingCart size={19} className="text-text" />
              {cartCount > 0 && <span className="badge-count absolute -top-0.5 -right-0.5">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-40 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`absolute inset-0 flex items-center px-6 ${heroSlides[currentSlide].bg} ${heroSlides[currentSlide].text}`}>
            <div>
              <p className="text-xs opacity-70 font-bold uppercase tracking-widest">{heroSlides[currentSlide].subtitle}</p>
              <h2 className="text-xl font-black mt-1">{heroSlides[currentSlide].title}</h2>
              <Link href="/search" className="inline-block mt-3 bg-white/20 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full">
                Shopper maintenant →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`h-1 rounded-full transition-all ${i === currentSlide ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`} />
          ))}
        </div>
      </div>

      {/* Catégories style Shein */}
      <div className="px-3 py-4">
        <div className="grid grid-cols-4 gap-2">
          {mainCategories.map((cat) => (
            <Link key={cat.slug} href={`/?category=${cat.slug}`}
              className={`${cat.color} rounded-xl p-3 flex flex-col items-center gap-1.5 hover:shadow-sm transition-shadow`}>
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[9px] font-bold text-text text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Produits */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-text uppercase tracking-wider">🔥 Populaires</h3>
          <Link href="/search" className="text-xs font-semibold text-primary">Voir tout →</Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link href={`/${product.slug}`} className="block group">
                <div className="relative bg-surface rounded-lg aspect-[3/4] flex items-center justify-center text-5xl overflow-hidden mb-2">
                  {product.image}
                  {product.isNew && <span className="badge-new absolute top-2 left-2">NEW</span>}
                  {product.oldPrice && (
                    <span className="badge-sale absolute top-2 right-2">
                      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  )}
                </div>
                <h3 className="text-[11px] text-text leading-snug line-clamp-2 mb-1 font-medium">{product.name}</h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.oldPrice && <span className="text-[10px] text-text-light line-through">{formatPrice(product.oldPrice)}</span>}
                </div>
                <p className="text-[9px] text-text-muted mt-0.5">{product.sales}+ vendus</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
