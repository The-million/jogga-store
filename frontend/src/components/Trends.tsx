"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const trends = [
  {
    id: "t1",
    name: "Écouteurs",
    label: "2.4k ventes",
    href: "/ecouteurs-sans-fil-pro-anc",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80&fit=crop",
  },
  {
    id: "t2",
    name: "Montres",
    label: "1.8k ventes",
    href: "/montre-connectee-sport-gps",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80&fit=crop",
  },
  {
    id: "t3",
    name: "Robes",
    label: "3.1k ventes",
    href: "/category/mode-femme",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80&fit=crop",
  },
  {
    id: "t4",
    name: "Enceintes",
    label: "1.5k ventes",
    href: "/enceinte-bluetooth-360-waterproof",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80&fit=crop",
  },
  {
    id: "t5",
    name: "Sneakers",
    label: "2.9k ventes",
    href: "/sneakers-urban-low-cuir-perfore",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80&fit=crop",
  },
  {
    id: "t6",
    name: "Sacs",
    label: "1.2k ventes",
    href: "/sac-a-dos-business-30l-usb",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80&fit=crop",
  },
];

export function Trends() {
  return (
    <div className="bg-surface py-4">
      <div className="px-4 flex items-center justify-between mb-3">
        <span className="section-title text-text">TENDANCES</span>
        <Link href="/search?new=1" className="text-[11px] font-bold text-primary no-underline">Tout voir →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4">
        {trends.map((trend, i) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="shrink-0 w-24"
          >
            <Link href={trend.href} className="block no-underline">
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-2 shadow-sm relative group">
                <img
                  src={trend.image}
                  alt={trend.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <p className="text-[11px] font-bold text-text text-center leading-snug">{trend.name}</p>
              <p className="text-[10px] text-text-muted text-center mt-0.5">{trend.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
