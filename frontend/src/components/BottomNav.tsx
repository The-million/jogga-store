"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Home, Grid3X3, Sparkles, ShoppingBag, User } from "lucide-react";
import { clsx } from "clsx";

const tabs = [
  { id: "home", label: "Accueil", icon: Home, path: "/" },
  { id: "categories", label: "Rayons", icon: Grid3X3, path: "/search" },
  { id: "new", label: "News", icon: Sparkles, path: "/search?new=1" },
  { id: "cart", label: "Panier", icon: ShoppingBag, path: "/cart" },
  { id: "profile", label: "Moi", icon: User, path: "/account" },
];

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isNewParam = searchParams.get("new") === "1";

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.id === "home") return pathname === "/";
    if (tab.id === "new") return pathname === "/search" && isNewParam;
    if (tab.id === "categories") return pathname === "/search" && !isNewParam;
    if (tab.id === "cart") return pathname.startsWith("/cart");
    if (tab.id === "profile") return pathname.startsWith("/account");
    return false;
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
                <motion.div layoutId="nav-active" className="absolute inset-1 bg-primary/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              <Icon size={20} strokeWidth={active ? 2.2 : 1.5}
                className={clsx("relative z-10 transition-colors", active ? "text-primary" : "text-text-muted")} />
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

export function BottomNav() {
  return (
    <Suspense fallback={<div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md h-16 bottom-nav-glass rounded-3xl" />}>
      <BottomNavInner />
    </Suspense>
  );
}
