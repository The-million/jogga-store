"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Package, Tag, TrendingUp, Clock, CheckCircle2, Truck } from "lucide-react";
import Link from "next/link";
import { api, ApiOrder, ApiProduct, ApiCategory } from "@/lib/api";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  CONFIRMED:  { label: "Confirmée",      color: "text-blue-600 bg-blue-50" },
  PREPARING:  { label: "En préparation", color: "text-amber-600 bg-amber-50" },
  IN_TRANSIT: { label: "En route",       color: "text-purple-600 bg-purple-50" },
  DELIVERED:  { label: "Livrée",         color: "text-green-600 bg-green-50" },
  CANCELLED:  { label: "Annulée",        color: "text-red-600 bg-red-50" },
  PENDING:    { label: "En attente",     color: "text-gray-600 bg-gray-100" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<ApiOrder[]>("/orders"),
      api.get<ApiProduct[]>("/products/admin/all"),
      api.get<ApiCategory[]>("/categories"),
    ]).then(([o, p, c]) => {
      setOrders(o);
      setProducts(p);
      setCategories(c);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const revenue = orders.reduce((s, o) => s + Number(o.totalAmount), 0);
  const recentOrders = orders.slice(0, 8);

  const stats = [
    { label: "Commandes totales", value: orders.length, icon: ShoppingBag, color: "bg-blue-500", href: "/gestion/orders" },
    { label: "Chiffre d'affaires", value: `${revenue.toLocaleString("fr-FR")} FCFA`, icon: TrendingUp, color: "bg-green-500", href: "/gestion/orders" },
    { label: "Produits", value: products.length, icon: Package, color: "bg-purple-500", href: "/gestion/products" },
    { label: "Catégories", value: categories.length, icon: Tag, color: "bg-amber-500", href: "/gestion/categories" },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-24 shadow-sm" />
          ))}
        </div>
        <div className="animate-pulse bg-white rounded-2xl h-80 shadow-sm" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble du magasin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow no-underline block">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Commandes récentes */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">Commandes récentes</h2>
          <Link href="/gestion/orders" className="text-xs font-bold text-primary hover:underline">Voir tout →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">N° Commande</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">Aucune commande</td></tr>
              )}
              {recentOrders.map((order) => {
                const lastStatus = order.statuses?.at(-1)?.status ?? "PENDING";
                const s = STATUS_LABEL[lastStatus] ?? STATUS_LABEL.PENDING;
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{order.user?.fullName ?? "—"}</p>
                      <p className="text-xs text-gray-400">{order.user?.phone ?? ""}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{Number(order.totalAmount).toLocaleString("fr-FR")} FCFA</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
