"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { name: "NOUVEAUTÉS", slug: "nouveautes", param: "new=1" },
  { name: "HOMME", slug: "hommes", href: "/category/hommes" },
  { name: "FEMME", slug: "femmes", href: "/category/femmes" },
  { name: "ENFANTS", slug: "enfants", href: "/category/enfants" },
  { name: "ÉLECTRONIQUE", slug: "electronique", href: "/category/electronique" },
  { name: "MAISON", slug: "maison", href: "/category/maison" },
  { name: "SPORT", slug: "sport", href: "/category/sport" },
  { name: "BEAUTÉ", slug: "beaute", href: "/category/beaute" },
  { name: "PROMOS", slug: "promos", param: "category=promos" },
];

export function CategoryNav() {
  const [active, setActive] = useState("NOUVEAUTÉS");

  return (
    <div className="bg-white border-b border-border">
      <div className="flex gap-0 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => {
          const href = cat.href || `/search?${cat.param}`;
          return (
            <Link
              key={cat.slug}
              href={href}
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
          );
        })}
      </div>
    </div>
  );
}
