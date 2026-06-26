"use client";

import { use, useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Calendar, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiUser, ApiOrder, ApiAddress } from "@/lib/api";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  CONFIRMED:  { label: "Confirmée",      color: "text-blue-700 bg-blue-50" },
  PREPARING:  { label: "En préparation", color: "text-amber-700 bg-amber-50" },
  IN_TRANSIT: { label: "En route",       color: "text-purple-700 bg-purple-50" },
  DELIVERED:  { label: "Livrée",         color: "text-green-700 bg-green-50" },
  CANCELLED:  { label: "Annulée",        color: "text-red-700 bg-red-50" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [customer, setCustomer] = useState<ApiUser | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<ApiUser>(`/users/${id}`),
      api.get<ApiOrder[]>("/orders").then((all) => all.filter((o) => o.user?.id === id || (o as any).userId === id)),
    ]).then(([u, o]) => {
      setCustomer(u);
      setOrders(o);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">Client introuvable</p>
        <button onClick={() => router.back()} className="text-primary font-bold text-sm mt-3">← Retour</button>
      </div>
    );
  }

  const totalSpent = orders
    .filter((o) => o.statuses?.at(-1)?.status === "DELIVERED")
    .reduce((s, o) => s + Number(o.totalAmount), 0);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">{customer.fullName}</h1>
          <p className="text-gray-500 text-sm">Client depuis le {formatDate(customer.createdAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
            <ShoppingBag size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{orders.length}</p>
          <p className="text-xs text-gray-500">Commandes</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center mb-3">
            <Package size={16} className="text-green-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">{totalSpent.toLocaleString("fr-FR")}</p>
          <p className="text-xs text-gray-500">FCFA dépensés</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center mb-3">
            <Calendar size={16} className="text-purple-500" />
          </div>
          <p className="text-2xl font-black text-gray-900">
            {orders.filter((o) => o.statuses?.at(-1)?.status === "DELIVERED").length}
          </p>
          <p className="text-xs text-gray-500">Livrées</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Infos contact */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-4">Informations</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={15} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400">Email</p>
                <p className="text-sm font-semibold text-gray-800">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={15} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400">Téléphone</p>
                <p className="text-sm font-semibold text-gray-800">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={15} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400">Inscrit le</p>
                <p className="text-sm font-semibold text-gray-800">{formatDate(customer.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badge rôle */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-4">Compte</h2>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            {customer.role}
          </span>
          <p className="text-xs text-gray-400 mt-3">ID : <span className="font-mono">{customer.id}</span></p>
        </div>
      </div>

      {/* Historique commandes */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Historique des commandes</h2>
        </div>
        {orders.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">Aucune commande</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">N° Commande</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                const status = order.statuses?.at(-1)?.status ?? "CONFIRMED";
                const s = STATUS_LABEL[status] ?? STATUS_LABEL.CONFIRMED;
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-xs font-mono text-gray-600">{order.orderNumber}</td>
                    <td className="px-6 py-3 text-xs text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-3 text-sm font-bold text-gray-900">
                      {Number(order.totalAmount).toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/gestion/orders/${order.id}`} className="text-xs font-bold text-primary hover:underline no-underline">
                        Voir →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
