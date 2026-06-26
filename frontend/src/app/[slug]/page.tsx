"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ShoppingCart, Truck, Shield } from "lucide-react";

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();

  // Mock — sera remplacé par fetch API
  const product = {
    name: "Écouteurs Bluetooth Pro",
    price: 15000,
    stock: 23,
    rating: 4.5,
    reviews: 128,
    description: "Écouteurs sans fil Bluetooth 5.3 avec réduction de bruit active. Autonomie 8h, étui de charge inclus. Design ergonomique pour un confort optimal.",
    images: ["🎧", "🎵", "📦"],
    category: "Électronique",
    features: ["Bluetooth 5.3", "Réduction de bruit ANC", "Autonomie 8h", "Étanchéité IPX5", "Micro intégré"],
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Image header */}
      <div className="relative bg-primary/5 h-72 flex items-center justify-center">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 glass p-2.5 rounded-xl z-10"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-7xl">{product.images[0]}</div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="glass-strong p-5 space-y-4">
          <div>
            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-xl font-bold text-text mt-2">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-text-muted/20"}
                  />
                ))}
              </div>
              <span className="text-sm text-text-muted">({product.reviews} avis)</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-2xl font-bold text-primary">
              {product.price.toLocaleString()} FC
            </span>
            <span className="text-sm text-sage font-medium">
              {product.stock} en stock — Livraison 24h
            </span>
          </div>

          <p className="text-sm text-text-muted leading-relaxed">
            {product.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {product.features.map((f) => (
              <span key={f} className="text-xs bg-cream px-3 py-1.5 rounded-full text-text-muted">
                {f}
              </span>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex gap-4 pt-2 border-t border-primary/5">
            <div className="flex items-center gap-1.5 text-xs text-sage">
              <Truck size={14} />
              Livraison 24h
            </div>
            <div className="flex items-center gap-1.5 text-xs text-sage">
              <Shield size={14} />
              Qualité garantie
            </div>
          </div>
        </div>

        {/* Add to cart button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <ShoppingCart size={20} />
          Ajouter au panier
        </motion.button>
      </div>
    </div>
  );
}
