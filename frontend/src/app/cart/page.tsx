"use client";

import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const items = [
    { id: "1", name: "Écouteurs Bluetooth Pro", price: 15000, qty: 2, image: "🎧" },
    { id: "2", name: "Montre Connectée Sport", price: 25000, qty: 1, image: "⌚" },
  ];
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="max-w-md mx-auto px-4 pt-4">
      <header className="flex items-center gap-3 mb-6">
        <Link href="/" className="glass p-2.5 rounded-xl">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-text">Mon Panier</h1>
        <span className="text-sm text-text-muted ml-auto">{items.length} article{items.length > 1 ? "s" : ""}</span>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={48} className="mx-auto text-text-muted/30 mb-4" />
          <p className="text-text-muted">Votre panier est vide</p>
          <Link href="/" className="text-primary font-medium mt-2 inline-block">Parcourir le catalogue</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-strong p-4 flex items-center gap-3"
              >
                <div className="w-14 h-14 bg-cream rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-text truncate">{item.name}</h3>
                  <p className="text-sm font-bold text-primary mt-0.5">{item.price.toLocaleString()} FC</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="glass p-1.5 rounded-lg text-text-muted hover:text-primary transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                  <button className="glass p-1.5 rounded-lg text-text-muted hover:text-primary transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button className="text-text-muted/30 hover:text-red-500 transition-colors ml-2">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <div className="glass-strong p-4 mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Sous-total</span>
              <span className="font-medium">{total.toLocaleString()} FC</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Livraison</span>
              <span className="text-sage font-medium">Offerte</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-primary/5">
              <span>Total</span>
              <span className="text-primary">{total.toLocaleString()} FC</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-semibold text-base shadow-lg shadow-primary/20"
          >
            Commander • {total.toLocaleString()} FC
          </motion.button>
        </>
      )}
    </div>
  );
}
