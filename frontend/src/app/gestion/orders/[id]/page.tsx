"use client";

import { use, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Package, Truck, Home, XCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiOrder } from "@/lib/api";

const STEPS = [
  { status: "CONFIRMED",  label: "Confirmée",       icon: CheckCircle2, color: "text-blue-600",   bg: "bg-blue-500" },
  { status: "PREPARING",  label: "En préparation",  icon: Package,      color: "text-amber-600",  bg: "bg-amber-500" },
  { status: "IN_TRANSIT", label: "En route",         icon: Truck,        color: "text-purple-600", bg: "bg-purple-500" },
  { status: "DELIVERED",  label: "Livrée",           icon: Home,         color: "text-green-600",  bg: "bg-green-500" },
];

const STATUS_ORDER = ["CONFIRMED", "PREPARING", "IN_TRANSIT", "DELIVERED"];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadOrder = () => {
    api.get<ApiOrder>(`/orders/${id}`)
      .then((o) => { setOrder(o); setNewStatus(o.statuses?.at(-1)?.status ?? "CONFIRMED"); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(loadOrder, [id]);

  const handleUpdate = async () => {
    if (!order || !newStatus) return;
    setUpdating(true);
    try {
      await api.patch(`/orders/${order.id}/status`, { status: newStatus, note: note || undefined });
      setSuccessMsg(`Statut mis à jour : ${newStatus}`);
      setNote("");
      setTimeout(() => setSuccessMsg(""), 3000);
      loadOrder();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">Commande introuvable</p>
        <button onClick={() => router.back()} className="text-primary font-bold text-sm mt-3">← Retour</button>
      </div>
    );
  }

  const isCancelled = order.statuses?.some((s) => s.status === "CANCELLED");
  const currentStatus = isCancelled ? "CANCELLED" : (order.statuses?.at(-1)?.status ?? "CONFIRMED");
  const currentStepIdx = STATUS_ORDER.indexOf(currentStatus);
  const statusTimestamps: Record<string, string> = {};
  for (const s of order.statuses ?? []) statusTimestamps[s.status] = s.createdAt;
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  const availableTransitions = STATUS_ORDER.filter((s) => STATUS_ORDER.indexOf(s) > currentStepIdx);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm">Passée le {formatDate(order.createdAt)} · par {order.user?.fullName ?? "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-black text-gray-900">{Number(order.totalAmount).toLocaleString("fr-FR")}</p>
          <p className="text-xs text-gray-400">FCFA</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Paiement</p>
          <p className="text-lg font-black text-gray-900">
            {order.paymentMode === "cash" ? "💵 Cash livraison" : "📱 Mobile Money"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Articles</p>
          <p className="text-2xl font-black text-gray-900">{itemCount}</p>
          <p className="text-xs text-gray-400">article{itemCount > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-5">Suivi de livraison</h2>

          {isCancelled ? (
            <div className="flex items-center gap-3 text-red-500">
              <XCircle size={20} />
              <p className="font-bold text-sm">Commande annulée</p>
            </div>
          ) : (
            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const stepIdx = STATUS_ORDER.indexOf(step.status);
                const isDone = stepIdx <= currentStepIdx;
                const isCurrent = stepIdx === currentStepIdx;
                const isLast = i === STEPS.length - 1;
                const Icon = step.icon;
                const ts = statusTimestamps[step.status];
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? step.bg : "bg-gray-100"} ${isCurrent ? "ring-4 ring-offset-1 ring-primary/20" : ""}`}>
                        <Icon size={15} className={isDone ? "text-white" : "text-gray-400"} />
                      </div>
                      {!isLast && <div className={`w-0.5 flex-1 my-1 min-h-[24px] ${isDone && !isCurrent ? "bg-primary" : "bg-gray-200"}`} />}
                    </div>
                    <div className={`pb-5 flex-1 ${stepIdx > currentStepIdx ? "opacity-40" : ""}`}>
                      <p className={`text-sm font-bold ${isDone ? step.color : "text-gray-400"}`}>{step.label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {ts ? formatDateTime(ts) : <span className="flex items-center gap-1"><Clock size={9} /> En attente</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Changer statut */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-4">Changer le statut</h2>

          {successMsg && (
            <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-2 rounded-xl mb-3">
              ✓ {successMsg}
            </div>
          )}

          {isCancelled || currentStatus === "DELIVERED" ? (
            <p className="text-xs text-gray-400 italic">Cette commande est terminée et ne peut plus être modifiée.</p>
          ) : (
            <div className="space-y-3 flex-1 flex flex-col">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Nouveau statut</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50"
                >
                  <option value={currentStatus} disabled>{currentStatus} (actuel)</option>
                  {availableTransitions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  {currentStatus !== "CANCELLED" && <option value="CANCELLED">CANCELLED</option>}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Note (optionnel)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: Livreur en route, contact client effectué…"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 resize-none"
                />
              </div>
              <button
                onClick={handleUpdate}
                disabled={updating || newStatus === currentStatus}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                {updating ? "Mise à jour…" : "Mettre à jour"}
              </button>
            </div>
          )}

          {/* Info client */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Client</p>
            <p className="text-sm font-semibold text-gray-800">{order.user?.fullName ?? "—"}</p>
            <p className="text-xs text-gray-500">{order.user?.phone ?? ""}</p>
            {order.user && (
              <Link href={`/gestion/customers/${(order.user as any).id ?? ""}`} className="text-xs text-primary font-bold hover:underline no-underline mt-1 inline-block">
                Voir profil client →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Articles commandés</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Produit</th>
              <th className="text-center px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Qté</th>
              <th className="text-right px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Prix unitaire</th>
              <th className="text-right px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sous-total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {order.items.map((item, i) => {
              const imageUrl = (item.product as any).imageUrl ?? null;
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                        )}
                      </div>
                      <Link href={`/${item.product.slug}`} target="_blank" className="text-sm font-semibold text-gray-800 hover:text-primary line-clamp-1 no-underline">
                        {item.product.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-600">{item.quantity}</td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">{Number(item.unitPrice).toLocaleString("fr-FR")} FCFA</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    {(Number(item.unitPrice) * item.quantity).toLocaleString("fr-FR")} FCFA
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t border-gray-200 bg-gray-50">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-gray-700">Total</td>
              <td className="px-6 py-4 text-right text-base font-black text-primary">
                {Number(order.totalAmount).toLocaleString("fr-FR")} FCFA
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
