"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const slides = [
  { title: "Collection Été 2026", subtitle: "Les tendances qui font sensation", cta: "Découvrir", bg: "from-primary to-primary-light", emoji: "☀️" },
  { title: "Nouveautés Tech", subtitle: "Jusqu'à -40% sur l'électronique", cta: "Shopper", bg: "from-accent to-accent-light", emoji: "🎧" },
  { title: "Mode Urbaine", subtitle: "Style et confort au quotidien", cta: "Explorer", bg: "from-indigo-600 to-purple-600", emoji: "👟" },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="relative h-48 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[current].bg} flex items-center px-6`}
        >
          <div className="flex-1 text-white">
            <p className="text-xs opacity-70 font-semibold uppercase tracking-widest mb-1">
              {slides[current].subtitle}
            </p>
            <h2 className="text-2xl font-black leading-tight">{slides[current].title}</h2>
            <Link
              href="/search"
              className="inline-block mt-3 bg-white text-primary text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wider"
            >
              {slides[current].cta} →
            </Link>
          </div>
          <div className="text-6xl ml-3 shrink-0">{slides[current].emoji}</div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
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
