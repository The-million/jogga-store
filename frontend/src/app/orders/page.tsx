"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, Truck, ShoppingBag, ChevronRight, XCircle, Home } from "lucide-react";
import Link from "next/link";
import { useCurrency } from "@/lib/CurrencyContext";
import { useAuth } from "@/lib/AuthContext";
import { api, ApiOrder } from "@/lib/api";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Package }> = {
  CONFIRMED:  { label: "Confirmée",        color: "text-primary",    bg: "bg-primary/10",  icon: CheckCircle2 },
  PREPARING:  { label: "En préparation",   color: "text-accent",     bg: "bg-accent/10",   icon: Package },
  IN_TRANSIT: { label: "En route 🚚",      color: "text-amber-600",  bg: "bg-amber-50",    icon: Truck },
  DELIVERED:  { label: "Livrée ✓",         color: "text-green-600",  bg: "bg-green-50",    icon: Home },
  CANCELLED:  { label: "Annulée",          color: "text-red-500",    bg: "bg-red-50",      icon: XCircle },
};

function latestStatus(order: ApiOrder): string {
  if (!order.statuses || order.statuses.length === 0) return "CONFIRMED";
  // If any status is CANCELLED, show cancelled
  if (order.statuses.some((s) => s.status === "CANCELLED")) return "CANCELLED";
  return order.statuses[order.statuses.length - 1].status;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function OrdersPage() {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get<ApiOrder[]>("/orders/mine")
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-dvh flex items-center justify-center">
        <div className="text-center px-8">
          <ShoppingBag size={48} className="mx-auto text-text-light mb-4" />
          <p className="text-sm font-bold text-text mb-1">Connexion requise</p>
          <p className="text-xs text-text-muted mb-5">Connectez-vous pour voir vos commandes</p>
          <Link href="/auth/login?redirect=/orders" className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-bold no-underline">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      <header className="sticky top-0 z-40 bg-white border-b border-border px-4 py-3">
        <span className="font-bebas text-xl tracking-widest text-text">MES COMMANDES</span>
      </header>

      <div className="p-4 space-y-3">
        {loading && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-surface rounded-2xl p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-32" />
                  <div className="h-3 bg-slate-200 rounded w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-200 rounded w-24" />
                  <div className="h-4 bg-slate-200 rounded w-16" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag size={40} className="mx-auto text-text-light mb-3" />
            <p className="text-sm text-text-muted mb-1">Aucune commande pour l'instant</p>
            <Link href="/" className="text-primary font-bold text-sm mt-1 inline-block no-underline">
              Commencer à commander
            </Link>
          </div>
        )}

        {!loading && orders.map((order, i) => {
          const statusKey = latestStatus(order);
          const s = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.CONFIRMED;
          const Icon = s.icon;
          const itemCount = order.items?.reduce((sum, it) => sum + it.quantity, 0) ?? 0;
          const isDelivered = statusKey === "DELIVERED";
          const isCancelled = statusKey === "CANCELLED";

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={`/orders/${order.id}`} className="block no-underline">
                <div className="bg-surface rounded-2xl p-4 hover:shadow-md transition-shadow">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-text-muted bg-white px-2.5 py-1 rounded-full border border-border">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-text-muted">{formatDate(order.createdAt)}</span>
                  </div>

                  {/* Status + amount */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${s.bg}`}>
                      <Icon size={13} className={s.color} />
                      <span className={`text-[11px] font-bold ${s.color}`}>{s.label}</span>
                    </div>
                    <span className="text-base font-black text-primary price-tag">
                      {formatPrice(Number(order.totalAmount))}
                    </span>
                  </div>

                  {/* Progress bar (only for active orders) */}
                  {!isCancelled && !isDelivered && (
                    <div className="mb-3">
                      <div className="flex justify-between mb-1">
                        {["CONFIRMED", "PREPARING", "IN_TRANSIT", "DELIVERED"].map((st) => {
                          const statuses = ["CONFIRMED", "PREPARING", "IN_TRANSIT", "DELIVERED"];
                          const done = statuses.indexOf(st) <= statuses.indexOf(statusKey);
                          return (
                            <div key={st} className={`h-1 rounded-full flex-1 mx-0.5 ${done ? "bg-primary" : "bg-border"}`} />
                          );
                        })}
                      </div>
                      <p className="text-[9px] text-text-muted text-right">Livraison sous 24h garantie</p>
                    </div>
                  )}

                  {isDelivered && (
                    <div className="mb-3 bg-green-50 rounded-xl px-3 py-2 text-[11px] text-green-600 font-semibold">
                      ✓ Livrée avec succès
                    </div>
                  )}

                  {/* Bottom row */}
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-text-muted">
                      {itemCount} article{itemCount > 1 ? "s" : ""}
                      {" · "}
                      {order.paymentMode === "cash" ? "Cash livraison" : "Mobile Money"}
                    </p>
                    <div className="flex items-center gap-1 text-primary">
                      <span className="text-[11px] font-bold">Voir détail</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
