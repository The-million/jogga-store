"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    window.location.href = "/auth/login";
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh flex flex-col">
      <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100">
        <Link href="/auth/login" className="p-1.5 -ml-1.5"><ArrowLeft size={21} /></Link>
        <h1 className="text-sm font-black text-text uppercase tracking-wider">Inscription</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-primary tracking-tight uppercase">
            JOGGA <span className="text-text">STORE</span>
          </h2>
          <p className="text-xs text-text-muted mt-2">Créez votre compte gratuitement</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          {[
            { icon: User, label: "Nom complet", field: "fullName", type: "text", placeholder: "Jean K." },
            { icon: Phone, label: "Téléphone WhatsApp", field: "phone", type: "tel", placeholder: "+242 06 123 4567" },
            { icon: Mail, label: "Email", field: "email", type: "email", placeholder: "votre@email.com" },
          ].map(({ icon: Icon, label, field, type, placeholder }) => (
            <div key={field}>
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5 block">{label}</label>
              <div className="relative">
                <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
                <input type={type} value={(form as any)[field]} onChange={(e) => update(field, e.target.value)}
                  placeholder={placeholder} required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-text placeholder:text-text-light outline-none focus:border-primary/30 focus:bg-white transition-all" />
              </div>
            </div>
          ))}

          <div>
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5 block">Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
              <input type={showPassword ? "text" : "password"} value={form.password}
                onChange={(e) => update("password", e.target.value)} placeholder="6 caractères minimum" required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-12 text-sm outline-none focus:border-primary/30 focus:bg-white transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text-muted">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider disabled:opacity-60 shadow-lg shadow-primary/20 mt-3">
            {loading ? "Création du compte..." : "Créer mon compte"}
          </motion.button>
        </form>

        <p className="text-center text-xs text-text-muted mt-6">
          Déjà un compte ? <Link href="/auth/login" className="text-primary font-bold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
