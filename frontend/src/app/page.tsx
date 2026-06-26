"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, ChevronRight, DollarSign } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

// Hero slides (images via admin settings — fallback gradients)
const defaultSlides = [
  { title: "Drop Exclusif", subtitle: "Nouvelle collection tech", cta: "Shopper", imageUrl: "", color: "from-violet-600 to-fuchsia-600" },
  { title: "Livraison 24h", subtitle: "Stock au Congo, chez vous demain", cta: "Commander", imageUrl: "", color: "from-emerald-600 to-teal-600" },
  { title: "Qualité Premium", subtitle: "Produits vérifiés, garantis", cta: "Découvrir", imageUrl: "", color: "from-amber-600 to-orange-600" },
];

const categories = [
  {
    name: "Électronique", slug: "electronique", icon: "📱",
    subs: ["Audio", "Montres", "Accessoires", "Stockage"],
  },
  {
    name: "Mode", slug: "mode", icon: "👗",
    subs: ["Hommes", "Femmes", "Sacs", "Chaussures"],
  },
  {
    name: "Maison", slug: "maison", icon: "🏠",
    subs: ["Déco", "Cuisine", "Éclairage", "Rangement"],
  },
  {
    name: "Sport", slug: "sport", icon: "⚽",
    subs: ["Fitness", "Yoga", "Outdoor", "Accessoires"],
  },
];

const products = [
  { id: "1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro ANC", price: 15000, image: "🎧", category: "Audio", isNew: true },
  { id: "2", slug: "montre-connectee-sport", name: "Montre Connectée Sport", price: 25000, image: "⌚", category: "Montres", isNew: false },
  { id: "3", slug: "sac-a-dos-urbain", name: "Sac à Dos Urbain Premium", price: 18000, image: "🎒", category: "Sacs", isNew: true },
  { id: "4", slug: "lampe-led-decorative", name: "Lampe LED Ambiance RGB", price: 12000, image: "💡", category: "Éclairage", isNew: false },
  { id: "5", slug: "batterie-externe-20000mah", name: "Power Bank 20000mAh Fast Charge", price: 22000, image: "🔋", category: "Accessoires", isNew: false },
  { id: "6", slug: "tapis-de-yoga-premium", name: "Tapis de Yoga Premium 6mm", price: 16000, image: "🧘", category: "Yoga", isNew: true },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount] = useState(3);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const { currency, toggleCurrency, formatPrice } = useCurrency();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % defaultSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border/30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-gradient">Jogga</span>
              <span className="text-text">Store</span>
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Currency switcher */}
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-surface border border-border/50 hover:border-primary/30 transition-colors"
            >
              <DollarSign size={14} className="text-accent" />
              <span className="text-xs font-bold text-text">{currency}</span>
            </button>
            <Link href="/search" className="p-2.5 rounded-xl bg-surface border border-border/50 hover:border-primary/30 transition-colors">
              <Search size={18} className="text-text-muted" />
            </Link>
            <Link href="/cart" className="p-2.5 rounded-xl bg-surface border border-border/50 hover:border-primary/30 transition-colors relative">
              <ShoppingCart size={18} className="text-text-muted" />
              {cartCount > 0 && <span className="badge absolute -top-1 -right-1">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <div className="relative h-52 mx-4 mt-4 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-br ${defaultSlides[currentSlide].color} p-6 flex items-center`}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <span className="text-white/60 text-[10px] font-semibold uppercase tracking-[0.2em]">
                {defaultSlides[currentSlide].subtitle}
              </span>
              <h2 className="text-white text-2xl font-bold mt-1.5 leading-tight">
                {defaultSlides[currentSlide].title}
              </h2>
              <button className="mt-3 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 hover:bg-white/25 transition-all border border-white/10">
                {defaultSlides[currentSlide].cta}
                <ChevronRight size={13} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-3 right-4 flex gap-1.5 z-20">
          {defaultSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentSlide ? "bg-white w-6" : "bg-white/30 w-1.5"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories intelligentes */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Catégories</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <button
                onClick={() => setExpandedCat(expandedCat === cat.slug ? null : cat.slug)}
                className="w-full glass rounded-2xl p-4 text-left hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-text">{cat.name}</span>
                    <span className="text-[10px] text-text-muted block mt-0.5">
                      {cat.subs.length} sous-catégories
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`text-text-muted transition-transform duration-200 ${
                      expandedCat === cat.slug ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </button>
              <AnimatePresence>
                {expandedCat === cat.slug && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-4">
                      {cat.subs.map((sub) => (
                        <Link
                          key={sub}
                          href={`/?category=${cat.slug}&sub=${sub.toLowerCase()}`}
                          className="text-[10px] font-medium text-text-muted bg-surface border border-border/30 px-2.5 py-1.5 rounded-full hover:border-primary/40 hover:text-primary transition-all"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Produits */}
      <div className="px-4 mt-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Pour vous</h3>
          <Link href="/search" className="text-xs font-medium text-primary hover:text-primary-glow transition-colors">
            Tout voir →
          </Link>
        </div>
        <div className="space-y-3">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/${product.slug}`}>
                <div className="group glass-strong rounded-2xl p-3 flex gap-4 hover:border-primary/20 hover:glow-primary transition-all duration-300">
                  {/* Image */}
                  <div className="w-24 h-24 bg-surface-light rounded-xl flex items-center justify-center text-4xl shrink-0 relative overflow-hidden">
                    {product.image}
                    {product.isNew && (
                      <span className="absolute top-1.5 left-1.5 bg-accent text-bg text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[9px] font-semibold text-primary uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h3 className="text-sm font-semibold text-text mt-0.5 leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-accent">
                        {formatPrice(product.price)}
                      </span>
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                        <ShoppingCart size={14} />
                      </span>
                    </div>
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
