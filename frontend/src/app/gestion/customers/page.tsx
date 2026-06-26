"use client";

import { useEffect, useState } from "react";
import { Search, Users, ShoppingBag, ChevronRight, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { api, ApiUser } from "@/lib/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get<ApiUser[]>("/users")
      .then((users) => setCustomers(users.filter((u) => u.role === "CUSTOMER")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    search === "" ||
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {customers.length} client{customers.length !== 1 ? "s" : ""} enregistré{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 shadow-sm">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm text-gray-700 w-48 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
            <Users size={18} className="text-white" />
          </div>
          <p className="text-2xl font-black text-gray-900">{customers.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Clients totaux</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mb-3">
            <ShoppingBag size={18} className="text-white" />
          </div>
          <p className="text-2xl font-black text-gray-900">—</p>
          <p className="text-xs text-gray-500 mt-0.5">Ont commandé</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-3">
            <Users size={18} className="text-white" />
          </div>
          <p className="text-2xl font-black text-gray-900">
            {customers.filter((c) => {
              const created = new Date(c.createdAt);
              const now = new Date();
              return now.getTime() - created.getTime() < 7 * 24 * 60 * 60 * 1000;
            }).length}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Cette semaine</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Contact</th>
              <th className="text-left px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Inscription</th>
              <th className="text-right px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td colSpan={4} className="px-6 py-4">
                  <div className="animate-pulse h-8 bg-gray-100 rounded" />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                  {search ? "Aucun client trouvé" : "Aucun client enregistré"}
                </td>
              </tr>
            )}
            {!loading && filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-black text-primary">
                        {customer.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{customer.fullName}</p>
                      <p className="text-[11px] text-gray-400 font-mono">{customer.id.slice(0, 8)}…</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Mail size={11} className="text-gray-400" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Phone size={11} className="text-gray-400" />
                    {customer.phone}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/gestion/customers/${customer.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline no-underline"
                  >
                    Voir détails <ChevronRight size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
