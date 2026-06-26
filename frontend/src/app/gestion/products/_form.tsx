"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, ImageIcon, Upload, X, Loader2, Plus, Sparkles, Tag, Star } from "lucide-react";
import Link from "next/link";
import { api, ApiProduct, ApiCategory } from "@/lib/api";

type Variant = { name: string; values: string[] };

type FormData = {
  name: string;
  slug: string;
  description: string;
  price: string;
  comparePrice: string;
  stockQuantity: string;
  categoryId: string;
  imageUrls: string[];
  isActive: boolean;
  isNew: boolean;
  isFeatured: boolean;
  variants: Variant[];
};

type Props = { productId?: string };

function slugify(s: string) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");
}

function Toggle({ value, onChange, label, sub }: { value: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer" onClick={() => onChange(!value)}>
      <div className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? "bg-primary" : "bg-gray-200"}`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </label>
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getToken() {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : null;
}

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const token = getToken();
  const res = await fetch(`${API_URL}/uploads/product-image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error("Échec upload");
  const data = await res.json();
  return data.url as string;
}

export function ProductForm({ productId }: Props) {
  const router = useRouter();
  const isEdit = !!productId;

  const [form, setForm] = useState<FormData>({
    name: "", slug: "", description: "", price: "",
    comparePrice: "", stockQuantity: "", categoryId: "",
    imageUrls: [], isActive: true, isNew: false, isFeatured: false, variants: [],
  });
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameEdited, setNameEdited] = useState(false);

  // Images
  const [uploading, setUploading] = useState<number | "new" | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Variants
  const [newVariantName, setNewVariantName] = useState("");
  const variantValueRefs = useRef<Record<number, string>>({});
  const [variantValueInputs, setVariantValueInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    api.get<ApiCategory[]>("/categories").then(setCategories).catch(console.error);
    if (isEdit) {
      api.get<ApiProduct[]>("/products/admin/all").then((products) => {
        const p = products.find((x) => x.id === productId);
        if (!p) return;
        setForm({
          name: p.name,
          slug: p.slug,
          description: p.description ?? "",
          price: String(p.price),
          comparePrice: p.comparePrice != null ? String(p.comparePrice) : "",
          stockQuantity: String(p.stockQuantity),
          categoryId: p.category?.id ?? "",
          imageUrls: Array.isArray((p as any).imageUrls) ? (p as any).imageUrls : (p.imageUrl ? [p.imageUrl] : []),
          isActive: p.isActive,
          isNew: (p as any).isNew ?? false,
          isFeatured: (p as any).isFeatured ?? false,
          variants: Array.isArray((p as any).variants) ? (p as any).variants : [],
        });
        setNameEdited(true);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [productId, isEdit]);

  const set = (field: keyof FormData, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleNameChange = (val: string) => {
    set("name", val);
    if (!nameEdited) set("slug", slugify(val));
  };

  // ── Images ──────────────────────────────────────────────────────────────────

  const handleUploadImage = async (file: File, index: number | "new") => {
    setUploading(index);
    try {
      const url = await uploadToCloudinary(file);
      setForm((f) => {
        const urls = [...f.imageUrls];
        if (index === "new") urls.push(url);
        else urls[index as number] = url;
        return { ...f, imageUrls: urls };
      });
    } catch { /* ignore */ }
    finally { setUploading(null); }
  };

  const removeImage = (i: number) => setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, idx) => idx !== i) }));

  const addUrlImage = () => {
    const url = urlInput.trim();
    if (!url) return;
    setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, url] }));
    setUrlInput("");
    setShowUrlInput(false);
  };

  // ── Variants ─────────────────────────────────────────────────────────────────

  const addVariant = () => {
    const name = newVariantName.trim();
    if (!name) return;
    if (form.variants.some((v) => v.name.toLowerCase() === name.toLowerCase())) return;
    setForm((f) => ({ ...f, variants: [...f.variants, { name, values: [] }] }));
    setNewVariantName("");
  };

  const removeVariant = (i: number) => setForm((f) => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));

  const addVariantValue = (i: number) => {
    const val = (variantValueInputs[i] || "").trim();
    if (!val) return;
    if (form.variants[i].values.includes(val)) {
      setVariantValueInputs((prev) => ({ ...prev, [i]: "" }));
      return;
    }
    setForm((f) => {
      const variants = [...f.variants];
      variants[i] = { ...variants[i], values: [...variants[i].values, val] };
      return { ...f, variants };
    });
    setVariantValueInputs((prev) => ({ ...prev, [i]: "" }));
  };

  const removeVariantValue = (vi: number, val: string) =>
    setForm((f) => {
      const variants = [...f.variants];
      variants[vi] = { ...variants[vi], values: variants[vi].values.filter((v) => v !== val) };
      return { ...f, variants };
    });

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      stockQuantity: Number(form.stockQuantity),
      categoryId: form.categoryId,
      imageUrls: form.imageUrls,
      isActive: form.isActive,
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      variants: form.variants,
    };
    try {
      if (isEdit) {
        await api.put(`/products/${productId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      router.push("/gestion/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const discount = form.comparePrice && form.price
    ? Math.round((1 - Number(form.price) / Number(form.comparePrice)) * 100)
    : null;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/gestion/products" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">{isEdit ? "Modifier le produit" : "Nouveau produit"}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{isEdit ? "Mettez à jour les informations" : "Remplissez les informations du produit"}</p>
        </div>
      </div>

      {error && <div className="mb-6 bg-red-50 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Infos générales ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Informations générales</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nom du produit *</label>
              <input
                type="text" required value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                placeholder="Écouteurs Bluetooth Pro ANC"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Slug URL *</label>
              <input
                type="text" required value={form.slug}
                onChange={(e) => { setNameEdited(true); set("slug", e.target.value); }}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none focus:border-primary/50 transition-colors"
                placeholder="ecouteurs-bluetooth-pro"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Catégorie *</label>
              <select
                required value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors bg-white"
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description *</label>
              <textarea
                required value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors resize-none"
                placeholder="Description du produit…"
              />
            </div>
          </div>
        </div>

        {/* ── Prix & Stock ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Prix & Stock</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Prix (FCFA) *</label>
              <input
                type="number" required min={0} value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                placeholder="15000"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Prix barré (FCFA)
                {discount && <span className="ml-2 text-green-600 font-black">-{discount}%</span>}
              </label>
              <input
                type="number" min={0} value={form.comparePrice}
                onChange={(e) => set("comparePrice", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                placeholder="25000"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stock *</label>
              <input
                type="number" required min={0} value={form.stockQuantity}
                onChange={(e) => set("stockQuantity", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
                placeholder="50"
              />
            </div>
          </div>
        </div>

        {/* ── Images ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Images du produit</h2>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Cloudinary CDN</span>
          </div>
          <p className="text-xs text-gray-400">La première image est l'image principale. Ajoutez-en plusieurs pour la galerie.</p>

          <div className="grid grid-cols-4 gap-3">
            {form.imageUrls.map((url, i) => (
              <div key={i} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <img src={url} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">Principal</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className={`cursor-pointer p-1.5 bg-white rounded-lg ${uploading === i ? "opacity-50 pointer-events-none" : ""}`} title="Remplacer">
                    {uploading === i ? <Loader2 size={14} className="animate-spin text-primary" /> : <Upload size={14} className="text-gray-700" />}
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadImage(f, i); }} />
                  </label>
                  <button type="button" onClick={() => removeImage(i)} className="p-1.5 bg-white rounded-lg hover:bg-red-50">
                    <X size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add new image */}
            <div className="aspect-square flex flex-col gap-2">
              <label className={`flex-1 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors gap-1 ${uploading === "new" ? "opacity-60 pointer-events-none" : ""}`}>
                {uploading === "new" ? <Loader2 size={18} className="text-primary animate-spin" /> : <Upload size={18} className="text-gray-300" />}
                <span className="text-[10px] text-gray-400 font-bold">Upload</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUploadImage(f, "new"); }} />
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="flex items-center justify-center gap-1 text-[10px] font-bold text-gray-400 hover:text-primary border border-gray-200 rounded-lg py-1"
              >
                <ExternalLink size={10} /> URL
              </button>
            </div>
          </div>

          {showUrlInput && (
            <div className="flex gap-2">
              <input
                type="url" value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrlImage())}
                placeholder="https://images.unsplash.com/…?w=800&q=80"
                className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50"
              />
              <button type="button" onClick={addUrlImage} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold">
                Ajouter
              </button>
            </div>
          )}
        </div>

        {/* ── Variantes ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Variantes</h2>
              <p className="text-xs text-gray-400 mt-0.5">Taille, couleur, pointure… Le client devra choisir avant d'ajouter au panier.</p>
            </div>
          </div>

          {form.variants.length === 0 && (
            <p className="text-xs text-gray-400 italic">Aucune variante — produit unique.</p>
          )}

          {form.variants.map((variant, vi) => (
            <div key={vi} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="text" value={variant.name}
                  onChange={(e) => {
                    const variants = [...form.variants];
                    variants[vi] = { ...variants[vi], name: e.target.value };
                    set("variants", variants);
                  }}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:border-primary/50"
                  placeholder="Nom de la variante (ex: Taille)"
                />
                <button type="button" onClick={() => removeVariant(vi)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                  <X size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {variant.values.map((val) => (
                  <span key={val} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {val}
                    <button type="button" onClick={() => removeVariantValue(vi, val)} className="text-gray-400 hover:text-red-500">
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={variantValueInputs[vi] || ""}
                    onChange={(e) => setVariantValueInputs((prev) => ({ ...prev, [vi]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVariantValue(vi); } }}
                    placeholder="Ajouter une valeur…"
                    className="border border-dashed border-gray-300 rounded-full px-2.5 py-1 text-xs outline-none focus:border-primary/50 w-36"
                  />
                  <button type="button" onClick={() => addVariantValue(vi)} className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                    <Plus size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              type="text" value={newVariantName}
              onChange={(e) => setNewVariantName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVariant(); } }}
              placeholder="Nom de la variante (Taille, Couleur, Pointure…)"
              className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary/50"
            />
            <button type="button" onClick={addVariant} className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
              <Plus size={14} /> Ajouter
            </button>
          </div>
        </div>

        {/* ── Badges & Statut ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Badges & Statut</h2>
          <div className="space-y-3">
            <Toggle
              value={form.isActive}
              onChange={(v) => set("isActive", v)}
              label="Produit actif"
              sub={form.isActive ? "Visible dans le catalogue" : "Masqué dans le catalogue"}
            />
            <div className="h-px bg-gray-100" />
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Toggle
                  value={form.isNew}
                  onChange={(v) => set("isNew", v)}
                  label={<span className="flex items-center gap-1.5">Badge <span className="text-blue-600 font-black text-xs bg-blue-50 px-1.5 py-0.5 rounded-full">Nouveau</span></span> as any}
                  sub="Affiche un badge Nouveau sur la carte produit"
                />
              </div>
            </div>
            <div className="h-px bg-gray-100" />
            <Toggle
              value={form.isFeatured}
              onChange={(v) => set("isFeatured", v)}
              label="Produit mis en avant"
              sub="Apparaît dans les sections Featured / Coups de cœur"
            />
          </div>
          {form.comparePrice && form.price && (
            <div className="mt-2 bg-green-50 text-green-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2">
              <Tag size={13} /> Prix barré actif → badge <strong>-{discount}%</strong> affiché automatiquement
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit" disabled={saving}
            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {saving ? "Enregistrement…" : isEdit ? "Mettre à jour le produit" : "Créer le produit"}
          </button>
          <Link href="/gestion/products" className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors no-underline">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
