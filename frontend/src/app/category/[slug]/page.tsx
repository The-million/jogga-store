"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/lib/CurrencyContext";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { api, ApiProduct, ApiCategory } from "@/lib/api";

const GRADIENTS: Record<string, string> = {
  "electronique": "from-slate-700 to-slate-900",
  "mode-homme": "from-blue-700 to-indigo-900",
  "mode-femme": "from-rose-500 to-pink-700",
  "maison": "from-amber-600 to-orange-700",
  "sport": "from-emerald-600 to-teal-800",
  "beaute": "from-purple-500 to-fuchsia-700",
};

const HERO_IMAGES: Record<string, string> = {
  "electronique": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&fit=crop",
  "mode-homme": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80&fit=crop",
  "mode-femme": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&fit=crop",
  "maison": "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80&fit=crop",
  "sport": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&fit=crop",
  "beaute": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&fit=crop",
};

type SubCat = { label: string; keywords: string[] };

const SUBCATEGORIES: Record<string, SubCat[]> = {
  "mode-homme": [
    { label: "Tout", keywords: [] },
    { label: "Polos", keywords: ["polo"] },
    { label: "Jeans", keywords: ["jean"] },
    { label: "Blazers", keywords: ["blazer", "veste"] },
    { label: "Chemises", keywords: ["chemise", "oxford"] },
    { label: "Chaussures", keywords: ["sneakers", "chaussure"] },
    { label: "Shorts", keywords: ["short"] },
    { label: "Sacs", keywords: ["sac"] },
    { label: "Ceintures", keywords: ["ceinture"] },
  ],
  "mode-femme": [
    { label: "Tout", keywords: [] },
    { label: "Robes", keywords: ["robe"] },
    { label: "Sacs", keywords: ["sac", "cabas", "pochette", "clutch"] },
    { label: "Tenues", keywords: ["boubou", "ensemble", "pagne"] },
    { label: "Chaussures", keywords: ["sandales", "sneakers", "plateforme"] },
    { label: "Lunettes", keywords: ["lunettes"] },
    { label: "Foulards", keywords: ["foulard"] },
    { label: "Jupes", keywords: ["jupe"] },
  ],
  "electronique": [
    { label: "Tout", keywords: [] },
    { label: "Audio", keywords: ["écouteurs", "casque", "enceinte"] },
    { label: "Montres", keywords: ["montre"] },
    { label: "Batteries", keywords: ["batterie", "chargeur", "power"] },
    { label: "Tablettes", keywords: ["tablette"] },
    { label: "Accessoires", keywords: ["câble", "webcam", "souris", "gimbal", "stabilisateur", "lampe"] },
  ],
  "maison": [
    { label: "Tout", keywords: [] },
    { label: "Bougies", keywords: ["bougie"] },
    { label: "Coussins", keywords: ["coussin"] },
    { label: "Déco", keywords: ["vase", "miroir", "tableau", "figurine"] },
    { label: "Plantes", keywords: ["plante", "pot"] },
    { label: "Cuisine", keywords: ["cuisine", "bambou", "organisateur"] },
  ],
  "sport": [
    { label: "Tout", keywords: [] },
    { label: "Yoga", keywords: ["yoga", "tapis"] },
    { label: "Running", keywords: ["running", "chaussures"] },
    { label: "Musculation", keywords: ["haltère", "bande", "résistance", "corde"] },
    { label: "Accessoires", keywords: ["gourde", "sac"] },
  ],
  "beaute": [
    { label: "Tout", keywords: [] },
    { label: "Corps", keywords: ["karité", "crème", "hydratante"] },
    { label: "Visage", keywords: ["sérum", "vitamine", "brosse", "nettoyant"] },
    { label: "Cheveux", keywords: ["cheveux", "masque cheveux"] },
    { label: "Maquillage", keywords: ["maquillage", "palette"] },
    { label: "Parfums", keywords: ["parfum", "coffret"] },
  ],
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [category, setCategory] = useState<ApiCategory | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState("Tout");

  useEffect(() => {
    setLoading(true);
    setActiveSub("Tout");
    Promise.all([
      api.get<ApiCategory>(`/categories/${slug}`).catch(() => null),
      api.get<ApiProduct[]>(`/products?category=${slug}`).catch(() => [] as ApiProduct[]),
    ]).then(([cat, prods]) => {
      setCategory(cat);
      setProducts(Array.isArray(prods) ? prods : []);
    }).finally(() => setLoading(false));
  }, [slug]);

  const subCats = SUBCATEGORIES[slug] ?? [];

  const filteredProducts = (() => {
    if (!subCats.length || activeSub === "Tout") return products;
    const found = subCats.find((s) => s.label === activeSub);
    if (!found || found.keywords.length === 0) return products;
    return products.filter((p) =>
      found.keywords.some((kw) => p.name.toLowerCase().includes(kw.toLowerCase()))
    );
  })();

  const handleQuickAdd = async (e: React.MouseEvent, product: ApiProduct) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push(`/auth/login`); return; }
    if (addingId) return;
    setAddingId(product.id);
    try { await addItem(product.id, 1); } catch { /* ignore */ } finally { setAddingId(null); }
  };

  const gradient = GRADIENTS[slug] ?? "from-primary to-primary-light";
  const heroImage = HERO_IMAGES[slug];
  const title = category?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      {/* Hero catégorie */}
      <div className={`relative bg-gradient-to-br ${gradient} text-white`}>
        <div className="px-4 py-3 flex items-center gap-3 relative z-10">
          <Link href="/" className="p-1.5 -ml-1.5 text-white">
            <ArrowLeft size={21} />
          </Link>
          <h1 className="font-bebas text-xl tracking-widest">{title.toUpperCase()}</h1>
        </div>
        {heroImage && (
          <div className="h-32 overflow-hidden relative">
            <img src={heroImage} alt={title} className="w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-3 left-4">
              <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">
                {products.length} article{products.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sous-catégories */}
      {subCats.length > 0 && (
        <div className="bg-white border-b border-border sticky top-0 z-30">
          <div className="flex gap-0 overflow-x-auto hide-scrollbar">
            {subCats.map((sub) => (
              <button
                key={sub.label}
                onClick={() => setActiveSub(sub.label)}
                className={`relative shrink-0 px-4 py-3 text-[11px] font-bold whitespace-nowrap transition-colors ${
                  activeSub === sub.label ? "text-primary" : "text-text-muted"
                }`}
              >
                {sub.label}
                {activeSub === sub.label && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        {loading && (
          <div className="grid grid-cols-2 gap-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-surface rounded-2xl aspect-[3/4]" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-3 bg-surface rounded w-4/5" />
                  <div className="h-3 bg-surface rounded w-2/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag size={40} className="mx-auto text-text-light mb-3" />
            <p className="text-sm text-text-muted mb-1">
              {activeSub !== "Tout" ? `Aucun article dans "${activeSub}"` : "Aucun produit dans cette catégorie"}
            </p>
            {activeSub !== "Tout" ? (
              <button onClick={() => setActiveSub("Tout")} className="text-primary font-bold text-sm">
                Voir tout
              </button>
            ) : (
              <Link href="/" className="text-primary font-bold text-sm">Retour à l'accueil</Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          {!loading && filteredProducts.map((product, i) => {
            const hasDiscount = product.comparePrice && Number(product.comparePrice) > Number(product.price);
            const discountPct = hasDiscount
              ? Math.round((1 - Number(product.price) / Number(product.comparePrice!)) * 100)
              : 0;
            const isAdding = addingId === product.id;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/${product.slug}`} className="block group no-underline">
                  <div className="relative bg-surface rounded-2xl overflow-hidden aspect-[3/4]">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl bg-white">🛍️</div>
                    )}
                    {hasDiscount && (
                      <span className="badge-discount absolute top-2 right-2">-{discountPct}%</span>
                    )}
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                    >
                      {isAdding ? (
                        <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <Plus size={14} className="text-primary" />
                      )}
                    </button>
                  </div>
                  <div className="pt-2.5 px-0.5">
                    <h3 className="text-xs font-semibold text-text line-clamp-2 leading-snug mb-1.5">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-primary price-tag">
                        {formatPrice(Number(product.price))}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] text-text-light line-through">
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
    </div>
  );
}
