"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/lib/CurrencyContext";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { api, ApiProduct } from "@/lib/api";

function productEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("écouteur") || lower.includes("casque")) return "🎧";
  if (lower.includes("montre")) return "⌚";
  if (lower.includes("sac")) return "🎒";
  if (lower.includes("lampe") || lower.includes("led")) return "💡";
  if (lower.includes("power") || lower.includes("batterie")) return "🔋";
  if (lower.includes("enceinte") || lower.includes("speaker")) return "🔊";
  if (lower.includes("yoga") || lower.includes("tapis")) return "🧘";
  if (lower.includes("gourde") || lower.includes("bouteille")) return "🍶";
  return "🛍️";
}

function getBadge(p: ApiProduct): string | null {
  if (p.stockQuantity < 5) return "Limité";
  if (p.comparePrice && Number(p.comparePrice) > Number(p.price)) {
    const discount = Math.round((1 - Number(p.price) / Number(p.comparePrice)) * 100);
    if (discount >= 30) return "Best Seller";
  }
  return null;
}

export function ProductGrid() {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    api.get<ApiProduct[]>("/products")
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleQuickAdd = async (e: React.MouseEvent, product: ApiProduct) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push(`/auth/login?redirect=/`); return; }
    if (addingId) return;
    setAddingId(product.id);
    try {
      await addItem(product.id, 1);
      setAddedId(product.id);
      setTimeout(() => setAddedId(null), 1500);
    } catch {
      // silently ignore
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="section-title">MEILLEURES VENTES</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-200 rounded-3xl aspect-[3/4]" />
              <div className="mt-2 space-y-1.5 px-1">
                <div className="h-3 bg-slate-200 rounded w-4/5" />
                <div className="h-3 bg-slate-200 rounded w-2/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-surface px-4 pt-4 pb-4 text-center py-12">
        <p className="text-text-muted text-sm">Aucun produit disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="bg-surface px-4 pt-4 pb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="section-title">MEILLEURES VENTES</span>
        <Link href="/search" className="text-[11px] font-bold text-primary no-underline">Tout voir →</Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {products.map((product, i) => {
          const badge = getBadge(product);
          const emoji = productEmoji(product.name);
          const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);
          const discountPct = hasDiscount
            ? Math.round((1 - Number(product.price) / Number(product.comparePrice!)) * 100)
            : 0;
          const isAdding = addingId === product.id;
          const isAdded = addedId === product.id;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/${product.slug}`} className="block group">
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  {badge && (
                    <span className="absolute top-3 left-3 z-10 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-accent text-white">
                      {badge}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="badge-discount absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold">
                      -{discountPct}%
                    </span>
                  )}

                  {/* Quick add button */}
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className={`absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${
                      isAdded
                        ? "bg-green-500 opacity-100"
                        : "bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isAdding ? (
                      <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : isAdded ? (
                      <span className="text-white text-xs font-black">✓</span>
                    ) : (
                      <Plus size={14} className="text-primary" />
                    )}
                  </button>

                  {product.imageUrl ? (
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] flex items-center justify-center text-5xl bg-gradient-to-b from-slate-50 to-white p-6">
                      {emoji}
                    </div>
                  )}
                </div>

                <div className="px-1 pt-2.5">
                  <h3 className="text-xs font-semibold text-text leading-snug line-clamp-2 mb-1.5">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-1.5">
                    <Star size={10} className="text-star fill-star" />
                    <span className="text-[10px] font-bold text-text">4.8</span>
                    <span className="text-[9px] text-text-light">({product.stockQuantity}+)</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="price-tag text-sm text-primary">{formatPrice(Number(product.price))}</span>
                    {hasDiscount && (
                      <span className="text-[11px] text-text-light line-through font-medium">
                        {formatPrice(Number(product.comparePrice))}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
