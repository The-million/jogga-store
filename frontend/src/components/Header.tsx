"use client";

import { useState } from "react";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Accueil", href: "/" },
  { label: "Nouveautés", href: "/search?new=1" },
  { label: "Super Offres", href: "/search?category=promos" },
  { label: "Tendances", href: "/search?category=tendances" },
  { label: "Zone Marques", href: "/search?category=marques" },
  { label: "Meilleures Ventes", href: "/search?category=best-sellers" },
  { label: "Mon Profil", href: "/account" },
  { label: "Mes Commandes", href: "/orders" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setMenuOpen(true)} className="p-1.5 -ml-1.5">
            <Menu size={22} className="text-text" />
          </button>

          <Link href="/" className="text-lg font-black text-primary tracking-tight uppercase no-underline">
            JOGGA <span className="text-text">STORE</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/search" className="p-1.5">
              <Search size={20} className="text-text" />
            </Link>
            <Link href="/cart" className="p-1.5 relative">
              <ShoppingCart size={20} className="text-text" />
              <span className="badge-cart absolute -top-0.5 -right-0.5">3</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Slide-out menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-sm font-black text-primary uppercase">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="p-1">
                  <X size={20} />
                </button>
              </div>
              <nav className="p-2">
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3.5 text-sm font-semibold text-text hover:bg-surface rounded-xl transition-colors no-underline"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-surface rounded-2xl p-4">
                  <p className="text-xs text-text-muted">Besoin d&apos;aide ?</p>
                  <p className="text-sm font-bold text-primary mt-0.5">+242 06 123 4567</p>
                  <p className="text-[10px] text-text-muted mt-1">WhatsApp disponible 24/7</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
