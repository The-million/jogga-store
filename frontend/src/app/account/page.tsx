"use client";

import { User, MapPin, Phone, Mail, Package, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh">
      <header className="sticky top-0 z-40 bg-white border-b border-border px-4 py-3">
        <h1 className="text-sm font-black text-text uppercase tracking-wider">Mon Profil</h1>
      </header>
      <div className="p-4 space-y-4">
        {/* Profile */}
        <div className="bg-surface rounded-2xl p-5 flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <User size={28} className="text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text">Jean K.</h2>
            <div className="flex items-center gap-1 text-[11px] text-text-muted mt-0.5">
              <MapPin size={11} /> 12 Avenue de la Paix, Brazzaville
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/orders" className="bg-surface rounded-2xl p-4">
            <Package size={20} className="text-primary" />
            <span className="text-2xl font-black text-text block mt-1">3</span>
            <span className="text-[11px] text-text-muted">Commandes</span>
          </Link>
          <div className="bg-surface rounded-2xl p-4">
            <MapPin size={20} className="text-accent" />
            <span className="text-[11px] text-text-muted block mt-1">Adresse</span>
            <span className="text-xs font-semibold text-primary">Modifier</span>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-surface rounded-2xl divide-y divide-border overflow-hidden">
          {[
            { icon: User, label: "Informations personnelles" },
            { icon: MapPin, label: "Adresses de livraison" },
            { icon: Phone, label: "Numéro de téléphone" },
            { icon: Mail, label: "Contacter le support" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Link key={i} href="#" className="flex items-center gap-3 p-4 hover:bg-white/50 transition-colors">
                <Icon size={17} className="text-text-muted" />
                <span className="text-sm flex-1">{item.label}</span>
                <ChevronRight size={15} className="text-text-light" />
              </Link>
            );
          })}
        </div>

        <button className="w-full bg-surface rounded-2xl p-4 text-sm text-red-500 font-semibold flex items-center justify-center gap-2">
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </div>
  );
}
