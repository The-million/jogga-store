"use client";

import { User, MapPin, Phone, Mail, Package, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const user = {
    fullName: "Jean K.",
    email: "jean@email.com",
    phone: "+242 06 123 4567",
    address: "12 Avenue de la Paix, Brazzaville",
    ordersCount: 2,
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-4">
      <h1 className="text-xl font-bold text-text mb-6">Mon Compte</h1>

      {/* Profile card */}
      <div className="glass-strong p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <User size={28} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text">{user.fullName}</h2>
            <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
              <MapPin size={12} />
              {user.address}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link href="/orders" className="glass p-4 rounded-2xl">
          <Package size={22} className="text-primary mb-1" />
          <span className="text-2xl font-bold text-text block">{user.ordersCount}</span>
          <span className="text-xs text-text-muted">Commandes</span>
        </Link>
        <div className="glass p-4 rounded-2xl">
          <MapPin size={22} className="text-sage mb-1" />
          <span className="text-xs text-sage font-medium block mt-1">Adresse enregistrée</span>
          <span className="text-xs text-text-muted">Modifier</span>
        </div>
      </div>

      {/* Menu items */}
      <div className="glass-strong divide-y divide-primary/5 overflow-hidden">
        {[
          { icon: User, label: "Informations personnelles", href: "#" },
          { icon: MapPin, label: "Adresses de livraison", href: "#" },
          { icon: Phone, label: "Numéro de téléphone", href: "#" },
          { icon: Mail, label: "Contacter le support", href: "#" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-3 p-4 hover:bg-cream/50 transition-colors"
            >
              <Icon size={18} className="text-text-muted" />
              <span className="text-sm flex-1">{item.label}</span>
              <ChevronRight size={16} className="text-text-muted/30" />
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <button className="w-full mt-4 glass p-4 rounded-2xl text-sm text-red-500 font-medium flex items-center justify-center gap-2">
        <LogOut size={16} />
        Déconnexion
      </button>
    </div>
  );
}
