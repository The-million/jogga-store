"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

const deals = [
  { title: "Super Offres", subtitle: "Jusqu'à -70%", image: "🔥", bg: "from-red-500 to-orange-500", slug: "promos" },
  { title: "Tendances", subtitle: "Les plus populaires", image: "📈", bg: "from-purple-500 to-pink-500", slug: "tendances" },
  { title: "Zone Marques", subtitle: "Qualité premium", image: "⭐", bg: "from-amber-500 to-yellow-500", slug: "marques" },
  { title: "Meilleures Ventes", subtitle: "Plébiscités par vous", image: "🏆", bg: "from-emerald-500 to-teal-500", slug: "best-sellers" },
];

export function SuperDeals() {
  const { formatPrice } = useCurrency();

  return (
    <div className="bg-white py-4">
      <div className="px-4 mb-3">
        <h3 className="text-sm font-black text-text uppercase tracking-wider">🔥 Super Offres</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 px-4">
        {deals.map((deal, i) => (
          <motion.div
            key={deal.slug}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              href={`/search?category=${deal.slug}`}
              className={`block bg-gradient-to-br ${deal.bg} rounded-2xl p-4 text-white h-32 flex flex-col justify-between hover:shadow-lg transition-shadow`}
            >
              <div>
                <p className="text-xs opacity-70 font-semibold">{deal.subtitle}</p>
                <h4 className="text-base font-black mt-0.5">{deal.title}</h4>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full">Voir →</span>
                <span className="text-3xl">{deal.image}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
