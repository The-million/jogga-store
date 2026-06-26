"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { name: "NOUVEAUTÉS", slug: "nouveautes", param: "new=1" },
  { name: "HOMME", slug: "hommes", param: "category=hommes" },
  { name: "FEMME", slug: "femmes", param: "category=femmes" },
  { name: "ENFANTS", slug: "enfants", param: "category=enfants" },
  { name: "ÉLECTRONIQUE", slug: "electronique", param: "category=electronique" },
  { name: "MAISON", slug: "maison", param: "category=maison" },
  { name: "SPORT", slug: "sport", param: "category=sport" },
  { name: "BEAUTÉ", slug: "beaute", param: "category=beaute" },
  { name: "PROMOS", slug: "promos", param: "category=promos" },
];

export function CategoryNav() {
  const [active, setActive] = useState("NOUVEAUTÉS");

  return (
    <div className="bg-white border-b border-border">
      <div className="flex gap-0 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/search?${cat.param}`}
            onClick={() => setActive(cat.name)}
            className={`relative shrink-0 px-4 py-3 text-[12px] font-bold transition-colors whitespace-nowrap no-underline ${
              active === cat.name ? "text-primary" : "text-text-muted"
            }`}
          >
            {cat.name}
            {active === cat.name && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
