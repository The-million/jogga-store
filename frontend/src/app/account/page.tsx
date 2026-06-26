"use client";

import { useState } from "react";
import {
  Settings, Gift, Coins, Ticket, CreditCard, Wallet, ShoppingBag,
  Clock, Truck, Star, RotateCcw, HeadphonesIcon, RefreshCw,
  Repeat, Shield, AlertTriangle, Heart, Eye,
} from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"wishlist" | "recent">("wishlist");

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      {/* ============================================
          1. En-tête de Profil
          ============================================ */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
        <Link href="/auth/login" className="text-lg font-black text-text hover:text-primary transition-colors no-underline">
          Connexion / Inscription <span className="text-primary">›</span>
        </Link>
        <button className="p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <Settings size={20} className="text-text-muted" />
        </button>
      </div>

      {/* ============================================
          2. Cartes Avantages (Grille 2 colonnes)
          ============================================ */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {/* Carte JOGGA CLUB */}
        <div className="border border-slate-100 rounded-2xl p-4 flex flex-col">
          <h3 className="text-xs font-black text-text uppercase tracking-wider mb-3">Avantages Jogga Club</h3>
          <div className="flex items-center gap-3 mb-3 flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Gift size={14} className="text-primary" />
              </div>
              <span className="text-[9px] text-text-muted">Cadeaux</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Coins size={14} className="text-primary" />
              </div>
              <span className="text-[9px] text-text-muted">Points</span>
            </div>
          </div>
          <button className="w-full bg-primary/5 text-primary text-[11px] font-bold py-2 rounded-xl hover:bg-primary/10 transition-colors">
            Rejoindre
          </button>
        </div>

        {/* Carte Coupons */}
        <div className="border border-slate-100 rounded-2xl p-4 flex flex-col">
          <h3 className="text-xs font-black text-text uppercase tracking-wider mb-3">Coupons pour vous !</h3>
          <div className="space-y-2 mb-3 flex-1">
            <div className="flex items-center justify-between bg-accent/5 rounded-lg px-2 py-1.5">
              <Ticket size={14} className="text-accent" />
              <span className="text-xs font-black text-accent">-30%</span>
            </div>
            <div className="flex items-center justify-between bg-accent/5 rounded-lg px-2 py-1.5">
              <Ticket size={14} className="text-accent" />
              <span className="text-xs font-black text-accent">-5.00€</span>
            </div>
          </div>
          <button className="w-full text-[11px] font-bold text-accent hover:underline text-center">
            Voir tout
          </button>
        </div>
      </div>

      {/* ============================================
          3. Barre d'actifs rapides (4 colonnes)
          ============================================ */}
      <div className="grid grid-cols-4 gap-2 px-4 pb-4 border-b border-slate-100">
        {[
          { icon: Ticket, label: "Coupons", color: "text-accent", bg: "bg-accent/5" },
          { icon: Coins, label: "Points", color: "text-amber-500", bg: "bg-amber-50" },
          { icon: Wallet, label: "Portefeuille", color: "text-primary", bg: "bg-primary/5" },
          { icon: CreditCard, label: "C. Cadeaux", color: "text-purple-500", bg: "bg-purple-50" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} className="flex flex-col items-center gap-2 py-3">
              <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center`}>
                <Icon size={18} className={item.color} />
              </div>
              <span className="text-[10px] font-semibold text-text text-center leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================
          4. Mes Commandes
          ============================================ */}
      <div className="border-b border-slate-100">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <h3 className="text-sm font-black text-text uppercase tracking-wider">Mes Commandes</h3>
          <Link href="/orders" className="text-[11px] text-text-muted font-medium no-underline hover:text-primary transition-colors">
            Voir tout ›
          </Link>
        </div>
        <div className="grid grid-cols-5 gap-1 px-4 pb-4">
          {[
            { icon: ShoppingBag, label: "Non payé", count: 0 },
            { icon: Clock, label: "En cours", count: 2 },
            { icon: Truck, label: "Expédié", count: 1 },
            { icon: Star, label: "Avis", count: 0 },
            { icon: RotateCcw, label: "Retours", count: 0 },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i} className="flex flex-col items-center gap-1.5 py-2 relative">
                <Icon size={20} className={item.count > 0 ? "text-primary" : "text-text-light"} />
                {item.count > 0 && (
                  <span className="absolute -top-0.5 right-2 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}
                <span className="text-[9px] font-semibold text-text-muted text-center leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================
          5. Plus de Services
          ============================================ */}
      <div className="border-b border-slate-100">
        <h3 className="px-4 pt-4 pb-3 text-sm font-black text-text uppercase tracking-wider">Plus de Services</h3>
        <div className="grid grid-cols-5 gap-1 px-4 pb-4">
          {[
            { icon: HeadphonesIcon, label: "Service Client" },
            { icon: RefreshCw, label: "Jogga Échange" },
            { icon: Repeat, label: "Abonnements" },
            { icon: Shield, label: "Politiques" },
            { icon: AlertTriangle, label: "Rappels" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i} className="flex flex-col items-center gap-1.5 py-2">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
                  <Icon size={18} className="text-text-muted" />
                </div>
                <span className="text-[9px] font-semibold text-text-muted text-center leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================
          6. Onglets (Liste d'envies / Vus récemment)
          ============================================ */}
      <div className="border-b border-slate-100">
        <div className="flex">
          {[
            { id: "wishlist", label: "Liste d'envies", icon: Heart },
            { id: "recent", label: "Vus récemment", icon: Eye },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "wishlist" | "recent")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 relative transition-colors ${
                  isActive ? "text-text" : "text-text-muted"
                }`}
              >
                <Icon size={16} />
                <span className="text-xs font-bold">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        {/* Tab content */}
        <div className="p-4 min-h-[120px] flex items-center justify-center">
          {activeTab === "wishlist" ? (
            <div className="text-center">
              <Heart size={32} className="mx-auto text-text-light mb-2" />
              <p className="text-xs text-text-muted">Connectez-vous pour voir votre liste d&apos;envies</p>
              <Link href="/auth/login" className="text-xs font-bold text-primary mt-1 inline-block">Se connecter</Link>
            </div>
          ) : (
            <div className="text-center">
              <Eye size={32} className="mx-auto text-text-light mb-2" />
              <p className="text-xs text-text-muted">Aucun produit vu récemment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
