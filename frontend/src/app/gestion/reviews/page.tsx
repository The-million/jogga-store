"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

type AdminReview = {
  id: string;
  rating: number;
  comment: string | null;
  isVisible: boolean;
  createdAt: string;
  user: { fullName: string };
  product: { name: string; slug: string };
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12} className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "1" | "2" | "3" | "4" | "5">("ALL");

  const load = () => {
    setLoading(true);
    api.get<AdminReview[]>("/admin/reviews")
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string, productSlug: string) => {
    if (!confirm("Supprimer cet avis ?")) return;
    try {
      await api.delete(`/products/${productSlug}/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) { alert(e.message); }
  };

  const filtered = filter === "ALL" ? reviews : reviews.filter((r) => r.rating === Number(filter));

  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const byRating = [5, 4, 3, 2, 1].map((n) => ({
    n, count: reviews.filter((r) => r.rating === n).length,
  }));

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Avis clients</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {reviews.length} avis · Note moyenne : <strong>{avg}/5</strong>
        </p>
      </div>

      {/* Répartition par étoiles */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-5xl font-black text-gray-900">{avg}</p>
            <Stars rating={Math.round(Number(avg))} />
            <p className="text-xs text-gray-400 mt-1">{reviews.length} avis</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {byRating.map(({ n, count }) => (
              <div key={n} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-4">{n}</span>
                <Star size={11} className="text-yellow-400 fill-yellow-400 shrink-0" />
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-5 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["ALL", "5", "4", "3", "2", "1"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              filter === f ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-200 hover:border-primary/40"
            }`}
          >
            {f === "ALL" ? "Tous" : `${f} ⭐`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Produit</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Note</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Commentaire</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-right px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="animate-pulse h-8 bg-gray-100 rounded" /></td></tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Aucun avis</td></tr>
            )}
            {!loading && filtered.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">{review.user.fullName}</p>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/${review.product.slug}`} target="_blank" className="text-xs font-semibold text-primary hover:underline no-underline line-clamp-1 max-w-[180px]">
                    {review.product.name}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Stars rating={review.rating} />
                </td>
                <td className="px-6 py-4 max-w-[200px]">
                  <p className="text-xs text-gray-600 line-clamp-2">{review.comment ?? <span className="text-gray-300 italic">Sans commentaire</span>}</p>
                </td>
                <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">{formatDate(review.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(review.id, review.product.slug)}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
