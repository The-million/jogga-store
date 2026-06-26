"use client";

import { useState } from "react";

const categories = [
  "NOUVEAUTÉS", "HOMME", "FEMME", "ENFANTS",
  "ÉLECTRONIQUE", "MAISON", "SPORT", "BEAUTÉ", "PROMOS",
];

export function CategoryNav() {
  const [active, setActive] = useState("NOUVEAUTÉS");

  return (
    <div className="bg-white border-b border-border">
      <div className="flex gap-0 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`relative shrink-0 px-4 py-3 text-[12px] font-bold transition-colors whitespace-nowrap ${
              active === cat ? "text-primary" : "text-text-muted"
            }`}
          >
            {cat}
            {active === cat && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
