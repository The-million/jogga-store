"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, ChevronRight } from "lucide-react";
import Link from "next/link";

// Hero slides
const heroSlides = [
  { id: 1, title: "Nouveautés Tech", subtitle: "Écouteurs, montres & plus", cta: "Découvrir", color: "from-primary/90 to-primary-dark/90", emoji: "🎧" },
  { id: 2, title: "Livraison Express", subtitle: "En moins de 24h chez vous", cta: "Commander", color: "from-accent/90 to-accent-dark/90", emoji: "🚚" },
  { id: 3, title: "Qualité Garantie", subtitle: "Produits testés et vérifiés", cta: "Voir les offres", color: "from-sage/90 to-sage-dark/90", emoji: "✨" },
];

// Categories
const categories = [
  { name: "Électronique", icon: "📱", slug: "electronique" },
  { name: "Mode", icon: "👗", slug: "mode" },
  { name: "Maison", icon: "🏠", slug: "maison" },
  { name: "Sport", icon: "⚽", slug: "sport" },
  { name: "Beauté", icon: "💄", slug: "beaute" },
];

const products = [
  { id: "1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro", price: 15000, image: "🎧", category: "Électronique", isNew: true },
  { id: "2", slug: "montre-connectee-sport", name: "Montre Connectée Sport", price: 25000, image: "⌚", category: "Électronique", isNew: false },
  { id: "3", slug: "sac-a-dos-urbain", name: "Sac à Dos Urbain", price: 18000, image: "🎒", category: "Mode", isNew: true },
  { id: "4", slug: "lampe-led-decorative", name: "Lampe LED Décorative", price: 12000, image: "💡", category: "Maison", isNew: false },
  { id: "5", slug: "batterie-externe-20000mah", name: "Batterie Externe 20000mAh", price: 22000, image: "🔋", category: "Électronique", isNew: false },
  { id: "6", slug: "tapis-de-yoga-antiderapant", name: "Tapis de Yoga", price: 16000, image: "🧘", category: "Sport", isNew: true },
  { id: "7", slug: "enceinte-portable-etanche", name: "Enceinte Portable", price: 35000, image: "🔊", category: "Électronique", isNew: false },
  { id: "8", slug: "gourde-isotherme-750ml", name: "Gourde Isotherme", price: 9000, image: "🍶", category: "Sport", isNew: false },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount] = useState(3);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong rounded-none border-b border-primary/5">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text tracking-tight">
              Jogga<span className="text-accent">Store</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2.5 rounded-xl hover:bg-cream transition-colors">
              <Search size={20} className="text-text-muted" />
            </Link>
            <Link href="/cart" className="p-2.5 rounded-xl hover:bg-cream transition-colors relative">
              <ShoppingCart size={20} className="text-text-muted" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent text-text text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <div className="relative h-48 mx-4 mt-4 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].color} p-6 flex items-center`}
          >
            <div className="flex-1">
              <span className="text-white/70 text-xs font-medium tracking-wider uppercase">
                {heroSlides[currentSlide].subtitle}
              </span>
              <h2 className="text-white text-2xl font-bold mt-1 leading-tight">
                {heroSlides[currentSlide].title}
              </h2>
              <button className="mt-3 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full inline-flex items-center gap-1.5 hover:bg-white/30 transition-colors">
                {heroSlides[currentSlide].cta}
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="text-6xl ml-2">
              {heroSlides[currentSlide].emoji}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? "bg-white w-5" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Catégories</h3>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/?category=${cat.slug}`}
              className="glass flex items-center gap-2 px-4 py-3 rounded-2xl shrink-0 hover:shadow-md transition-shadow"
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-xs font-medium text-text whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 mt-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Pour vous</h3>
          <Link href="/search" className="text-xs text-primary font-medium">Tout voir</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link href={`/${product.slug}`}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-primary/3">
                  {/* Image */}
                  <div className="relative h-36 bg-cream flex items-center justify-center text-5xl">
                    {product.image}
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Nouveau
                      </span>
                    )}
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110">
                      <ShoppingCart size={14} className="text-primary" />
                    </button>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider font-medium">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-semibold text-text mt-0.5 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-sm font-bold text-primary mt-1.5">
                      {product.price.toLocaleString()} FC
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
