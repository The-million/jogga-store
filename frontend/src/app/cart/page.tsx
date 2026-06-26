"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle2, ShoppingBag, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/lib/CurrencyContext";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { api, ApiOrder } from "@/lib/api";

export default function CartPage() {
  const { formatPrice } = useCurrency();
  const { cart, loading, updateItem, removeItem, refreshCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [paymentMode, setPaymentMode] = useState<"cash" | "mobile_money">("cash");
  const [address, setAddress] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ApiOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-dvh flex items-center justify-center">
        <div className="text-center px-8">
          <ShoppingBag size={48} className="mx-auto text-text-light mb-4" />
          <p className="text-sm font-bold text-text mb-1">Connexion requise</p>
          <p className="text-xs text-text-muted mb-5">Connectez-vous pour voir votre panier</p>
          <Link href="/auth/login?redirect=/cart" className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-bold no-underline">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-dvh flex items-center justify-center">
        <div className="text-center px-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
          </motion.div>
          <h2 className="text-lg font-black text-text mb-2">Commande confirmée !</h2>
          <p className="text-sm font-mono text-text-muted mb-1">{confirmedOrder.orderNumber}</p>
          <p className="text-xs text-text-muted mb-6">Livraison prévue sous 24h</p>
          <div className="flex gap-3">
            <Link href="/orders" className="flex-1 bg-primary text-white py-3 rounded-2xl text-sm font-bold text-center no-underline">
              Mes commandes
            </Link>
            <Link href="/" className="flex-1 bg-surface text-text py-3 rounded-2xl text-sm font-bold text-center no-underline">
              Continuer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const subtotal = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 5000;

  const handleUpdateQty = async (itemId: string, delta: number, currentQty: number) => {
    const newQty = Math.max(1, currentQty + delta);
    await updateItem(itemId, newQty);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setError(null);
    setCheckingOut(true);
    try {
      const order = await api.post<ApiOrder>("/orders/checkout", {
        paymentMode,
        address: address.trim() || undefined,
      });
      await refreshCart();
      setConfirmedOrder(order);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la commande");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading && !cart) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-dvh">
        <header className="sticky top-0 z-40 bg-white border-b border-border">
          <div className="px-4 py-3 flex items-center gap-3">
            <Link href="/" className="p-1.5 -ml-1.5"><ArrowLeft size={21} /></Link>
            <h1 className="text-sm font-black text-text uppercase tracking-wider">Mon Panier</h1>
          </div>
        </header>
        <div className="p-4 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-surface rounded-2xl p-3 flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1.5 -ml-1.5"><ArrowLeft size={21} /></button>
          <h1 className="text-sm font-black text-text uppercase tracking-wider">Mon Panier</h1>
          <span className="text-xs text-text-muted ml-auto">{items.length} article{items.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      <div className="p-4 space-y-3">
        {items.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag size={40} className="mx-auto text-text-light mb-3" />
            <p className="text-text-muted text-sm">Votre panier est vide</p>
            <Link href="/" className="text-primary font-bold text-sm mt-2 inline-block">Parcourir le catalogue</Link>
          </div>
        )}

        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-surface rounded-2xl p-3 flex items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
              {item.product.imageUrl ? (
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                "🛍️"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-text line-clamp-2">{item.product.name}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold text-primary">{formatPrice(Number(item.product.price))}</span>
                {item.product.comparePrice && (
                  <span className="text-[10px] text-text-light line-through">{formatPrice(Number(item.product.comparePrice))}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white rounded-xl p-1">
              <button onClick={() => handleUpdateQty(item.id, -1, item.quantity)} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:bg-slate-50">
                <Minus size={13} />
              </button>
              <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
              <button onClick={() => handleUpdateQty(item.id, 1, item.quantity)} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:bg-slate-50">
                <Plus size={13} />
              </button>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-text-light hover:text-red-500 p-1">
              <Trash2 size={15} />
            </button>
          </motion.div>
        ))}

        {items.length > 0 && (
          <>
            {/* Adresse livraison */}
            <div className="bg-surface rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-primary" />
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Adresse de livraison</p>
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Quartier, rue, repère… (optionnel)"
                className="w-full bg-white border border-slate-100 rounded-xl py-2.5 px-3 text-xs text-text placeholder:text-text-light outline-none focus:border-primary/30 transition-all"
              />
            </div>

            {/* Récapitulatif */}
            <div className="bg-surface rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-xs"><span className="text-text-muted">Sous-total</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Livraison</span>
                <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                  {shipping === 0 ? "Offerte" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-border">
                <span>TOTAL</span><span className="text-primary">{formatPrice(subtotal + shipping)}</span>
              </div>
            </div>

            {/* Mode de paiement */}
            <div className="bg-surface rounded-2xl p-4">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Mode de paiement</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentMode("cash")}
                  className={`flex-1 border-2 rounded-xl py-2.5 text-xs font-bold transition-colors ${paymentMode === "cash" ? "border-primary bg-white text-primary" : "border-border bg-white text-text-muted"}`}
                >
                  Cash à la livraison
                </button>
                <button
                  onClick={() => setPaymentMode("mobile_money")}
                  className={`flex-1 border-2 rounded-xl py-2.5 text-xs font-bold transition-colors ${paymentMode === "mobile_money" ? "border-primary bg-white text-primary" : "border-border bg-white text-text-muted"}`}
                >
                  Mobile Money
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-semibold text-center">{error}</p>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {checkingOut ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Validation...
                </>
              ) : (
                `Commander • ${formatPrice(subtotal + shipping)}`
              )}
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
