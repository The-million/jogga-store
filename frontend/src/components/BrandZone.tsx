"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const brands = [
  { name: "TechPro", logo: "TP", bg: "bg-blue-100", text: "text-blue-700" },
  { name: "UrbanWear", logo: "UW", bg: "bg-purple-100", text: "text-purple-700" },
  { name: "HomeStyle", logo: "HS", bg: "bg-green-100", text: "text-green-700" },
  { name: "SportMax", logo: "SM", bg: "bg-orange-100", text: "text-orange-700" },
  { name: "BeautyLab", logo: "BL", bg: "bg-pink-100", text: "text-pink-700" },
  { name: "SmartLife", logo: "SL", bg: "bg-indigo-100", text: "text-indigo-700" },
];

export function BrandZone() {
  return (
    <div className="bg-white py-4">
      <div className="px-4 flex items-center justify-between mb-3">
        <h3 className="text-sm font-black text-text uppercase tracking-wider">⭐ Zone Marques</h3>
        <Link href="/search?category=marques" className="text-[11px] font-bold text-primary">Toutes →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="shrink-0"
          >
            <Link href={`/search?brand=${brand.name.toLowerCase()}`} className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 ${brand.bg} rounded-2xl flex items-center justify-center shadow-sm`}>
                <span className={`text-lg font-black ${brand.text}`}>{brand.logo}</span>
              </div>
              <span className="text-[10px] font-semibold text-text">{brand.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
