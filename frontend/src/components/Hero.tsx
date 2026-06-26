"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    title: "Collection Été 2026",
    subtitle: "Les tendances qui font sensation",
    cta: "Découvrir",
    href: "/category/mode-femme",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=85&fit=crop",
    position: "object-center",
  },
  {
    title: "Nouveautés Tech",
    subtitle: "Jusqu'à -40% sur l'électronique",
    cta: "Shopper maintenant",
    href: "/category/electronique",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=85&fit=crop",
    position: "object-center",
  },
  {
    title: "Mode Urbaine",
    subtitle: "Style et confort au quotidien",
    cta: "Explorer",
    href: "/category/mode-homme",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=85&fit=crop",
    position: "object-top",
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="relative h-56 overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover ${slide.position}`}
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <motion.div
          key={`text-${current}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest mb-1">
            {slide.subtitle}
          </p>
          <h2 className="font-playfair text-white text-2xl font-bold italic leading-tight mb-3">
            {slide.title}
          </h2>
          <Link
            href={slide.href}
            className="inline-block bg-white text-primary text-[11px] font-black px-5 py-2 rounded-full uppercase tracking-wider no-underline"
          >
            {slide.cta} →
          </Link>
        </motion.div>
      </div>

      {/* Dots */}
      <div className="absolute top-3 right-4 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-5" : "bg-white/40 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
