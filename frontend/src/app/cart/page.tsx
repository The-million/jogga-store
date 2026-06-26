"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

export default function CartPage() {
  const { formatPrice } = useCurrency();
  const [items, setItems] = useState([
    { id: "1", name: "Écouteurs Bluetooth Pro ANC", price: 12000, oldPrice: 25000, qty: 2, image: "🎧" },
    { id: "2", name: "Montre Connectée Sport", price: 18000, oldPrice: 35000, qty: 1, image: "⌚" },
  ]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const updateQty = (id: string, delta: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 50000 ? 0 : 5000;

  const handleCheckout = () => {
    // Simuler une commande — normalement appel API POST /orders/checkout
    const num = `JOGGA-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setOrderNumber(num);
    setOrderPlaced(true);
    setItems([]);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-dvh flex items-center justify-center">
        <div className="text-center px-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
          </motion.div>
          <h2 className="text-lg font-black text-text mb-2">Commande confirmée !</h2>
          <p className="text-sm text-text-muted mb-1">N° {orderNumber}</p>
          <p className="text-xs text-text-muted mb-6">Livraison prévue sous 24h</p>
          <div className="flex gap-3">
            <Link href="/orders" className="flex-1 bg-primary text-white py-3 rounded-2xl text-sm font-bold no-underline">
              Voir mes commandes
            </Link>
            <Link href="/" className="flex-1 bg-surface text-text py-3 rounded-2xl text-sm font-bold no-underline">
              Continuer le shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-1.5 -ml-1.5"><ArrowLeft size={21} /></Link>
          <h1 className="text-sm font-black text-text uppercase tracking-wider">Mon Panier</h1>
          <span className="text-xs text-text-muted ml-auto">{items.length} article{items.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      <div className="p-4 space-y-3">
        {items.length === 0 && !orderPlaced && (
          <div className="text-center py-20">
            <p className="text-text-muted">Votre panier est vide</p>
            <Link href="/" className="text-primary font-bold text-sm mt-2 inline-block">Parcourir le catalogue</Link>
          </div>
        )}

        {items.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-2xl p-3 flex items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-2xl shrink-0">{item.image}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-semibold text-text truncate">{item.name}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold text-primary">{formatPrice(item.price)}</span>
                {item.oldPrice && <span className="text-[10px] text-text-light line-through">{formatPrice(item.oldPrice)}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-1">
              <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted"><Minus size={13} /></button>
              <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted"><Plus size={13} /></button>
            </div>
            <button onClick={() => removeItem(item.id)} className="text-text-light hover:text-red-500"><Trash2 size={15} /></button>
          </motion.div>
        ))}

        {items.length > 0 && (
          <>
            <div className="bg-surface rounded-2xl p-4 space-y-2 mt-4">
              <div className="flex justify-between text-xs"><span className="text-text-muted">Sous-total</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-text-muted">Livraison</span>
                <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                  {shipping === 0 ? "Offerte" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-border">
                <span>TOTAL</span><span className="text-primary">{formatPrice(subtotal + shipping)}</span>
              </div>
            </div>

            {/* Payment mode selector */}
            <div className="bg-surface rounded-2xl p-4">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Mode de paiement</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-white border-2 border-primary rounded-xl py-2.5 text-xs font-bold text-primary">Cash à la livraison</button>
                <button className="flex-1 bg-white border border-border rounded-xl py-2.5 text-xs font-bold text-text-muted">Mobile Money</button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20"
            >
              Commander • {formatPrice(subtotal + shipping)}
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
