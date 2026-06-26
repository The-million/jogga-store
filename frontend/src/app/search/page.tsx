"use client";

import { useState } from "react";
import { Search, ArrowLeft, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-md mx-auto px-4 pt-4">
      <header className="flex items-center gap-3 mb-6">
        <Link href="/" className="glass p-2.5 rounded-xl">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 glass flex items-center gap-2 px-4 py-2.5 rounded-2xl">
          <Search size={16} className="text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted/50"
            autoFocus
          />
        </div>
      </header>

      {!query && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-text-muted" />
            <span className="text-xs text-text-muted font-medium">RECHERCHES RÉCENTES</span>
          </div>
          <div className="space-y-1">
            {["écouteurs", "montre connectée", "batterie externe"].map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="w-full glass p-3 rounded-xl text-sm text-text text-left hover:bg-primary/5 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-6 mb-3">
            <TrendingUp size={14} className="text-accent" />
            <span className="text-xs text-text-muted font-medium">TENDANCES</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["enceinte bluetooth", "lampe LED", "gourde isotherme", "tapis yoga", "sac à dos"].map((t) => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                className="glass px-3 py-1.5 rounded-full text-xs text-text-muted hover:text-primary transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {query && (
        <div className="text-center py-10 text-text-muted">
          <Search size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Recherche de &quot;{query}&quot;</p>
          <p className="text-xs mt-1 opacity-50">Connectez l&apos;API pour les résultats</p>
        </div>
      )}
    </div>
  );
}
