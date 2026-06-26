"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, DollarSign } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

const heroSlides = [
  { title: "Nouvelle Collection", subtitle: "Jusqu'à -50%", cta: "Shopper maintenant", color: "#FF6B35", textColor: "#fff" },
  { title: "Livraison Express", subtitle: "En moins de 24h", cta: "Commander", color: "#1A1A1A", textColor: "#fff" },
  { title: "Qualité Premium", subtitle: "Produits vérifiés", cta: "Découvrir", color: "#FF2D55", textColor: "#fff" },
];

const categories = [
  { name: "Électronique", image: "📱", slug: "electronique", count: 124 },
  { name: "Mode", image: "👗", slug: "mode", count: 89 },
  { name: "Maison", image: "🏠", slug: "maison", count: 56 },
  { name: "Sport", image: "⚽", slug: "sport", count: 42 },
  { name: "Beauté", image: "💄", slug: "beaute", count: 38 },
];

const products = [
  { id: "1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro ANC", price: 15000, oldPrice: 25000, image: "🎧", sales: 234, isNew: true },
  { id: "2", slug: "montre-connectee-sport", name: "Montre Connectée Sport IP68", price: 25000, oldPrice: 35000, image: "⌚", sales: 567, isNew: false },
  { id: "3", slug: "sac-a-dos-urbain", name: "Sac à Dos Urbain Premium", price: 18000, oldPrice: null, image: "🎒", sales: 89, isNew: true },
  { id: "4", slug: "lampe-led-decorative", name: "Lampe LED Ambiance RGB", price: 12000, oldPrice: 18000, image: "💡", sales: 432, isNew: false },
  { id: "5", slug: "batterie-externe-20000mah", name: "Power Bank 20000mAh", price: 22000, oldPrice: null, image: "🔋", sales: 156, isNew: false },
  { id: "6", slug: "enceinte-portable-etanche", name: "Enceinte Bluetooth Étanche", price: 35000, oldPrice: 45000, image: "🔊", sales: 723, isNew: true },
  { id: "7", slug: "tapis-de-yoga-premium", name: "Tapis de Yoga Premium 6mm", price: 16000, oldPrice: null, image: "🧘", sales: 91, isNew: false },
  { id: "8", slug: "gourde-isotherme-750ml", name: "Gourde Isotherme 750ml", price: 9000, oldPrice: 14000, image: "🍶", sales: 312, isNew: false },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount] = useState(3);
  const { currency, toggleCurrency, formatPrice } = useCurrency();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="max-w-md mx-auto bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <h1 className="text-xl font-black text-text tracking-tight uppercase">JOGGA</h1>
            <span className="text-[10px] font-semibold text-primary tracking-widest uppercase">Store</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={toggleCurrency} className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-bold text-text-muted hover:text-text transition-colors">
              <DollarSign size={13} />
              {currency}
            </button>
            <Link href="/search" className="p-2">
              <Search size={19} className="text-text" />
            </Link>
            <Link href="/cart" className="p-2 relative">
              <ShoppingCart size={19} className="text-text" />
              {cartCount > 0 && <span className="badge-count absolute -top-0.5 -right-0.5">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative h-44 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center px-6"
            style={{ backgroundColor: heroSlides[currentSlide].color, color: heroSlides[currentSlide].textColor }}
          >
            <div>
              <p className="text-xs opacity-70 font-semibold uppercase tracking-widest">{heroSlides[currentSlide].subtitle}</p>
              <h2 className="text-2xl font-black mt-1">{heroSlides[currentSlide].title}</h2>
              <button className="mt-3 bg-white/20 px-5 py-2 text-xs font-bold uppercase tracking-wider">
                {heroSlides[currentSlide].cta} →
              </button>
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

      {/* Categories */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/?category=${cat.slug}`} className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-2xl">
                {cat.image}
              </div>
              <span className="text-[10px] font-semibold text-text text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-text uppercase tracking-wider">🔥 Populaires</h3>
          <Link href="/search" className="text-xs font-semibold text-text-muted">Voir tout →</Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link href={`/${product.slug}`} className="block group">
                {/* Image */}
                <div className="relative bg-surface rounded-lg aspect-[3/4] flex items-center justify-center text-5xl overflow-hidden mb-2">
                  {product.image}
                  {product.isNew && <span className="badge-new absolute top-2 left-2">NEW</span>}
                  {product.oldPrice && (
                    <span className="badge-sale absolute top-2 right-2">
                      -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                    </span>
                  )}
                </div>
                {/* Info */}
                <h3 className="text-xs text-text leading-snug line-clamp-2 mb-1 font-medium">{product.name}</h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-accent">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-[10px] text-text-light line-through">{formatPrice(product.oldPrice)}</span>
                  )}
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
