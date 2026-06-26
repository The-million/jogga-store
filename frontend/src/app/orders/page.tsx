"use client";

import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, Truck, MapPin } from "lucide-react";
import { useCurrency } from "@/lib/CurrencyContext";

const orders = [
  { id: "JOGGA-2026-0042", date: "27 juin 2026", total: 55000, status: "IN_TRANSIT", eta: "14:30", items: 3 },
  { id: "JOGGA-2026-0038", date: "25 juin 2026", total: 12000, status: "DELIVERED", items: 1 },
  { id: "JOGGA-2026-0031", date: "20 juin 2026", total: 34000, status: "DELIVERED", items: 2 },
];

const statusIcons: Record<string, { icon: typeof Package; label: string; color: string }> = {
  CONFIRMED: { icon: CheckCircle2, label: "Confirmée", color: "text-primary" },
  PREPARING: { icon: Package, label: "En préparation", color: "text-accent" },
  IN_TRANSIT: { icon: Truck, label: "En route", color: "text-accent" },
  DELIVERED: { icon: CheckCircle2, label: "Livrée", color: "text-green-600" },
};

export default function OrdersPage() {
  const { formatPrice } = useCurrency();

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      <header className="sticky top-0 z-40 bg-white border-b border-border px-4 py-3">
        <h1 className="text-sm font-black text-text uppercase tracking-wider">Mes Commandes</h1>
      </header>
      <div className="p-4 space-y-3">
        {orders.map((order, i) => {
          const s = statusIcons[order.status];
          const Icon = s.icon;
          return (
            <motion.div key={order.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-surface rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-text-muted bg-white px-2 py-0.5 rounded-full">{order.id}</span>
                <span className="text-[10px] text-text-muted">{order.date}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon size={17} className={s.color} />
                  <span className={`text-xs font-bold ${s.color}`}>{s.label}</span>
                </div>
                <span className="text-sm font-black text-primary">{formatPrice(order.total)}</span>
              </div>
              {order.eta && (
                <div className="bg-white rounded-xl p-2.5 flex items-center gap-2">
                  <Clock size={13} className="text-accent" />
                  <span className="text-[11px] text-text-muted">Arrivée estimée : <span className="font-bold text-text">Aujourd&apos;hui, {order.eta}</span></span>
                </div>
              )}
              {order.status === "DELIVERED" && (
                <div className="bg-white rounded-xl p-2.5 flex items-center gap-2">
                  <MapPin size={13} className="text-green-600" />
                  <span className="text-[11px] text-green-600 font-semibold">Livrée avec succès</span>
                </div>
              )}
              <p className="text-[10px] text-text-muted mt-2">{order.items} article{order.items > 1 ? "s" : ""}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
