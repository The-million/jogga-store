"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Truck, Shield, Minus, Plus, Share2 } from "lucide-react";

export default function ProductPage() {
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const product = {
    name: "Écouteurs Bluetooth Pro",
    price: 15000,
    stock: 23,
    description: "Écouteurs sans fil Bluetooth 5.3 avec réduction de bruit active ANC. Autonomie 8h, étui de charge inclus. Design ergonomique pour un confort optimal toute la journée.",
    images: ["🎧", "🎵", "📦"],
    category: "Électronique",
    features: ["Bluetooth 5.3", "ANC actif", "8h autonomie", "IPX5 étanche", "Micro HD"],
    colors: ["Noir", "Blanc", "Bleu"],
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div className="max-w-md mx-auto">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 glass-strong rounded-none border-b border-primary/5">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-cream transition-colors">
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
            {product.category}
          </span>
          <button className="p-2 rounded-xl hover:bg-cream transition-colors">
            <Share2 size={18} className="text-text-muted" />
          </button>
        </div>
      </header>

      {/* Image gallery */}
      <div className="relative bg-cream h-80 flex items-center justify-center">
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-8xl"
        >
          {product.images[selectedImage]}
        </motion.div>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-2 -mt-6 relative z-10">
        {product.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-200 ${
              i === selectedImage
                ? "bg-white shadow-lg scale-110 border-2 border-primary"
                : "bg-white/60 hover:bg-white"
            }`}
          >
            {img}
          </button>
        ))}
      </div>

      {/* Product info */}
      <div className="px-4 mt-4 space-y-4">
        <div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-text leading-tight">{product.name}</h1>
              <p className="text-xs text-text-muted mt-1">
                {product.stock > 10 ? "En stock" : `Plus que ${product.stock}`} · Livraison 24h
              </p>
            </div>
            <span className="text-2xl font-bold text-primary ml-3">
              {product.price.toLocaleString()}<span className="text-sm font-medium"> FC</span>
            </span>
          </div>
        </div>

        {/* Colors */}
        <div>
          <span className="text-xs font-semibold text-text uppercase tracking-wider">Couleur</span>
          <div className="flex gap-2 mt-2">
            {product.colors.map((color, i) => (
              <button
                key={color}
                onClick={() => setSelectedColor(i)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  i === selectedColor
                    ? "bg-primary text-white shadow-md"
                    : "glass hover:shadow-sm"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <span className="text-xs font-semibold text-text uppercase tracking-wider">Caractéristiques</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {product.features.map((f) => (
              <span key={f} className="text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-full font-medium">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="glass p-4 rounded-2xl">
          <p className="text-sm text-text-muted leading-relaxed">{product.description}</p>
        </div>

        {/* Trust */}
        <div className="flex gap-3">
          <div className="flex-1 glass p-3 rounded-xl flex items-center gap-2">
            <Truck size={16} className="text-sage" />
            <span className="text-xs text-sage font-medium">Livraison 24h</span>
          </div>
          <div className="flex-1 glass p-3 rounded-xl flex items-center gap-2">
            <Shield size={16} className="text-sage" />
            <span className="text-xs text-sage font-medium">Garantie 1 an</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 glass-strong border-t border-primary/5 p-4 flex items-center gap-3 mt-6">
        <div className="flex items-center gap-2 bg-cream rounded-2xl p-1">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-bold">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <ShoppingCart size={18} />
          Ajouter · {(product.price * qty).toLocaleString()} FC
        </motion.button>
      </div>
    </div>
  );
}
