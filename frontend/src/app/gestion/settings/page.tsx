"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Loader2, Save, RefreshCw, ImageIcon, X } from "lucide-react";
import { api } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getToken() {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function uploadImage(file: File, folder = "jogga/hero"): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const token = getToken();
  const res = await fetch(`${API_URL}/uploads/product-image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  if (!res.ok) throw new Error("Échec upload");
  return (await res.json()).url as string;
}

type Settings = {
  exchangeRate?: number;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string | null;
  heroCta?: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    exchangeRate: 655.957,
    heroTitle: "Votre lifestyle, redéfini.",
    heroSubtitle: "Mode, tech, sport — tout en un.",
    heroImageUrl: null,
    heroCta: "Découvrir la collection",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<Record<string, any>>("/settings")
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await api.patch("/settings", settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleHeroUpload = async (file: File) => {
    setUploadingHero(true);
    try {
      const url = await uploadImage(file);
      setSettings((s) => ({ ...s, heroImageUrl: url }));
    } catch { setError("Échec upload image hero"); }
    finally { setUploadingHero(false); }
  };

  const set = (key: keyof Settings, val: any) => setSettings((s) => ({ ...s, [key]: val }));

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Paramètres du site</h1>
        <p className="text-gray-500 text-sm mt-0.5">Taux de change, hero banner, textes…</p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 text-green-700 text-sm font-bold px-4 py-3 rounded-xl">
          ✓ Paramètres enregistrés
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 text-red-600 text-sm font-bold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="space-y-5">

        {/* Taux de change */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Taux de change</h2>
            <p className="text-xs text-gray-400 mt-0.5">Utilisé pour convertir et afficher les prix en devise locale.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">1 USD = __ FCFA</label>
              <input
                type="number"
                step="0.001"
                min={1}
                value={settings.exchangeRate ?? ""}
                onChange={(e) => set("exchangeRate", Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50"
                placeholder="655.957"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center min-w-[120px]">
              <p className="text-xs text-gray-400">Exemple</p>
              <p className="text-lg font-black text-gray-900 mt-1">
                {((settings.exchangeRate ?? 655) * 50).toLocaleString("fr-FR")}
              </p>
              <p className="text-[10px] text-gray-400">pour 50 USD</p>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => set("exchangeRate", 655.957)} className="text-xs font-bold text-gray-400 hover:text-primary">
              Réinitialiser (655.957 XOF)
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Hero Banner</h2>
            <p className="text-xs text-gray-400 mt-0.5">Bandeau principal visible sur la page d'accueil.</p>
          </div>

          {/* Image hero */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image de fond</label>
            <div className="flex gap-4 items-start">
              <div className="w-40 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200 relative">
                {settings.heroImageUrl ? (
                  <>
                    <img src={settings.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => set("heroImageUrl", null)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-300" />
                  </div>
                )}
              </div>
              <label className={`flex-1 flex items-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-primary/50 transition-colors text-sm text-gray-500 ${uploadingHero ? "opacity-60 pointer-events-none" : ""}`}>
                {uploadingHero ? <Loader2 size={16} className="animate-spin text-primary" /> : <Upload size={16} className="text-gray-400" />}
                {uploadingHero ? "Upload en cours…" : "Uploader une image hero"}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleHeroUpload(f); }} />
              </label>
            </div>
            <div className="mt-2">
              <input
                type="url"
                value={settings.heroImageUrl ?? ""}
                onChange={(e) => set("heroImageUrl", e.target.value || null)}
                placeholder="Ou coller une URL d'image…"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* Textes */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Titre principal</label>
              <input
                type="text"
                value={settings.heroTitle ?? ""}
                onChange={(e) => set("heroTitle", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50"
                placeholder="Votre lifestyle, redéfini."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sous-titre</label>
              <input
                type="text"
                value={settings.heroSubtitle ?? ""}
                onChange={(e) => set("heroSubtitle", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50"
                placeholder="Mode, tech, sport — tout en un."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Texte du bouton</label>
              <input
                type="text"
                value={settings.heroCta ?? ""}
                onChange={(e) => set("heroCta", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50"
                placeholder="Découvrir la collection"
              />
            </div>
          </div>

          {/* Preview */}
          {(settings.heroTitle || settings.heroSubtitle) && (
            <div
              className="relative rounded-xl h-28 overflow-hidden flex items-center px-6"
              style={{ background: settings.heroImageUrl ? `url(${settings.heroImageUrl}) center/cover` : "linear-gradient(135deg, #1a1a1a 0%, #333 100%)" }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10">
                <p className="text-white text-lg font-black leading-tight">{settings.heroTitle}</p>
                <p className="text-white/80 text-xs mt-0.5">{settings.heroSubtitle}</p>
                <span className="mt-2 inline-block bg-white text-gray-900 text-xs font-black px-3 py-1 rounded-full">
                  {settings.heroCta || "Découvrir"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Enregistrement…" : "Enregistrer les paramètres"}
        </button>
      </div>
    </div>
  );
}
