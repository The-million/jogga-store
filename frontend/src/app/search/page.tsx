"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCurrency } from "@/lib/CurrencyContext";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { api, ApiProduct } from "@/lib/api";

const TRENDING = ["écouteurs", "montre", "batterie", "enceinte", "yoga"];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { user } = useAuth();

  const isNew = searchParams.get("new") === "1";
  const categoryParam = searchParams.get("category");
  const [query, setQuery] = useState(isNew ? "" : categoryParam ?? "");
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    api.get<ApiProduct[]>("/products")
      .then(setAllProducts)
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleQuickAdd = async (e: React.MouseEvent, product: ApiProduct) => {
    e.preventDefault();
    if (!user) { router.push(`/auth/login?redirect=/search`); return; }
    if (addingId) return;
    setAddingId(product.id);
    try { await addItem(product.id, 1); } catch { /* ignore */ } finally { setAddingId(null); }
  };

  let results = allProducts;
  if (query) {
    results = allProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  const showSearch = !isNew || query;

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-1.5 -ml-1.5"><ArrowLeft size={21} /></Link>
          <div className="flex-1 flex items-center gap-2 bg-surface rounded-xl px-4 py-2.5">
            <Search size={16} className="text-text-muted" />
            <input
              type="text" value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="flex-1 bg-transparent text-sm outline-none"
              autoFocus={!isNew}
            />
          </div>
        </div>
      </header>

      <div className="p-4">
        {isNew && !query && (
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-black text-text uppercase tracking-wider">✨ Nouveautés</h2>
          </div>
        )}

        {!query && !isNew && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-accent" />
              <span className="text-xs text-text-muted font-semibold uppercase">Tendances</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((t) => (
                <button key={t} onClick={() => setQuery(t)} className="bg-surface px-3 py-1.5 rounded-full text-xs text-text-muted font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-surface rounded-xl aspect-[3/4]" />
            ))}
          </div>
        )}

        {!loading && (query || isNew) && (
          <>
            {results.length === 0 && (
              <div className="text-center py-16">
                <Search size={40} className="mx-auto text-text-light mb-3" />
                <p className="text-text-muted font-medium">Aucun résultat{query ? ` pour "${query}"` : ""}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              {results.map((product, i) => {
                const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);
                const discountPct = hasDiscount ? Math.round((1 - Number(product.price) / Number(product.comparePrice!)) * 100) : 0;
                return (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link href={`/${product.slug}`} className="block bg-surface rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl bg-white">🛍️</div>
                        )}
                        {hasDiscount && (
                          <span className="badge-discount absolute top-2 right-2">-{discountPct}%</span>
                        )}
                      </div>
                      <div className="p-2.5">
                        <h3 className="text-[11px] font-semibold text-text line-clamp-2 leading-snug mb-1">{product.name}</h3>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-primary">{formatPrice(Number(product.price))}</span>
                          {hasDiscount && <span className="text-[10px] text-text-light line-through">{formatPrice(Number(product.comparePrice))}</span>}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto p-8 text-center text-text-muted">Chargement...</div>}>
      <SearchContent />
    </Suspense>
  );
}
