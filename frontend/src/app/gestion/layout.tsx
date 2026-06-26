"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Tag, ShoppingBag, LogOut, Store, Users, Star, Settings } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { clsx } from "clsx";

const NAV = [
  { href: "/gestion", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/gestion/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/gestion/customers", label: "Clients", icon: Users },
  { href: "/gestion/products", label: "Produits", icon: Package },
  { href: "/gestion/categories", label: "Catégories", icon: Tag },
  { href: "/gestion/reviews", label: "Avis", icon: Star },
  { href: "/gestion/settings", label: "Paramètres", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-gray-900 flex flex-col min-h-screen">
        <div className="px-5 py-5 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Store size={18} className="text-primary" />
            <div>
              <p className="text-white text-xs font-black uppercase tracking-wider leading-tight">Jogga Admin</p>
              <p className="text-gray-500 text-[10px]">Panel de gestion</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors no-underline",
                  active
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800">
          <div className="px-3 mb-3">
            <p className="text-white text-xs font-semibold truncate">{user.fullName}</p>
            <p className="text-gray-500 text-[10px] truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
