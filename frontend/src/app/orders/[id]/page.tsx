"use client";

import { use, useEffect, useState } from "react";
import { ArrowLeft, ShoppingBag, CheckCircle2, Package, Truck, Home, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCurrency } from "@/lib/CurrencyContext";
import { useAuth } from "@/lib/AuthContext";
import { api, ApiOrder } from "@/lib/api";

// ─── Timeline steps ───────────────────────────────────────────────────────────

const STEPS = [
  {
    status: "CONFIRMED",
    label: "Commande confirmée",
    desc: "Votre commande a été reçue et validée",
    icon: CheckCircle2,
    estimate: "Immédiat",
    doneColor: "bg-primary",
    textColor: "text-primary",
  },
  {
    status: "PREPARING",
    label: "En préparation",
    desc: "Nos équipes préparent vos articles avec soin",
    icon: Package,
    estimate: "Sous 2h",
    doneColor: "bg-accent",
    textColor: "text-accent",
  },
  {
    status: "IN_TRANSIT",
    label: "En route",
    desc: "Le livreur est en chemin vers vous",
    icon: Truck,
    estimate: "Sous 12h",
    doneColor: "bg-amber-500",
    textColor: "text-amber-600",
  },
  {
    status: "DELIVERED",
    label: "Livré ✓",
    desc: "Commande livrée avec succès !",
    icon: Home,
    estimate: "Sous 24h garantis",
    doneColor: "bg-green-500",
    textColor: "text-green-600",
  },
];

