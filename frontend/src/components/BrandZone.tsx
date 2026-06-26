"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const brands = [
  {
    name: "TechPro",
    tagline: "Hi-Tech",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80&fit=crop",
    href: "/category/electronique",
  },
  {
    name: "UrbanStyle",
    tagline: "Homme",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&q=80&fit=crop",
    href: "/category/mode-homme",
  },
  {
    name: "FemStyle",
    tagline: "Femme",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80&fit=crop",
    href: "/category/mode-femme",
  },
  {
    name: "HomeStyle",
    tagline: "Maison",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80&fit=crop",
    href: "/category/maison",
  },
  {
    name: "SportMax",
    tagline: "Fitness",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80&fit=crop",
    href: "/category/sport",
  },
  {
    name: "BeautyLab",
    tagline: "Beauté",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80&fit=crop",
    href: "/category/beaute",
  },
];

export function BrandZone() {
  return (
    <div className="bg-white pt-4 pb-6">
      <div className="px-4 flex items-center justify-between mb-4">
        <span className="section-title">ZONE MARQUES</span>
        <Link href="/search" className="text-[11px] font-bold text-primary no-underline">Toutes →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 pb-1">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="shrink-0"
          >
            <Link href={brand.href} className="flex flex-col items-center gap-2 no-underline">
              {/* Circular brand image */}
              <div className="w-18 h-18 rounded-full overflow-hidden shadow-md border-2 border-white ring-1 ring-border relative group"
                style={{ width: 72, height: 72 }}>
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black text-text leading-none">{brand.name}</p>
                <p className="text-[9px] text-text-muted mt-0.5 uppercase tracking-wider">{brand.tagline}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer strip */}
      <div className="mx-4 mt-5 bg-primary rounded-2xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="font-bebas text-white text-xl tracking-wider leading-none">LIVRAISON EXPRESS</p>
          <p className="text-white/70 text-[11px] font-medium mt-0.5">Partout au Congo en 24h</p>
        </div>
        <Link href="/search" className="bg-white text-primary text-[11px] font-black px-4 py-2 rounded-full no-underline uppercase tracking-wider">
          Commander →
        </Link>
      </div>
    </div>
  );
}
