"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Search, ShoppingBag, Package, User } from "lucide-react";
import { clsx } from "clsx";

const tabs = [
  { id: "home", label: "Shop", icon: Home, path: "/" },
  { id: "search", label: "Explore", icon: Search, path: "/search" },
  { id: "cart", label: "Panier", icon: ShoppingBag, path: "/cart" },
  { id: "orders", label: "Suivi", icon: Package, path: "/orders" },
  { id: "profile", label: "Moi", icon: User, path: "/account" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.path === "/") return pathname === "/";
    return pathname.startsWith(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="nav-glass flex items-center justify-around px-1 py-1.5">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 min-w-0 flex-1"
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.5}
                className={clsx(
                  "relative z-10 transition-colors duration-200",
                  active ? "text-text" : "text-text-muted"
                )}
              />
              <span
                className={clsx(
                  "text-[9px] font-semibold relative z-10 transition-colors duration-200",
                  active ? "text-text" : "text-text-muted"
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
