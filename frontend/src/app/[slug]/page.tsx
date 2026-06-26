"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Truck, Shield, Minus, Plus, Heart } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";

export default function ProductPage() {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const { formatPrice } = useCurrency();

  const product = {
    name: "Écouteurs Bluetooth Pro ANC — Réduction de bruit active, autonomie 8h",
    price: 15000,
    oldPrice: 25000,
    stock: 23,
    sales: 234,
    description: "Son immersif avec réduction de bruit active. Bluetooth 5.3, autonomie 8h. Design ergonomique, étui de charge magnétique inclus. Résistance IPX5.",
    images: ["🎧", "🎵", "📦"],
    features: ["Bluetooth 5.3", "ANC actif", "8h autonomie", "IPX5", "Micro HD"],
    colors: ["Midnight", "Cloud", "Ocean"],
    specs: [
      { label: "Autonomie", value: "8 heures" },
      { label: "Charge", value: "USB-C, 1.5h" },
      { label: "Poids", value: "5.4g par écouteur" },
    ],
  };

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div className="max-w-md mx-auto bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1.5 -ml-1.5">
            <ArrowLeft size={21} />
          </button>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Audio</span>
          <button className="p-1.5 -mr-1.5"><Heart size={20} className="text-text-muted" /></button>
        </div>
      </header>

      {/* Image gallery */}
      <div className="relative bg-surface aspect-square flex items-center justify-center">
        <motion.div key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-8xl">
          {product.images[selectedImage]}
        </motion.div>
        {discount > 0 && <span className="badge-sale absolute top-3 left-3 text-sm px-3 py-1.5 rounded">-{discount}%</span>}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 px-4 py-3 border-b border-border">
        {product.images.map((img, i) => (
          <button key={i} onClick={() => setSelectedImage(i)}
            className={`w-14 h-14 bg-surface flex items-center justify-center text-xl ${i === selectedImage ? 'ring-2 ring-text' : ''}`}>
            {img}
          </button>
        ))}
      </div>

      {/* Product info */}
      <div className="px-4 py-4 space-y-4">
        <div>
          <h1 className="text-base font-bold text-text leading-snug">{product.name}</h1>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-black text-accent">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-sm text-text-light line-through">{formatPrice(product.oldPrice)}</span>}
            {discount > 0 && <span className="text-xs font-bold text-accent">-{discount}%</span>}
          </div>
          <p className="text-[11px] text-text-muted mt-1">{product.sales}+ vendus</p>
        </div>

        {/* Couleurs */}
        <div className="border-t border-border pt-4">
          <span className="text-xs font-bold text-text uppercase tracking-wider">Couleur: {product.colors[selectedColor]}</span>
          <div className="flex gap-2 mt-2">
            {product.colors.map((c, i) => (
              <button key={c} onClick={() => setSelectedColor(i)}
                className={`px-5 py-2.5 text-xs font-semibold border ${i === selectedColor ? 'border-text bg-text text-white' : 'border-border text-text-muted'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="border-t border-border pt-4">
          <span className="text-xs font-bold text-text uppercase tracking-wider">Spécifications</span>
          <div className="mt-2 space-y-1.5">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between text-xs">
                <span className="text-text-muted">{s.label}</span>
                <span className="font-semibold text-text">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-border pt-4">
          <span className="text-xs font-bold text-text uppercase tracking-wider">Description</span>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">{product.description}</p>
        </div>

        {/* Trust */}
        <div className="flex gap-3 border-t border-border pt-4">
          <div className="flex-1 flex items-center gap-1.5">
            <Truck size={14} className="text-success" />
            <span className="text-[11px] text-text-muted">Livraison 24h</span>
          </div>
          <div className="flex-1 flex items-center gap-1.5">
            <Shield size={14} className="text-success" />
            <span className="text-[11px] text-text-muted">Garantie 1 an</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 bg-white border-t border-border px-4 py-3 flex items-center gap-3">
        <div className="flex items-center border border-border">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-text-muted">
            <Minus size={16} />
          </button>
          <span className="w-10 text-center text-sm font-bold">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-text-muted">
            <Plus size={16} />
          </button>
        </div>
        <motion.button whileTap={{ scale: 0.98 }}
          className="flex-1 btn-primary flex items-center justify-center gap-2 rounded">
          <ShoppingCart size={17} />
          AJOUTER AU PANIER
        </motion.button>
      </div>
    </div>
  );
}
