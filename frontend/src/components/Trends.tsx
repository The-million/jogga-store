"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

const trends = [
  { id: "t1", name: "Écouteurs Sans Fil", label: "2.4k ventes", color: "bg-blue-100", textColor: "text-blue-700", slug: "ecouteurs-bluetooth-pro" },
  { id: "t2", name: "Montres Connectées", label: "1.8k ventes", color: "bg-purple-100", textColor: "text-purple-700", slug: "montre-connectee-sport" },
  { id: "t3", name: "Lampes LED", label: "3.1k ventes", color: "bg-amber-100", textColor: "text-amber-700", slug: "lampe-led-decorative" },
  { id: "t4", name: "Enceintes BT", label: "1.5k ventes", color: "bg-green-100", textColor: "text-green-700", slug: "enceinte-portable" },
  { id: "t5", name: "Power Banks", label: "2.9k ventes", color: "bg-red-100", textColor: "text-red-700", slug: "batterie-externe" },
  { id: "t6", name: "Sacs à Dos", label: "1.2k ventes", color: "bg-indigo-100", textColor: "text-indigo-700", slug: "sac-a-dos-urbain" },
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
              <div className={`${trend.color} rounded-2xl aspect-square flex items-center justify-center mb-2 shadow-sm`}>
                <span className={`text-3xl font-black ${trend.textColor}`}>{trend.name.charAt(0)}</span>
              </div>
              <p className="text-[11px] font-semibold text-text text-center line-clamp-2 leading-snug">{trend.name}</p>
              <p className="text-[10px] text-text-muted text-center mt-0.5">{trend.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
