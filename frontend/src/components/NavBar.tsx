"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  ShoppingBag,
  Package,
  User,
} from "lucide-react";
import { clsx } from "clsx";

const tabs = [
  { id: "home", label: "Accueil", icon: Home, path: "/" },
  { id: "search", label: "Recherche", icon: Search, path: "/search" },
  { id: "cart", label: "Panier", icon: ShoppingBag, path: "/cart" },
  { id: "orders", label: "Commandes", icon: Package, path: "/orders" },
  { id: "profile", label: "Compte", icon: User, path: "/account" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.path === "/") return pathname === "/";
    return pathname.startsWith(tab.path);
  };

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
      <div className="glass-nav px-1 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 min-w-0 flex-1"
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-1 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={clsx(
                    "transition-colors duration-200",
                    active ? "text-primary" : "text-text-muted"
                  )}
                />
              </div>
              <span
                className={clsx(
                  "text-[10px] font-medium transition-colors duration-200 relative z-10",
                  active ? "text-primary" : "text-text-muted"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
