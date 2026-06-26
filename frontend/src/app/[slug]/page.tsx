"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Truck, Shield, Minus, Plus, Share2 } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";

export default function ProductPage() {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const { formatPrice } = useCurrency();

  const product = {
    name: "Écouteurs Bluetooth Pro ANC",
    price: 15000,
    stock: 23,
    description: "Son immersif avec réduction de bruit active. Bluetooth 5.3, autonomie 8h. Design ergonomique, étui de charge magnétique inclus.",
    images: ["🎧", "🎵", "📦"],
    category: "Audio",
    features: ["Bluetooth 5.3", "ANC actif", "8h autonomie", "IPX5", "Micro HD"],
    colors: ["Midnight", "Cloud", "Ocean"],
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-border/30">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-surface transition-colors">
            <ArrowLeft size={20} />
          </button>
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.2em]">{product.category}</span>
          <button className="p-2 rounded-xl hover:bg-surface transition-colors">
            <Share2 size={18} className="text-text-muted" />
          </button>
        </div>
      </header>

      {/* Image */}
      <div className="relative h-80 bg-surface flex items-center justify-center">
        <motion.div key={selectedImage} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="text-8xl">
          {product.images[selectedImage]}
        </motion.div>
        <div className="absolute bottom-3 flex gap-2">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                i === selectedImage ? "bg-surface-light border-2 border-primary scale-110 shadow-lg" : "bg-surface/60 border border-border/30"
              }`}
            >
              {img}
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 mt-4 space-y-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-text leading-tight">{product.name}</h1>
              <p className="text-xs text-text-muted mt-1">{product.stock > 10 ? "En stock" : `+${product.stock}`} · Livraison 24h</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-accent">{formatPrice(product.price)}</span>
              {product.stock < 10 && (
                <span className="block text-[10px] text-accent font-semibold mt-0.5">🔥 Presque épuisé</span>
              )}
            </div>
          </div>
        </div>

        {/* Couleurs */}
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Couleur</span>
          <div className="flex gap-2 mt-2">
            {product.colors.map((color, i) => (
              <button
                key={color}
                onClick={() => setSelectedColor(i)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  i === selectedColor ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface border border-border/30 text-text-muted hover:border-primary/30"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-2">
          {product.features.map((f) => (
            <span key={f} className="text-[10px] font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/10">
              {f}
            </span>
          ))}
        </div>

        <p className="text-sm text-text-muted leading-relaxed bg-surface rounded-2xl p-4 border border-border/30">{product.description}</p>

        <div className="flex gap-3">
          <div className="flex-1 bg-surface rounded-2xl p-3 flex items-center gap-2 border border-border/30">
            <Truck size={16} className="text-secondary" />
            <span className="text-xs text-secondary font-semibold">Livraison 24h</span>
          </div>
          <div className="flex-1 bg-surface rounded-2xl p-3 flex items-center gap-2 border border-border/30">
            <Shield size={16} className="text-secondary" />
            <span className="text-xs text-secondary font-semibold">Garantie 1 an</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 bg-bg/90 backdrop-blur-xl border-t border-border/30 p-4 flex items-center gap-3 mt-6">
        <div className="flex items-center gap-1.5 bg-surface rounded-2xl p-1 border border-border/30">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-light transition-colors">
            <Minus size={15} />
          </button>
          <span className="w-8 text-center text-sm font-bold">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-light transition-colors">
            <Plus size={15} />
          </button>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 glow-primary"
        >
          <ShoppingCart size={17} />
          Ajouter · {formatPrice(product.price * qty)}
        </motion.button>
      </div>
    </div>
  );
}
