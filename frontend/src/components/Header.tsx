"use client";

import { useState } from "react";
import { Menu, Search, ShoppingCart, X, DollarSign } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/lib/CurrencyContext";
import { useCart } from "@/lib/CartContext";

const menuItems = [
  { label: "Accueil", href: "/" },
  { label: "Nouveautés", href: "/search?new=1" },
  { label: "Mode Homme", href: "/category/mode-homme" },
  { label: "Mode Femme", href: "/category/mode-femme" },
  { label: "Électronique", href: "/category/electronique" },
  { label: "Maison & Déco", href: "/category/maison" },
  { label: "Sport & Fitness", href: "/category/sport" },
  { label: "Beauté & Soin", href: "/category/beaute" },
  { label: "Mon Profil", href: "/account" },
  { label: "Mes Commandes", href: "/orders" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { itemCount } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setMenuOpen(true)} className="p-1.5 -ml-1.5">
            <Menu size={22} className="text-text" />
          </button>

          <Link href="/" className="no-underline">
            <span className="font-playfair italic text-xl font-black text-primary tracking-tight">Jogga</span>
            <span className="font-bebas text-xl text-text tracking-widest ml-1">STORE</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/search" className="p-1.5">
              <Search size={20} className="text-text" />
            </Link>
            <Link href="/cart" className="p-1.5 relative">
              <ShoppingCart size={20} className="text-text" />
              {itemCount > 0 && (
                <span className="badge-cart absolute -top-0.5 -right-0.5">{itemCount > 99 ? "99+" : itemCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50" onClick={() => setMenuOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-playfair italic text-primary font-black text-lg">Jogga Store</span>
                <button onClick={() => setMenuOpen(false)} className="p-1"><X size={20} /></button>
              </div>
              <nav className="p-2 flex-1 overflow-y-auto">
                {menuItems.map((item, i) => (
                  <Link key={i} href={item.href} onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3.5 text-sm font-semibold text-text hover:bg-surface rounded-xl transition-colors no-underline">
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-border p-4">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Devise</p>
                <div className="flex gap-2">
                  {/* CDF — Franc */}
                  <button
                    onClick={() => setCurrency("CDF")}
                    className={`flex-1 rounded-2xl p-3 text-left transition-all border-2 ${
                      currency === "CDF"
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-surface"
                    }`}
                  >
                    <div className="text-base mb-0.5">🇨🇩</div>
                    <p className={`text-xs font-black ${currency === "CDF" ? "text-primary" : "text-text"}`}>FC</p>
                    <p className="text-[9px] text-text-muted font-medium">Franc Congolais</p>
                  </button>

                  {/* USD — Dollar */}
                  <button
                    onClick={() => setCurrency("USD")}
                    className={`flex-1 rounded-2xl p-3 text-left transition-all border-2 ${
                      currency === "USD"
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-blue-100 bg-blue-50"
                    }`}
                  >
                    <div className="text-base mb-0.5">🇺🇸</div>
                    <p className={`text-xs font-black flex items-center gap-1 ${currency === "USD" ? "text-white" : "text-blue-700"}`}>
                      <DollarSign size={11} className="inline" />USD
                    </p>
                    <p className={`text-[9px] font-medium ${currency === "USD" ? "text-blue-100" : "text-blue-500"}`}>Dollar Américain</p>
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-border">
                <p className="text-[10px] text-text-muted">Besoin d&apos;aide ?</p>
                <p className="text-xs font-bold text-primary">+242 06 123 4567</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