const STATUS_ORDER = ["CONFIRMED", "PREPARING", "IN_TRANSIT", "DELIVERED"];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get<ApiOrder>(`/orders/${id}`)
      .then(setOrder)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-dvh">
        <header className="px-4 py-3 flex items-center gap-3 border-b border-border sticky top-0 bg-white z-40">
          <button onClick={() => router.back()} className="p-1.5 -ml-1.5">
            <ArrowLeft size={21} />
          </button>
          <div className="h-4 bg-surface rounded w-32 animate-pulse" />
        </header>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 bg-surface rounded-full" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-surface rounded w-3/4" />
                <div className="h-3 bg-surface rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-dvh flex flex-col">
        <header className="px-4 py-3 flex items-center gap-3 border-b border-border">
          <button onClick={() => router.back()} className="p-1.5 -ml-1.5"><ArrowLeft size={21} /></button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <ShoppingBag size={48} className="text-text-light mb-3" />
          <p className="text-sm font-bold text-text">Commande introuvable</p>
          <button onClick={() => router.back()} className="text-primary font-bold text-sm mt-3">Retour</button>
        </div>
      </div>
    );
  }

  // ─── Compute timeline state ───────────────────────────────────────────────

  const isCancelled = order.statuses.some((s) => s.status === "CANCELLED");
  const latestStatus = isCancelled
    ? "CANCELLED"
    : order.statuses.length > 0
      ? order.statuses[order.statuses.length - 1].status
      : "CONFIRMED";

  const currentStepIndex = STATUS_ORDER.indexOf(latestStatus);

  // Map: status → actual timestamp from statuses array
  const statusTimestamps: Record<string, string> = {};
  for (const s of order.statuses) {
    statusTimestamps[s.status] = s.createdAt;
  }

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 -ml-1.5">
          <ArrowLeft size={21} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-text truncate">{order.orderNumber}</p>
          <p className="text-[10px] text-text-muted">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
          isCancelled ? "bg-red-50 text-red-500" :
          latestStatus === "DELIVERED" ? "bg-green-50 text-green-600" :
          "bg-primary/10 text-primary"
        }`}>
          {isCancelled ? "Annulée" : latestStatus === "DELIVERED" ? "Livrée" : "En cours"}
        </span>
      </header>

      {/* ─── TIMELINE ─────────────────────────────────────────────────────── */}
      <div className="px-5 py-6">
        <p className="font-bebas text-lg tracking-wider text-text mb-5">SUIVI DE COMMANDE</p>

        {/* Cancelled state */}
        {isCancelled ? (
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle size={18} className="text-red-500" />
              </div>
            </div>
            <div className="pt-1.5">
              <p className="text-sm font-bold text-red-500">Commande annulée</p>
              <p className="text-xs text-text-muted mt-0.5">
                {statusTimestamps["CANCELLED"] ? formatDateTime(statusTimestamps["CANCELLED"]) : ""}
              </p>
            </div>
          </div>
        ) : (
          /* Normal timeline */
          <div>
            {STEPS.map((step, i) => {
              const stepIndex = STATUS_ORDER.indexOf(step.status);
              const isDone = stepIndex <= currentStepIndex;
              const isCurrent = stepIndex === currentStepIndex;
              const isPending = stepIndex > currentStepIndex;
              const isLast = i === STEPS.length - 1;
              const Icon = step.icon;
              const timestamp = statusTimestamps[step.status];

              return (
                <div key={step.status} className="flex gap-4">
                  {/* Circle + line */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={isCurrent ? { scale: 0.8 } : false}
                      animate={isCurrent ? { scale: [1, 1.12, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isDone
                          ? step.doneColor
                          : "bg-surface border-2 border-border"
                      } ${isCurrent ? "ring-4 ring-offset-1 ring-primary/20" : ""}`}
                    >
                      {isDone ? (
                        isCurrent && step.status !== "DELIVERED" ? (
                          <Icon size={17} className="text-white" />
                        ) : (
                          <CheckCircle2 size={17} className="text-white" />
                        )
                      ) : (
                        <Icon size={17} className="text-text-light" />
                      )}
                    </motion.div>

                    {!isLast && (
                      <div className={`w-0.5 flex-1 my-1.5 min-h-[32px] rounded-full transition-colors ${
                        isDone && !isCurrent ? "bg-primary" :
                        isCurrent ? "bg-gradient-to-b from-primary to-border" :
                        "bg-border"
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-6 flex-1 min-w-0 ${isPending ? "opacity-40" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-bold leading-snug ${isDone ? step.textColor : "text-text-muted"}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="shrink-0 text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full animate-pulse">
                          EN COURS
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{step.desc}</p>
                    <p className="text-[10px] mt-1.5 font-semibold">
                      {timestamp ? (
                        <span className="text-text-muted">{formatDateTime(timestamp)}</span>
                      ) : (
                        <span className={isPending ? "text-text-light" : "text-accent"}>
                          <Clock size={10} className="inline mr-1" />
                          Estimé : {step.estimate}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delivery promise badge */}
        {!isCancelled && latestStatus !== "DELIVERED" && (
          <div className="mt-2 bg-primary/5 rounded-2xl px-4 py-3 flex items-center gap-3">
            <Truck size={18} className="text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-primary">Livraison garantie sous 24h</p>
              <p className="text-[10px] text-text-muted">à partir de la confirmation de commande</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── RÉSUMÉ COMMANDE ──────────────────────────────────────────────── */}
      <div className="border-t border-border px-5 py-5">
        <p className="font-bebas text-lg tracking-wider text-text mb-4">ARTICLES COMMANDÉS</p>

        <div className="space-y-3">
          {order.items.map((item, i) => {
            const imageUrl = (item.product as any).imageUrl ?? null;
            return (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-14 h-14 bg-surface rounded-xl overflow-hidden shrink-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text line-clamp-2 leading-snug">{item.product.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Qté : {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-text shrink-0">
                  {formatPrice(Number(item.unitPrice) * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-[11px] text-text-muted">
            <span>{itemCount} article{itemCount > 1 ? "s" : ""}</span>
            <span>{formatPrice(Number(order.totalAmount))}</span>
          </div>
          <div className="flex justify-between text-[11px] text-text-muted">
            <span>Livraison</span>
            <span className="text-green-600 font-bold">Gratuite</span>
          </div>
          <div className="flex justify-between text-sm font-black text-text pt-1 border-t border-border">
            <span>Total</span>
            <span className="text-primary">{formatPrice(Number(order.totalAmount))}</span>
          </div>
          <div className="flex justify-between text-[10px] text-text-muted">
            <span>Mode de paiement</span>
            <span className="font-semibold">
              {order.paymentMode === "cash" ? "Cash à la livraison" : "Mobile Money"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-8" />
    </div>
  );
}
