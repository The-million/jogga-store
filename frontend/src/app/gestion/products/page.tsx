"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { api, ApiProduct } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.get<ApiProduct[]>("/products/admin/all")
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/${id}`);
      setProducts((p) => p.filter((x) => x.id !== id));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Produits</h1>
          <p className="text-gray-500 text-sm mt-0.5">{products.length} produit{products.length !== 1 ? "s" : ""} au total</p>
        </div>
        <Link href="/gestion/products/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors no-underline">
          <Plus size={16} /> Nouveau produit
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou catégorie…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Produit</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Catégorie</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Prix</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Stock</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
              <th className="text-right px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="animate-pulse flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-2.5 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Aucun produit trouvé</td></tr>
            )}
            {!loading && filtered.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">🛍️</div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                    {product.category?.name ?? "—"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">{Number(product.price).toLocaleString("fr-FR")} FCFA</p>
                  {product.comparePrice && (
                    <p className="text-xs text-gray-400 line-through">{Number(product.comparePrice).toLocaleString("fr-FR")} FCFA</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold ${product.stockQuantity < 5 ? "text-red-600" : product.stockQuantity < 20 ? "text-amber-600" : "text-green-600"}`}>
                    {product.stockQuantity} unités
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${product.isActive ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"}`}>
                    {product.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/gestion/products/${product.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-primary no-underline" title="Modifier">
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500 disabled:opacity-50"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
