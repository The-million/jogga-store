"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

const trends = [
  { id: "t1", name: "Écouteurs Sans Fil", image: "🎧", sales: "2.4k", slug: "ecouteurs-bluetooth-pro" },
  { id: "t2", name: "Montres Connectées", image: "⌚", sales: "1.8k", slug: "montre-connectee-sport" },
  { id: "t3", name: "Lampes LED", image: "💡", sales: "3.1k", slug: "lampe-led-decorative" },
  { id: "t4", name: "Enceintes BT", image: "🔊", sales: "1.5k", slug: "enceinte-portable" },
  { id: "t5", name: "Power Banks", image: "🔋", sales: "2.9k", slug: "batterie-externe" },
  { id: "t6", name: "Sacs à Dos", image: "🎒", sales: "1.2k", slug: "sac-a-dos-urbain" },
];

export function Trends() {
  return (
    <div className="bg-surface py-4">
      <div className="px-4 flex items-center justify-between mb-3">
        <h3 className="text-sm font-black text-text uppercase tracking-wider">📈 Tendances</h3>
        <Link href="/search?category=tendances" className="text-[11px] font-bold text-primary">Tout voir →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4">
        {trends.map((trend, i) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="shrink-0 w-28"
          >
            <Link href={`/${trend.slug}`} className="block">
              <div className="bg-white rounded-2xl aspect-square flex items-center justify-center text-4xl mb-2 shadow-sm">
                {trend.image}
              </div>
              <p className="text-[11px] font-semibold text-text text-center line-clamp-2 leading-snug">{trend.name}</p>
              <p className="text-[10px] text-text-muted text-center mt-0.5">{trend.sales} ventes</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
