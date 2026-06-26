"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiOrder } from "@/lib/api";

const STATUSES = ["CONFIRMED", "PREPARING", "IN_TRANSIT", "DELIVERED", "CANCELLED"] as const;

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  CONFIRMED:  { label: "Confirmée",      color: "text-blue-700 bg-blue-50 border-blue-200" },
  PREPARING:  { label: "En préparation", color: "text-amber-700 bg-amber-50 border-amber-200" },
  IN_TRANSIT: { label: "En route",       color: "text-purple-700 bg-purple-50 border-purple-200" },
  DELIVERED:  { label: "Livrée",         color: "text-green-700 bg-green-50 border-green-200" },
  CANCELLED:  { label: "Annulée",        color: "text-red-700 bg-red-50 border-red-200" },
  PENDING:    { label: "En attente",     color: "text-gray-600 bg-gray-100 border-gray-200" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function latestStatus(order: ApiOrder) {
  return order.statuses?.at(-1)?.status ?? "PENDING";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.get<ApiOrder[]>("/orders")
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          statuses: [...(o.statuses ?? []), { status, note: null, createdAt: new Date().toISOString() }],
        };
      }));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === "ALL" ? orders : orders.filter((o) => latestStatus(o) === filter);
  const revenue = orders.filter((o) => latestStatus(o) === "DELIVERED").reduce((s, o) => s + Number(o.totalAmount), 0);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Commandes</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {orders.length} commande{orders.length !== 1 ? "s" : ""} •{" "}
          CA livré : <strong>{revenue.toLocaleString("fr-FR")} FCFA</strong>
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[{ key: "ALL", label: "Toutes" }, ...STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s].label }))].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
              filter === f.key
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-500 border-gray-200 hover:border-primary/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">N° Commande</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Paiement</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
              <th className="text-right px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Détails</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="animate-pulse h-8 bg-gray-100 rounded" />
                  </td>
                </tr>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Aucune commande{filter !== "ALL" ? " avec ce statut" : ""}</td></tr>
            )}
            {!loading && filtered.map((order) => {
              const status = latestStatus(order);
              const s = STATUS_LABEL[status] ?? STATUS_LABEL.PENDING;
              const isUpdating = updatingId === order.id;
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-600">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900">{order.user?.fullName ?? "—"}</p>
                    <p className="text-xs text-gray-400">{order.user?.phone ?? ""}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                    {Number(order.totalAmount).toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">
                      {order.paymentMode === "cash" ? "💵 Cash" : "📱 Mobile Money"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={status}
                      disabled={isUpdating || status === "DELIVERED" || status === "CANCELLED"}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-full border cursor-pointer appearance-none outline-none transition-colors ${s.color} disabled:opacity-60 disabled:cursor-default`}
                    >
                      {STATUSES.map((st) => (
                        <option key={st} value={st}>{STATUS_LABEL[st].label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/gestion/orders/${order.id}`} className="text-xs font-bold text-primary hover:underline no-underline">
                      Détails →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
