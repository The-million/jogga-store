"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";

const categoryData: Record<string, { title: string; hero: string; color: string; products: any[]; flashDeals: any[] }> = {
  hommes: {
    title: "Homme", hero: "Mode masculine urbaine", color: "from-blue-600 to-indigo-700",
    products: [
      { id: "h1", slug: "chemise-oxford", name: "Chemise Oxford Premium", price: 22000, oldPrice: 35000, image: "👔", rating: 4.7, reviews: 156 },
      { id: "h2", slug: "pantalon-chino", name: "Pantalon Chino Slim Fit", price: 28000, oldPrice: 42000, image: "👖", rating: 4.5, reviews: 89 },
      { id: "h3", slug: "veste-bomber", name: "Veste Bomber Urbaine", price: 45000, image: "🧥", rating: 4.8, reviews: 234 },
      { id: "h4", slug: "sneakers-running", name: "Sneakers Running Air", price: 35000, oldPrice: 55000, image: "👟", rating: 4.6, reviews: 412 },
      { id: "h5", slug: "ceinture-cuir", name: "Ceinture Cuir Véritable", price: 15000, image: "🪢", rating: 4.4, reviews: 67 },
      { id: "h6", slug: "montre-classique", name: "Montre Classique Acier", price: 32000, oldPrice: 48000, image: "⌚", rating: 4.9, reviews: 523 },
    ],
    flashDeals: [
      { id: "fh1", name: "Chemise Oxford", price: 15000, oldPrice: 35000, image: "👔", sold: 78 },
      { id: "fh2", name: "Sneakers Air", price: 22000, oldPrice: 55000, image: "👟", sold: 92 },
      { id: "fh3", name: "Pantalon Chino", price: 18000, oldPrice: 42000, image: "👖", sold: 65 },
      { id: "fh4", name: "Montre Acier", price: 20000, oldPrice: 48000, image: "⌚", sold: 88 },
    ],
  },
  femmes: {
    title: "Femme", hero: "Élégance au quotidien", color: "from-pink-500 to-rose-600",
    products: [
      { id: "f1", slug: "robe-ete-fleurie", name: "Robe d'Été Fleurie", price: 25000, oldPrice: 38000, image: "👗", rating: 4.8, reviews: 312 },
      { id: "f2", slug: "sac-a-main-cuir", name: "Sac à Main Cuir Italien", price: 55000, image: "👜", rating: 4.9, reviews: 178 },
      { id: "f3", slug: "sandales-plateforme", name: "Sandales Plateforme", price: 18000, oldPrice: 28000, image: "👡", rating: 4.4, reviews: 245 },
      { id: "f4", slug: "bijoux-set", name: "Set Bijoux Dorés", price: 12000, oldPrice: 20000, image: "💍", rating: 4.6, reviews: 423 },
      { id: "f5", slug: "blouse-soie", name: "Blouse en Soie", price: 32000, image: "👚", rating: 4.7, reviews: 156 },
      { id: "f6", slug: "jeans-taille-haute", name: "Jeans Taille Haute", price: 28000, oldPrice: 40000, image: "👖", rating: 4.5, reviews: 289 },
    ],
    flashDeals: [
      { id: "ff1", name: "Robe Fleurie", price: 15000, oldPrice: 38000, image: "👗", sold: 85 },
      { id: "ff2", name: "Set Bijoux", price: 7000, oldPrice: 20000, image: "💍", sold: 94 },
      { id: "ff3", name: "Sandales", price: 10000, oldPrice: 28000, image: "👡", sold: 72 },
      { id: "ff4", name: "Jeans TH", price: 18000, oldPrice: 40000, image: "👖", sold: 63 },
    ],
  },
  electronique: {
    title: "Électronique", hero: "Tech & Gadgets", color: "from-gray-700 to-gray-900",
    products: [
      { id: "e1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro ANC", price: 15000, oldPrice: 25000, image: "🎧", rating: 4.8, reviews: 234 },
      { id: "e2", slug: "montre-connectee-sport", name: "Montre Connectée Sport IP68", price: 25000, oldPrice: 35000, image: "⌚", rating: 4.7, reviews: 567 },
      { id: "e3", slug: "batterie-externe", name: "Power Bank 20000mAh", price: 22000, image: "🔋", rating: 4.9, reviews: 156 },
      { id: "e4", slug: "enceinte-portable", name: "Enceinte Bluetooth Étanche", price: 35000, oldPrice: 45000, image: "🔊", rating: 4.8, reviews: 723 },
    ],
    flashDeals: [
      { id: "fe1", name: "Écouteurs ANC", price: 12000, oldPrice: 25000, image: "🎧", sold: 85 },
      { id: "fe2", name: "Montre Sport", price: 18000, oldPrice: 35000, image: "⌚", sold: 62 },
      { id: "fe3", name: "Power Bank", price: 15000, oldPrice: 28000, image: "🔋", sold: 93 },
      { id: "fe4", name: "Enceinte BT", price: 22000, oldPrice: 45000, image: "🔊", sold: 47 },
    ],
  },
};

