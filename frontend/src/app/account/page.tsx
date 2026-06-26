"use client";

import { useState, useEffect } from "react";
import {
  Settings, Gift, Coins, Ticket, CreditCard, Wallet, ShoppingBag,
  HeadphonesIcon, RefreshCw, Repeat, Shield, AlertTriangle, Heart, Eye,
  LogOut, User, X, Phone, ChevronRight, Lock, MapPin, Package, Home,
  XCircle, Plus, Trash2, CheckCircle2, Truck, ArrowLeft, Check, Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { api, ApiOrder, ApiAddress, ApiWishlistItem } from "@/lib/api";
import { getRecentlyViewed, RecentlyViewedItem } from "@/lib/recentlyViewed";

// ─── Types locaux ─────────────────────────────────────────────────────────────
type Toast = { msg: string; ok?: boolean };
type SettingsPanel = "main" | "profile" | "password" | "addresses" | "add-address";

// ─── Config statuts commandes ──────────────────────────────────────────────────
const ORDER_STATUS: Record<string, { label: string; color: string; bg: string; icon: typeof Package }> = {
  CONFIRMED:  { label: "Confirmée",      color: "text-primary",   bg: "bg-primary/10",  icon: CheckCircle2 },
  PREPARING:  { label: "En préparation", color: "text-accent",    bg: "bg-accent/10",   icon: Package },
  IN_TRANSIT: { label: "En route 🚚",    color: "text-amber-600", bg: "bg-amber-50",    icon: Truck },
  DELIVERED:  { label: "Livrée ✓",       color: "text-green-600", bg: "bg-green-50",    icon: Home },
  CANCELLED:  { label: "Annulée",        color: "text-red-500",   bg: "bg-red-50",      icon: XCircle },
};

function latestStatus(order: ApiOrder): string {
  if (!order.statuses || order.statuses.length === 0) return "CONFIRMED";
  if (order.statuses.some((s) => s.status === "CANCELLED")) return "CANCELLED";
  return order.statuses[order.statuses.length - 1].status;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"wishlist" | "recent">("wishlist");
  const [toast, setToast] = useState<Toast | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPanel, setSettingsPanel] = useState<SettingsPanel>("main");

  // Orders
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Wishlist
  const [wishlistItems, setWishlistItems] = useState<ApiWishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Recently viewed
  const [recentItems, setRecentItems] = useState<RecentlyViewedItem[]>([]);

  // Addresses
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "Maison", fullName: "", phone: "", street: "", city: "" });
  const [addrSaving, setAddrSaving] = useState(false);

  // Profile edit
  const [profileForm, setProfileForm] = useState({ fullName: "", email: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password change
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const { user, isAuthenticated, logout, loading } = useAuth();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  // Init profile form when user loads
  useEffect(() => {
    if (user) setProfileForm({ fullName: user.fullName, email: user.email, phone: user.phone });
  }, [user]);

  // Load recently viewed
  useEffect(() => { setRecentItems(getRecentlyViewed()); }, []);

  // Load orders
  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    api.get<ApiOrder[]>("/orders/mine")
      .then(setOrders).catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  // Load wishlist when tab is active
  useEffect(() => {
    if (activeTab !== "wishlist" || !user) return;
    setWishlistLoading(true);
    api.get<ApiWishlistItem[]>("/wishlist")
      .then(setWishlistItems).catch(() => setWishlistItems([]))
      .finally(() => setWishlistLoading(false));
  }, [activeTab, user]);

  // Load addresses when addresses panel opens
  useEffect(() => {
    if (settingsPanel !== "addresses" || !user) return;
    setAddrLoading(true);
    api.get<ApiAddress[]>("/addresses")
      .then(setAddresses).catch(() => setAddresses([]))
      .finally(() => setAddrLoading(false));
  }, [settingsPanel, user]);

  const showToast = (msg: string, ok = false) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2800);
  };

  const handleLogout = () => { logout(); router.push("/"); };

  const openSettings = (panel: SettingsPanel = "main") => {
    setSettingsPanel(panel);
    setShowSettings(true);
  };

  // ─── Profile save ────────────────────────────────────────────────────────────
  const saveProfile = async () => {
    setProfileSaving(true);
    try {
      await api.patch("/users/me", profileForm);
      showToast("Profil mis à jour ✓", true);
      setSettingsPanel("main");
      // Refresh page so AuthContext re-fetches
      router.refresh();
    } catch (e: any) {
      showToast(e.message || "Erreur lors de la mise à jour");
    } finally {
      setProfileSaving(false);
    }
  };

  // ─── Password save ───────────────────────────────────────────────────────────
  const savePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast("Les mots de passe ne correspondent pas");
      return;
    }
    if (pwForm.newPassword.length < 8) {
      showToast("Minimum 8 caractères");
      return;
    }
    setPwSaving(true);
    try {
      await api.patch("/users/me/password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      showToast("Mot de passe modifié ✓", true);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSettingsPanel("main");
    } catch (e: any) {
      showToast(e.message || "Erreur lors du changement de mot de passe");
    } finally {
      setPwSaving(false);
    }
  };

  // ─── Address actions ─────────────────────────────────────────────────────────
  const saveAddress = async () => {
    if (!newAddr.fullName || !newAddr.phone || !newAddr.street || !newAddr.city) {
      showToast("Veuillez remplir tous les champs");
      return;
    }
    setAddrSaving(true);
    try {
      const created = await api.post<ApiAddress>("/addresses", newAddr);
      setAddresses((prev) => [created, ...prev]);
      setNewAddr({ label: "Maison", fullName: "", phone: "", street: "", city: "" });
      setSettingsPanel("addresses");
      showToast("Adresse ajoutée ✓", true);
    } catch (e: any) {
      showToast(e.message || "Erreur lors de l'ajout");
    } finally {
      setAddrSaving(false);
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      await api.patch(`/addresses/${id}/default`, {});
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    } catch { showToast("Erreur lors de la mise à jour"); }
  };

  const deleteAddress = async (id: string) => {
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast("Adresse supprimée");
    } catch { showToast("Erreur lors de la suppression"); }
  };

  // ─── Wishlist actions ─────────────────────────────────────────────────────────
  const removeFromWishlist = async (productId: string) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlistItems((prev) => prev.filter((i) => i.product.id !== productId));
    } catch { showToast("Erreur"); }
  };

  const recentOrders = orders.slice(0, 3);

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-dvh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none ${toast.ok ? "bg-green-500" : "bg-text"}`}>
          {toast.msg}
        </div>
      )}

      {/* ─── Modal Contact ─── */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowContact(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 pb-10">
            <button onClick={() => setShowContact(false)} className="absolute top-4 right-4 p-1">
              <X size={20} className="text-text-muted" />
            </button>
            <h3 className="font-bebas text-xl tracking-wider mb-4">SERVICE CLIENT</h3>
            <div className="space-y-3">
              <a href="tel:+242061234567" className="flex items-center gap-3 p-4 bg-surface rounded-2xl no-underline">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">Appeler</p>
                  <p className="text-sm font-black text-primary">+242 06 123 4567</p>
                </div>
              </a>
              <a href="https://wa.me/242061234567" className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl no-underline">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">WhatsApp</p>
                  <p className="text-sm font-black text-green-600">Envoyer un message</p>
                </div>
              </a>
            </div>
            <p className="text-[10px] text-text-muted text-center mt-4">Disponible Lun–Sam · 8h–20h</p>
          </div>
        </div>
      )}

      {/* ─── Modal Settings ─── */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowSettings(false); setSettingsPanel("main"); }} />
          <div className="relative bg-white rounded-t-3xl w-full max-w-md mx-auto pb-10 max-h-[85dvh] flex flex-col">

            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border shrink-0">
              {settingsPanel !== "main" && (
                <button onClick={() => setSettingsPanel("main")} className="p-1 -ml-1">
                  <ArrowLeft size={18} className="text-text-muted" />
                </button>
              )}
              <h3 className="font-bebas text-xl tracking-wider flex-1">
                {settingsPanel === "main" && "PARAMÈTRES"}
                {settingsPanel === "profile" && "MON PROFIL"}
                {settingsPanel === "password" && "MOT DE PASSE"}
                {settingsPanel === "addresses" && "MES ADRESSES"}
                {settingsPanel === "add-address" && "NOUVELLE ADRESSE"}
              </h3>
              <button onClick={() => { setShowSettings(false); setSettingsPanel("main"); }} className="p-1">
                <X size={20} className="text-text-muted" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">

              {/* ── Main panel ── */}
              {settingsPanel === "main" && (
                <div className="px-5 pt-3">
                  {user && (
                    <div className="flex items-center gap-4 py-4 border-b border-border mb-2">
                      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="font-bebas text-2xl text-primary">{user.fullName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text">{user.fullName}</p>
                        <p className="text-[11px] text-text-muted">{user.email}</p>
                        <p className="text-[11px] text-text-muted">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  {[
                    { icon: User, label: "Modifier mon profil", sub: "Nom, téléphone, email", panel: "profile" as SettingsPanel },
                    { icon: Lock, label: "Changer le mot de passe", sub: "Sécurité du compte", panel: "password" as SettingsPanel },
                    { icon: MapPin, label: "Mes adresses de livraison", sub: `${addresses.length || "…"} adresse${addresses.length !== 1 ? "s" : ""}`, panel: "addresses" as SettingsPanel },
                  ].map((opt, i) => {
                    const Icon = opt.icon;
                    return (
                      <button key={i} onClick={() => setSettingsPanel(opt.panel)} className="w-full flex items-center gap-4 py-3.5 text-left border-b border-border last:border-0">
                        <div className="w-9 h-9 bg-surface rounded-xl flex items-center justify-center shrink-0">
                          <Icon size={17} className="text-text-muted" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-text">{opt.label}</p>
                          <p className="text-[10px] text-text-muted">{opt.sub}</p>
                        </div>
                        <ChevronRight size={16} className="text-text-light" />
                      </button>
                    );
                  })}
                  <button onClick={() => { setShowSettings(false); handleLogout(); }} className="w-full flex items-center gap-4 py-3.5 text-left mt-3">
                    <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                      <LogOut size={17} className="text-red-500" />
                    </div>
                    <p className="text-sm font-semibold text-red-500">Se déconnecter</p>
                  </button>
                </div>
              )}

              {/* ── Profile form ── */}
              {settingsPanel === "profile" && (
                <div className="px-5 py-4 space-y-4">
                  {(["fullName", "email", "phone"] as const).map((field) => (
                    <div key={field}>
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                        {field === "fullName" ? "Nom complet" : field === "email" ? "Email" : "Téléphone"}
                      </label>
                      <input
                        type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                        value={profileForm[field]}
                        onChange={(e) => setProfileForm((p) => ({ ...p, [field]: e.target.value }))}
                        className="w-full bg-surface rounded-2xl px-4 py-3 text-sm text-text outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  ))}
                  <button
                    onClick={saveProfile}
                    disabled={profileSaving}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl text-sm disabled:opacity-60 mt-2"
                  >
                    {profileSaving ? "Enregistrement…" : "Enregistrer les modifications"}
                  </button>
                </div>
              )}

              {/* ── Password form ── */}
              {settingsPanel === "password" && (
                <div className="px-5 py-4 space-y-4">
                  {[
                    { key: "currentPassword", label: "Mot de passe actuel" },
                    { key: "newPassword", label: "Nouveau mot de passe" },
                    { key: "confirmPassword", label: "Confirmer le nouveau" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">{label}</label>
                      <input
                        type="password"
                        value={pwForm[key as keyof typeof pwForm]}
                        onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full bg-surface rounded-2xl px-4 py-3 text-sm text-text outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="••••••••"
                      />
                    </div>
                  ))}
                  <p className="text-[10px] text-text-muted">Minimum 8 caractères</p>
                  <button
                    onClick={savePassword}
                    disabled={pwSaving}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl text-sm disabled:opacity-60"
                  >
                    {pwSaving ? "Changement…" : "Changer le mot de passe"}
                  </button>
                </div>
              )}

              {/* ── Addresses list ── */}
              {settingsPanel === "addresses" && (
                <div className="px-5 py-4">
                  <button
                    onClick={() => setSettingsPanel("add-address")}
                    className="w-full flex items-center gap-3 border-2 border-dashed border-border rounded-2xl px-4 py-3 mb-4 text-text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                    <span className="text-sm font-semibold">Ajouter une adresse</span>
                  </button>

                  {addrLoading ? (
                    <div className="space-y-2">
                      {[1, 2].map((i) => <div key={i} className="h-20 bg-surface rounded-2xl animate-pulse" />)}
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin size={28} className="mx-auto text-text-light mb-2" />
                      <p className="text-xs text-text-muted">Aucune adresse enregistrée</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {addresses.map((addr) => (
                        <div key={addr.id} className={`rounded-2xl p-4 border ${addr.isDefault ? "border-primary/30 bg-primary/5" : "border-border bg-surface"}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-black text-text">{addr.label}</span>
                                {addr.isDefault && (
                                  <span className="text-[9px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">PAR DÉFAUT</span>
                                )}
                              </div>
                              <p className="text-xs text-text-muted">{addr.fullName} · {addr.phone}</p>
                              <p className="text-xs text-text-muted">{addr.street}, {addr.city}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              {!addr.isDefault && (
                                <button onClick={() => setDefaultAddress(addr.id)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Définir par défaut">
                                  <Check size={14} />
                                </button>
                              )}
                              <button onClick={() => deleteAddress(addr.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Add address form ── */}
              {settingsPanel === "add-address" && (
                <div className="px-5 py-4 space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">Type d'adresse</label>
                    <div className="flex gap-2">
                      {["Maison", "Bureau", "Autre"].map((l) => (
                        <button
                          key={l}
                          onClick={() => setNewAddr((p) => ({ ...p, label: l }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${newAddr.label === l ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-text-muted"}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {[
                    { key: "fullName", label: "Nom du destinataire", placeholder: "Ex: Marie Mboungou" },
                    { key: "phone", label: "Téléphone", placeholder: "+242 06 000 0000" },
                    { key: "street", label: "Adresse / Rue", placeholder: "Ex: Av. de la Paix, Q. Bacongo" },
                    { key: "city", label: "Ville", placeholder: "Ex: Brazzaville" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1.5">{label}</label>
                      <input
                        type={key === "phone" ? "tel" : "text"}
                        value={newAddr[key as keyof typeof newAddr]}
                        onChange={(e) => setNewAddr((p) => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-surface rounded-2xl px-4 py-3 text-sm text-text outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-text-light"
                      />
                    </div>
                  ))}
                  <button
                    onClick={saveAddress}
                    disabled={addrSaving}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl text-sm disabled:opacity-60"
                  >
                    {addrSaving ? "Ajout…" : "Ajouter cette adresse"}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ─── En-tête profil ─── */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="font-bebas text-xl text-primary">{user.fullName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-black text-text leading-tight">{user.fullName}</p>
              <p className="text-[11px] text-text-muted">{user.email}</p>
            </div>
          </div>
        ) : (
          <Link href="/auth/login" className="text-base font-black text-text hover:text-primary transition-colors no-underline">
            Connexion / Inscription <span className="text-primary">›</span>
          </Link>
        )}
        <button onClick={() => openSettings()} className="p-2 rounded-xl hover:bg-slate-50 transition-colors">
          <Settings size={20} className="text-text-muted" />
        </button>
      </div>

      {/* ─── Cartes Avantages ─── */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="border border-slate-100 rounded-2xl p-4 flex flex-col">
          <h3 className="text-xs font-black text-text uppercase tracking-wider mb-3">Jogga Club</h3>
          <div className="flex items-center gap-3 mb-3 flex-1">
            {[{ icon: Gift, label: "Cadeaux" }, { icon: Coins, label: "Points" }].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon size={14} className="text-primary" />
                </div>
                <span className="text-[9px] text-text-muted">{label}</span>
              </div>
            ))}
          </div>
          <button onClick={() => showToast("Jogga Club — Bientôt disponible !")} className="w-full bg-primary/5 text-primary text-[11px] font-bold py-2 rounded-xl hover:bg-primary/10 transition-colors">
            Rejoindre
          </button>
        </div>

        <div className="border border-slate-100 rounded-2xl p-4 flex flex-col">
          <h3 className="text-xs font-black text-text uppercase tracking-wider mb-3">Coupons</h3>
          <div className="space-y-2 mb-3 flex-1">
            {["-30%", "-5.00$"].map((v) => (
              <div key={v} className="flex items-center justify-between bg-accent/5 rounded-lg px-2 py-1.5">
                <Ticket size={14} className="text-accent" />
                <span className="text-xs font-black text-accent">{v}</span>
              </div>
            ))}
          </div>
          <button onClick={() => showToast("Coupons — Bientôt disponible !")} className="w-full text-[11px] font-bold text-accent text-center">Voir tout</button>
        </div>
      </div>

      {/* ─── Actifs rapides ─── */}
      <div className="grid grid-cols-4 gap-2 px-4 pb-4 border-b border-slate-100">
        {[
          { icon: Ticket, label: "Coupons", color: "text-accent", bg: "bg-accent/5", msg: "Coupons bientôt !" },
          { icon: Coins, label: "Points", color: "text-amber-500", bg: "bg-amber-50", msg: "Points de fidélité — Bientôt !" },
          { icon: Wallet, label: "Portefeuille", color: "text-primary", bg: "bg-primary/5", msg: "Portefeuille — Bientôt !" },
          { icon: CreditCard, label: "C. Cadeaux", color: "text-purple-500", bg: "bg-purple-50", msg: "Cartes Cadeaux — Bientôt !" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} onClick={() => showToast(item.msg)} className="flex flex-col items-center gap-2 py-3">
              <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center`}>
                <Icon size={18} className={item.color} />
              </div>
              <span className="text-[10px] font-semibold text-text text-center leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Mes Commandes ─── */}
      <div className="border-b border-slate-100">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <h3 className="font-bebas text-lg tracking-wider text-text">MES COMMANDES</h3>
          <Link href="/orders" className="text-[11px] text-text-muted font-medium no-underline hover:text-primary transition-colors">
            Voir tout ›
          </Link>
        </div>

        {!isAuthenticated ? (
          <div className="px-4 pb-4">
            <Link href="/auth/login" className="block text-center bg-surface text-text-muted text-xs font-semibold py-3.5 rounded-2xl no-underline">
              Connectez-vous pour voir vos commandes
            </Link>
          </div>
        ) : ordersLoading ? (
          <div className="px-4 pb-4 space-y-2">
            {[1, 2].map((i) => <div key={i} className="bg-surface rounded-2xl p-3 animate-pulse h-16" />)}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="px-4 pb-4 text-center">
            <div className="bg-surface rounded-2xl py-6">
              <ShoppingBag size={28} className="mx-auto text-text-light mb-2" />
              <p className="text-xs text-text-muted">Aucune commande pour l'instant</p>
              <Link href="/" className="text-xs font-bold text-primary mt-1 inline-block no-underline">
                Commencer à commander →
              </Link>
            </div>
          </div>
        ) : (
          <div className="px-4 pb-4 space-y-2">
            {recentOrders.map((order) => {
              const statusKey = latestStatus(order);
              const s = ORDER_STATUS[statusKey] ?? ORDER_STATUS.CONFIRMED;
              const Icon = s.icon;
              const itemCount = order.items?.reduce((sum, it) => sum + it.quantity, 0) ?? 0;
              return (
                <Link key={order.id} href={`/orders/${order.id}`} className="block no-underline">
                  <div className="bg-surface rounded-2xl px-4 py-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                      <Icon size={17} className={s.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-text-muted">{order.orderNumber}</span>
                        <span className="text-[9px] text-text-light">· {formatDate(order.createdAt)}</span>
                      </div>
                      <p className={`text-xs font-bold mt-0.5 ${s.color}`}>{s.label}</p>
                      <p className="text-[10px] text-text-muted">{itemCount} article{itemCount > 1 ? "s" : ""}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-text price-tag">{formatPrice(Number(order.totalAmount))}</p>
                      <ChevronRight size={14} className="text-text-light ml-auto mt-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
            {orders.length > 3 && (
              <Link href="/orders" className="block text-center text-xs font-bold text-primary py-2 no-underline">
                Voir toutes les commandes ({orders.length}) →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ─── Plus de Services ─── */}
      <div className="border-b border-slate-100">
        <h3 className="px-4 pt-4 pb-3 text-sm font-black text-text uppercase tracking-wider">Plus de Services</h3>
        <div className="grid grid-cols-5 gap-1 px-4 pb-4">
          {[
            { icon: HeadphonesIcon, label: "Service Client", action: () => setShowContact(true) },
            { icon: RefreshCw, label: "Jogga Échange", action: () => showToast("Échanges — Bientôt !") },
            { icon: Repeat, label: "Abonnements", action: () => showToast("Abonnements — Bientôt !") },
            { icon: Shield, label: "Politiques", action: () => showToast("Retour garanti 7 jours") },
            { icon: AlertTriangle, label: "Rappels", action: () => showToast("Rappels — Bientôt !") },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i} onClick={item.action} className="flex flex-col items-center gap-1.5 py-2">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center">
                  <Icon size={18} className="text-text-muted" />
                </div>
                <span className="text-[9px] font-semibold text-text-muted text-center leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Onglets Wishlist / Récents ─── */}
      <div>
        <div className="flex border-b border-slate-100">
          {[
            { id: "wishlist", label: "Liste d'envies", icon: Heart },
            { id: "recent",   label: "Vus récemment", icon: Eye },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as "wishlist" | "recent");
                  if (tab.id === "recent") setRecentItems(getRecentlyViewed());
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 relative transition-colors ${isActive ? "text-text" : "text-text-muted"}`}
              >
                <Icon size={15} />
                <span className="text-xs font-bold">{tab.label}</span>
                {isActive && <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />}
              </button>
            );
          })}
        </div>

        {/* Wishlist */}
        {activeTab === "wishlist" && (
          <div className="p-4">
            {!isAuthenticated ? (
              <div className="min-h-[120px] flex items-center justify-center text-center">
                <div>
                  <Heart size={32} className="mx-auto text-text-light mb-2" />
                  <p className="text-xs text-text-muted">Connectez-vous pour sauvegarder vos envies</p>
                  <Link href="/auth/login" className="text-xs font-bold text-primary mt-1 inline-block no-underline">Se connecter</Link>
                </div>
              </div>
            ) : wishlistLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => <div key={i} className="aspect-square bg-surface rounded-xl animate-pulse" />)}
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="min-h-[120px] flex items-center justify-center text-center">
                <div>
                  <Heart size={32} className="mx-auto text-text-light mb-2" />
                  <p className="text-xs text-text-muted mb-2">Votre liste d'envies est vide</p>
                  <Link href="/" className="text-xs font-bold text-primary no-underline">Découvrir des articles</Link>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[10px] text-text-muted mb-3 font-medium">{wishlistItems.length} article{wishlistItems.length > 1 ? "s" : ""}</p>
                <div className="grid grid-cols-3 gap-2">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="relative">
                      <Link href={`/${item.product.slug}`} className="block no-underline">
                        <div className="aspect-square bg-surface rounded-xl overflow-hidden mb-1.5">
                          {item.product.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                          )}
                        </div>
                        <p className="text-[10px] font-semibold text-text line-clamp-2 leading-tight pr-3">{item.product.name}</p>
                        <p className="text-[10px] font-bold text-primary mt-0.5">{formatPrice(item.product.price)}</p>
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(item.product.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow"
                      >
                        <X size={11} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Récemment vus */}
        {activeTab === "recent" && (
          <div className="p-4">
            {recentItems.length === 0 ? (
              <div className="min-h-[120px] flex items-center justify-center text-center">
                <div>
                  <Eye size={32} className="mx-auto text-text-light mb-2" />
                  <p className="text-xs text-text-muted">Aucun article vu récemment</p>
                  <Link href="/" className="text-xs font-bold text-primary mt-1 inline-block no-underline">Explorer la boutique</Link>
                </div>
              </div>
            ) : (
              <>
                <p className="text-[10px] text-text-muted mb-3 font-medium">
                  {recentItems.length} article{recentItems.length > 1 ? "s" : ""} · max 25
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {recentItems.map((item) => (
                    <Link key={item.slug} href={`/${item.slug}`} className="block no-underline">
                      <div className="aspect-square bg-surface rounded-xl overflow-hidden mb-1.5">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                        )}
                      </div>
                      <p className="text-[10px] font-semibold text-text line-clamp-2 leading-tight">{item.name}</p>
                      <p className="text-[10px] font-bold text-primary mt-0.5">{formatPrice(item.price)}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
