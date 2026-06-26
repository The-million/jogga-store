"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  { name: "NOUVEAUTÉS", href: "/search?new=1" },
  { name: "HOMME", href: "/category/mode-homme" },
  { name: "FEMME", href: "/category/mode-femme" },
  { name: "ÉLECTRONIQUE", href: "/category/electronique" },
  { name: "MAISON", href: "/category/maison" },
  { name: "SPORT", href: "/category/sport" },
  { name: "BEAUTÉ", href: "/category/beaute" },
  { name: "PROMOS", href: "/search?new=1" },
];

export function CategoryNav() {
  const [active, setActive] = useState("NOUVEAUTÉS");

  return (
    <div className="bg-white border-b border-border">
      <div className="flex gap-0 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            onClick={() => setActive(cat.name)}
            className={`relative shrink-0 px-4 py-3 text-[11px] font-black transition-colors whitespace-nowrap no-underline tracking-wider ${
              active === cat.name ? "text-primary" : "text-text-muted"
            }`}
          >
            {cat.name}
            {active === cat.name && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
