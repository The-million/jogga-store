"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function ImageCard({
  title, subtitle, tag, href, image, className,
}: {
  title: string; subtitle: string; tag?: string; href: string; image: string; className?: string;
}) {
  return (
    <Link href={href} className={`relative overflow-hidden rounded-2xl block no-underline group ${className ?? ""}`}>
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {tag && (
        <span className="absolute top-3 left-3 bg-accent text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase z-10">
          {tag}
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <p className="text-white/70 text-[9px] font-semibold uppercase tracking-widest">{subtitle}</p>
        <h4 className="font-bebas text-white text-lg leading-none tracking-wider mt-0.5">{title}</h4>
        <span className="inline-block mt-1.5 text-[9px] font-black text-white bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
          Voir →
        </span>
      </div>
    </Link>
  );
}

export function SuperDeals() {
  return (
    <div className="bg-white py-4 px-4 border-b border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="section-title">DÉCOUVRIR</span>
        <Link href="/search" className="text-[11px] font-bold text-primary no-underline">Tout voir →</Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Row 1: 1 tall left + 2 small right stacked */}
        <div className="flex gap-2 mb-2">
          {/* Big left — tall */}
          <div className="flex-1 relative h-72">
            <ImageCard
              title="Super Offres"
              subtitle="Jusqu'à -70%"
              tag="PROMO"
              href="/search?new=1"
              image="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=85&fit=crop"
              className="h-full"
            />
          </div>

          {/* Two stacked right */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="relative h-[8.5rem]">
              <ImageCard
                title="Tendances"
                subtitle="Ce qui buzz"
                href="/category/mode-femme"
                image="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=85&fit=crop"
                className="h-full"
              />
            </div>
            <div className="relative h-[8.5rem]">
              <ImageCard
                title="High-Tech"
                subtitle="Nouveautés"
                href="/category/electronique"
                image="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=85&fit=crop"
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Row 2: full-width wide banner */}
        <div className="relative h-24">
          <ImageCard
            title="Meilleures Ventes"
            subtitle="Les plus plébiscités"
            tag="BEST SELLER"
            href="/search"
            image="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=85&fit=crop"
            className="h-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
