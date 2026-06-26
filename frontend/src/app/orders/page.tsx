"use client";

import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, Truck, MapPin } from "lucide-react";

const orders = [
  {
    id: "JOGGA-2026-0001",
    date: "27 juin 2026",
    total: 55000,
    status: "IN_TRANSIT",
    eta: "Aujourd'hui, 14:30",
    items: 3,
  },
  {
    id: "JOGGA-2026-0002",
    date: "25 juin 2026",
    total: 12000,
    status: "DELIVERED",
    items: 1,
  },
];

const statusConfig: Record<string, { icon: typeof Package; label: string; color: string }> = {
  CONFIRMED: { icon: CheckCircle2, label: "Confirmée", color: "text-accent" },
  PREPARING: { icon: Package, label: "En préparation", color: "text-accent" },
  IN_TRANSIT: { icon: Truck, label: "En route", color: "text-sage" },
  DELIVERED: { icon: CheckCircle2, label: "Livrée", color: "text-sage" },
};

export default function OrdersPage() {
  return (
    <div className="max-w-md mx-auto px-4 pt-4">
      <h1 className="text-xl font-bold text-text mb-6">Mes Commandes</h1>

      <div className="space-y-3">
        {orders.map((order, i) => {
          const config = statusConfig[order.status] || statusConfig.CONFIRMED;
          const Icon = config.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-text-muted bg-cream px-2 py-1 rounded-full">
                  {order.id}
                </span>
                <span className="text-xs text-text-muted">{order.date}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon size={18} className={config.color} />
                  <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {order.total.toLocaleString()} FC
                </span>
              </div>

              {order.status === "IN_TRANSIT" && order.eta && (
                <div className="glass p-3 rounded-xl flex items-center gap-2">
                  <Clock size={14} className="text-accent" />
                  <span className="text-xs text-text-muted">
                    Arrivée estimée : <span className="font-semibold text-text">{order.eta}</span>
                  </span>
                </div>
              )}

              {order.status === "DELIVERED" && (
                <div className="glass p-3 rounded-xl flex items-center gap-2">
                  <MapPin size={14} className="text-sage" />
                  <span className="text-xs text-sage font-medium">Livrée avec succès</span>
                </div>
              )}

              <div className="flex items-center gap-1 mt-3 text-xs text-text-muted">
                <Package size={12} />
                {order.items} article{order.items > 1 ? "s" : ""}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
