"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, Truck, Shield, Minus, Plus, Heart, CheckCircle2 } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { api, ApiProduct } from "@/lib/api";
import { addToRecentlyViewed } from "@/lib/recentlyViewed";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get<ApiProduct>(`/products/${slug}`)
      .then((p) => {
        setProduct(p);
        addToRecentlyViewed({
          slug: p.slug,
          name: p.name,
          imageUrl: p.imageUrl,
          price: Number(p.price),
          comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        });
        // Check wishlist status if logged in
        if (user) {
          api.get<boolean>(`/wishlist/check/${p.id}`).then(setInWishlist).catch(() => {});
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, user]);

  const toggleWishlist = async () => {
    if (!user) { router.push(`/auth/login?redirect=/${slug}`); return; }
    if (!product) return;
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${product.id}`);
        setInWishlist(false);
      } else {
        await api.post("/wishlist", { productId: product.id });
        setInWishlist(true);
      }
    } catch { /* ignore */ }
    finally { setWishlistLoading(false); }
  };

  const productVariants: { name: string; values: string[] }[] = Array.isArray((product as any)?.variants)
    ? (product as any).variants
    : [];
  const allVariantsSelected = productVariants.every((v) => selectedVariants[v.name]);

  const handleAddToCart = async () => {
    if (!user) { router.push(`/auth/login?redirect=/${slug}`); return; }
    if (!product) return;
    if (!allVariantsSelected && productVariants.length > 0) {
      setAddError("Veuillez sélectionner toutes les options avant d'ajouter au panier.");
      return;
    }
    setAdding(true);
    setAddError(null);
    try {
      await addItem(product.id, qty, productVariants.length > 0 ? selectedVariants : undefined);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-dvh">
        <header className="sticky top-0 z-40 bg-white/95 border-b border-border">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => router.back()} className="p-1.5 -ml-1.5"><ArrowLeft size={21} /></button>
          </div>
        </header>
        <div className="animate-pulse">
          <div className="bg-slate-100 aspect-square" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-dvh flex items-center justify-center">
        <div className="text-center px-8">
          <p className="text-text-muted text-sm mb-4">Produit introuvable</p>
          <button onClick={() => router.back()} className="text-primary font-bold text-sm">Retour</button>
        </div>
      </div>
    );
  }

  const discount = product.comparePrice
    ? Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)
    : 0;

  return (
    <div className="max-w-md mx-auto bg-white">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1.5 -ml-1.5">
            <ArrowLeft size={21} />
          </button>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
            {product.category?.name ?? "Produit"}
          </span>
          <button
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className="p-1.5 -mr-1.5 transition-transform active:scale-90"
          >
            <Heart
              size={20}
              className={inWishlist ? "text-red-500 fill-red-500" : "text-text-muted"}
            />
          </button>
        </div>
      </header>

      {/* Image */}
      <div className="relative bg-surface aspect-square flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-8xl">🛍️</div>
        )}
        {discount > 0 && (
          <span className="badge-sale absolute top-3 left-3 text-sm px-3 py-1.5 rounded">-{discount}%</span>
        )}
      </div>

      {/* Infos */}
      <div className="px-4 py-4 space-y-4">
        <div>
          <h1 className="text-base font-bold text-text leading-snug">{product.name}</h1>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-black text-accent">{formatPrice(Number(product.price))}</span>
            {product.comparePrice && (
              <span className="text-sm text-text-light line-through">{formatPrice(Number(product.comparePrice))}</span>
            )}
            {discount > 0 && <span className="text-xs font-bold text-accent">-{discount}%</span>}
          </div>
          <p className="text-[11px] text-text-muted mt-1">
            {product.stockQuantity < 5
              ? `Plus que ${product.stockQuantity} en stock !`
              : `${product.stockQuantity} en stock`}
          </p>
        </div>

        {/* Variantes */}
        {productVariants.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            {productVariants.map((variant) => (
              <div key={variant.name}>
                <p className="text-xs font-bold text-text uppercase tracking-wider mb-2">
                  {variant.name}
                  {selectedVariants[variant.name] && (
                    <span className="ml-2 font-normal text-primary normal-case">{selectedVariants[variant.name]}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {variant.values.map((val) => {
                    const selected = selectedVariants[variant.name] === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSelectedVariants((s) => ({ ...s, [variant.name]: val }))}
                        className={`px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all ${
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-border text-text hover:border-primary/50"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {product.description && (
          <div className="border-t border-border pt-4">
            <span className="text-xs font-bold text-text uppercase tracking-wider">Description</span>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">{product.description}</p>
          </div>
        )}

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

      {addError && (
        <p className="text-xs text-red-500 font-semibold text-center px-4 pb-2">{addError}</p>
      )}

      {/* Bottom bar */}
      <div className="sticky bottom-0 bg-white border-t border-border px-4 py-3 flex items-center gap-3">
        <div className="flex items-center border border-border rounded-xl overflow-hidden">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-text-muted hover:bg-slate-50">
            <Minus size={16} />
          </button>
          <span className="w-10 text-center text-sm font-bold">{qty}</span>
          <button onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))} className="w-10 h-10 flex items-center justify-center text-text-muted hover:bg-slate-50">
            <Plus size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.button
            key={added ? "added" : "default"}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={adding || product.stockQuantity === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-60 ${
              added
                ? "bg-green-500 text-white"
                : productVariants.length > 0 && !allVariantsSelected
                ? "bg-gray-200 text-gray-500"
                : "bg-primary text-white shadow-lg shadow-primary/20"
            }`}
          >
            {added ? (
              <><CheckCircle2 size={17} /> Ajouté !</>
            ) : adding ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Ajout...</>
            ) : product.stockQuantity === 0 ? (
              "Rupture de stock"
            ) : productVariants.length > 0 && !allVariantsSelected ? (
              "Choisir les options"
            ) : (
              <><ShoppingCart size={17} /> Ajouter au panier</>
            )}
          </motion.button>
        </AnimatePresence>
      </div>
    </div>
  );
}
