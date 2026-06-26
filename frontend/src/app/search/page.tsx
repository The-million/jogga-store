"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, ArrowLeft, Clock, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCurrency } from "@/lib/CurrencyContext";

const allProducts = [
  { id: "1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro ANC", price: 15000, oldPrice: 25000, image: "🎧", category: "electronique", isNew: true },
  { id: "2", slug: "montre-connectee-sport", name: "Montre Connectée Sport IP68", price: 25000, oldPrice: 35000, image: "⌚", category: "electronique" },
  { id: "3", slug: "sac-a-dos-urbain", name: "Sac à Dos Urbain Premium", price: 18000, image: "🎒", category: "sacs", isNew: true },
  { id: "4", slug: "lampe-led-decorative", name: "Lampe LED Ambiance RGB", price: 12000, oldPrice: 18000, image: "💡", category: "maison" },
  { id: "5", slug: "batterie-externe", name: "Power Bank 20000mAh", price: 22000, image: "🔋", category: "electronique" },
  { id: "6", slug: "enceinte-portable", name: "Enceinte Bluetooth Étanche", price: 35000, oldPrice: 45000, image: "🔊", category: "electronique", isNew: true },
  { id: "7", slug: "tapis-yoga", name: "Tapis de Yoga Premium", price: 16000, image: "🧘", category: "sport" },
  { id: "8", slug: "gourde-isotherme", name: "Gourde Isotherme 750ml", price: 9000, oldPrice: 14000, image: "🍶", category: "sport" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "1";
  const category = searchParams.get("category");
  const [query, setQuery] = useState(isNew ? "Nouveautés" : category || "");
  const { formatPrice } = useCurrency();

  let results = allProducts;
  if (isNew) results = allProducts.filter((p) => p.isNew);
  else if (category === "tendances" || category === "promos" || category === "best-sellers" || category === "marques") results = allProducts;
  else if (category) results = allProducts.filter((p) => p.category === category);
  else if (query) results = allProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-1.5 -ml-1.5"><ArrowLeft size={21} /></Link>
          <div className="flex-1 flex items-center gap-2 bg-surface rounded-xl px-4 py-2.5">
            <Search size={16} className="text-text-muted" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit..." className="flex-1 bg-transparent text-sm outline-none"
              autoFocus={!isNew && !category} />
          </div>
        </div>
      </header>
      <div className="p-4">
        {(isNew || category) && (
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-primary" />
            <h2 className="text-sm font-black text-text uppercase">
              {isNew ? "Nouveautés" : category === "tendances" ? "Tendances" : category === "promos" ? "Super Offres" : category === "best-sellers" ? "Meilleures Ventes" : category === "marques" ? "Zone Marques" : category}
            </h2>
          </div>
        )}
        {!query && !isNew && !category && (
          <div>
            <div className="flex items-center gap-2 mb-3"><Clock size={14} className="text-text-muted" /><span className="text-xs text-text-muted font-semibold uppercase">Récentes</span></div>
            <div className="space-y-1 mb-6">
              {["écouteurs", "montre", "batterie"].map((q) => (
                <button key={q} onClick={() => setQuery(q)} className="w-full text-left p-3 rounded-xl bg-surface text-sm font-medium">{q}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-3"><TrendingUp size={14} className="text-accent" /><span className="text-xs text-text-muted font-semibold uppercase">Tendances</span></div>
            <div className="flex flex-wrap gap-2">
              {["enceinte", "lampe LED", "gourde", "tapis yoga", "sac à dos"].map((t) => (
                <button key={t} onClick={() => setQuery(t)} className="bg-surface px-3 py-1.5 rounded-full text-xs text-text-muted font-medium">{t}</button>
              ))}
            </div>
          </div>
        )}
        {(query || isNew || category) && (
          <div className="grid grid-cols-2 gap-2.5">
            {results.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/${product.slug}`} className="block bg-surface rounded-xl overflow-hidden">
                  <div className="relative aspect-[3/4] flex items-center justify-center text-5xl">
                    {product.image}
                    {product.isNew && <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded">NEW</span>}
                    {product.oldPrice && <span className="badge-discount absolute top-2 right-2">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
                  </div>
                  <div className="p-2.5">
                    <h3 className="text-[11px] font-semibold text-text line-clamp-2 leading-snug mb-1">{product.name}</h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-bold text-primary">{formatPrice(product.price)}</span>
                      {product.oldPrice && <span className="text-[10px] text-text-light line-through">{formatPrice(product.oldPrice)}</span>}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        {results.length === 0 && query && (
          <div className="text-center py-16"><Search size={40} className="mx-auto text-text-light mb-3" /><p className="text-text-muted font-medium">Aucun résultat pour &quot;{query}&quot;</p></div>
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