const defaultCat = {
  title: "Produits", hero: "Découvrez notre sélection", color: "from-primary to-primary-light",
  products: [
    { id: "d1", slug: "ecouteurs-bluetooth-pro", name: "Écouteurs Bluetooth Pro ANC", price: 15000, oldPrice: 25000, image: "🎧", rating: 4.8, reviews: 234 },
    { id: "d2", slug: "montre-connectee-sport", name: "Montre Connectée Sport", price: 25000, image: "⌚", rating: 4.7, reviews: 567 },
    { id: "d3", slug: "sac-a-dos-urbain", name: "Sac à Dos Urbain", price: 18000, image: "🎒", rating: 4.5, reviews: 89 },
    { id: "d4", slug: "lampe-led-decorative", name: "Lampe LED RGB", price: 12000, oldPrice: 18000, image: "💡", rating: 4.6, reviews: 432 },
  ],
  flashDeals: [],
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const cat = categoryData[slug as string] || { ...defaultCat, title: (slug as string).charAt(0).toUpperCase() + (slug as string).slice(1) };
  const { formatPrice } = useCurrency();

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      {/* Header */}
      <div className={`bg-gradient-to-br ${cat.color} text-white`}>
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-1.5 -ml-1.5 text-white"><ArrowLeft size={21} /></Link>
          <h1 className="text-sm font-black uppercase tracking-wider">{cat.title}</h1>
        </div>
        <div className="px-4 pb-6 pt-2">
          <p className="text-white/70 text-xs font-semibold">{cat.hero}</p>
        </div>
      </div>

      {/* Flash Deals */}
      {(cat.flashDeals || []).length > 0 && (
        <div className="bg-white py-4 border-b border-border">
          <div className="px-4 flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-text uppercase tracking-wider">⚡ Offres Flash {cat.title}</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4">
            {(cat.flashDeals || []).map((deal: any, i: number) => (
              <motion.div key={deal.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="shrink-0 w-36">
                <div className="relative bg-surface rounded-xl aspect-[3/4] flex items-center justify-center text-4xl mb-2 overflow-hidden">
                  {deal.image}
                  <span className="badge-discount absolute top-2 left-2">-{Math.round((1 - deal.price / deal.oldPrice) * 100)}%</span>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="h-1 bg-white/40 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${deal.sold}%` }} />
                    </div>
                  </div>
                </div>
                <p className="text-xs font-bold text-accent">{formatPrice(deal.price)}</p>
                <p className="text-[10px] text-text-light line-through">{formatPrice(deal.oldPrice)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2.5">
          {cat.products.map((product: any, i: number) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/${product.slug}`} className="block bg-surface rounded-2xl overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative aspect-[3/4] flex items-center justify-center text-5xl bg-white">
                  {product.image}
                  {product.oldPrice && (
                    <span className="badge-discount absolute top-2 right-2">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold text-text line-clamp-2 leading-snug mb-1.5">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-1.5">
                    <Star size={10} className="text-star fill-star" />
                    <span className="text-[10px] font-semibold text-text-muted">{product.rating}</span>
                    <span className="text-[9px] text-text-light">({product.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.oldPrice && <span className="text-[10px] text-text-light line-through">{formatPrice(product.oldPrice)}</span>}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
