"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, ExternalLink, ImageIcon, Upload, Loader2 } from "lucide-react";
import { api, ApiCategory } from "@/lib/api";

type FormState = { name: string; slug: string; imageUrl: string };

function slugify(s: string) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");
}

const EMPTY: FormState = { name: "", slug: "", imageUrl: "" };
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getToken() {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  const load = () => {
    api.get<ApiCategory[]>("/categories")
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (field: keyof FormState, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const handleNameChange = (val: string) => {
    setForm((f) => ({ ...f, name: val, slug: f.slug === slugify(f.name) || !f.slug ? slugify(val) : f.slug }));
  };

  const startCreate = () => { setCreating(true); setEditing(null); setForm(EMPTY); setError(null); };
  const startEdit = (cat: ApiCategory) => {
    setEditing(cat.id); setCreating(false);
    setForm({ name: cat.name, slug: cat.slug, imageUrl: cat.imageUrl ?? "" });
    setError(null);
  };
  const cancel = () => { setEditing(null); setCreating(false); setForm(EMPTY); setError(null); };

  const handleImageUpload = async (file: File) => {
    setUploadingImg(true);
    const fd = new FormData();
    fd.append("file", file);
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/uploads/product-image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error("Échec upload");
      const data = await res.json();
      setForm((f) => ({ ...f, imageUrl: data.url }));
    } catch { setError("Échec upload image"); }
    finally { setUploadingImg(false); }
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) { setError("Nom et slug requis"); return; }
    setSaving(true); setError(null);
    try {
      const payload = { name: form.name, slug: form.slug, imageUrl: form.imageUrl || null };
      if (creating) {
        const created = await api.post<ApiCategory>("/categories", payload);
        setCategories((prev) => [...prev, created]);
      } else if (editing) {
        const updated = await api.put<ApiCategory>(`/categories/${editing}`, payload);
        setCategories((prev) => prev.map((c) => (c.id === editing ? updated : c)));
      }
      cancel();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: ApiCategory) => {
    if (!confirm(`Supprimer "${cat.name}" ? Les produits liés perdront leur catégorie.`)) return;
    try {
      await api.delete(`/categories/${cat.id}`);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch (e: any) {
      alert(e.message);
    }
  };

  const FormPanel = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">
        {creating ? "Nouvelle catégorie" : "Modifier la catégorie"}
      </h3>
      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nom *</label>
        <input
          type="text" value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
          placeholder="Électronique"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Slug URL *</label>
        <input
          type="text" value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none focus:border-primary/50 transition-colors"
          placeholder="electronique"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Image URL</label>
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline">
            <ExternalLink size={10} /> Unsplash
          </a>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="w-14 h-14 border border-gray-200 rounded-xl overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center relative">
              {form.imageUrl ? (
                <>
                  <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => set("imageUrl", "")} className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-bl-lg flex items-center justify-center">
                    <X size={9} className="text-white" />
                  </button>
                </>
              ) : (
                <ImageIcon size={16} className="text-gray-300" />
              )}
            </div>
            <label className={`flex-1 flex items-center gap-2 border border-dashed border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 cursor-pointer hover:border-primary/50 transition-colors ${uploadingImg ? "opacity-60 pointer-events-none" : ""}`}>
              {uploadingImg ? <Loader2 size={13} className="animate-spin text-primary" /> : <Upload size={13} className="text-gray-400" />}
              {uploadingImg ? "Upload en cours…" : "Uploader une image (Cloudinary)"}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
            </label>
          </div>
          <input
            type="url" value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
            placeholder="Ou coller une URL…"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave} disabled={saving}
          className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : creating ? "Créer" : "Mettre à jour"}
        </button>
        <button onClick={cancel} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
          Annuler
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Catégories</h1>
          <p className="text-gray-500 text-sm mt-0.5">{categories.length} catégorie{categories.length !== 1 ? "s" : ""}</p>
        </div>
        {!creating && !editing && (
          <button onClick={startCreate} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Nouvelle catégorie
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-3">
          {loading && (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-20 shadow-sm" />
            ))
          )}
          {!loading && categories.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400 text-sm">
              Aucune catégorie — créez-en une !
            </div>
          )}
          {!loading && categories.map((cat) => (
            <div key={cat.id} className={`bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 transition-all ${editing === cat.id ? "ring-2 ring-primary/30" : ""}`}>
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📁</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                <p className="text-xs font-mono text-gray-400">{cat.slug}</p>
                {cat._count && (
                  <p className="text-[10px] text-gray-400 mt-0.5">{cat._count.products} produit{cat._count.products !== 1 ? "s" : ""}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(cat)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-primary" title="Modifier">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(cat)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500" title="Supprimer">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-1">
          {(creating || editing) && <FormPanel />}
          {!creating && !editing && (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <p className="text-sm text-gray-400">Sélectionnez une catégorie à modifier ou créez-en une nouvelle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
