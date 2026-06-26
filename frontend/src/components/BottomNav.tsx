"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Grid3X3, Sparkles, ShoppingBag, User } from "lucide-react";
import { clsx } from "clsx";

const tabs = [
  { id: "home", label: "Accueil", icon: Home, path: "/" },
  { id: "categories", label: "Catégories", icon: Grid3X3, path: "/search" },
  { id: "new", label: "Nouveautés", icon: Sparkles, path: "/search?new=1" },
  { id: "cart", label: "Panier", icon: ShoppingBag, path: "/cart" },
  { id: "profile", label: "Profil", icon: User, path: "/account" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.path === "/") return pathname === "/";
    return pathname.startsWith(tab.path.split("?")[0]);
  };

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md">
      <div className="bottom-nav-glass rounded-3xl px-1 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 min-w-0 flex-1"
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-1 bg-primary/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.5}
                className={clsx("relative z-10 transition-colors", active ? "text-primary" : "text-text-muted")}
              />
              <span className={clsx("text-[9px] font-semibold relative z-10 transition-colors", active ? "text-primary" : "text-text-muted")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
