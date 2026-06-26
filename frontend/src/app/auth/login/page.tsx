"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation — à connecter à l'API POST /auth/login
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    // Redirection vers l'accueil après login réussi
    window.location.href = "/";
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-slate-100">
        <Link href="/" className="p-1.5 -ml-1.5">
          <ArrowLeft size={21} />
        </Link>
        <h1 className="text-sm font-black text-text uppercase tracking-wider">Connexion</h1>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col justify-center px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-primary tracking-tight uppercase">
            JOGGA <span className="text-text">STORE</span>
          </h2>
          <p className="text-xs text-text-muted mt-2">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-text placeholder:text-text-light outline-none focus:border-primary/30 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5 block">
              Mot de passe
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-12 text-sm text-text placeholder:text-text-light outline-none focus:border-primary/30 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text-muted transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-[11px] font-semibold text-primary hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider disabled:opacity-60 shadow-lg shadow-primary/20 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connexion...
              </span>
            ) : (
              "Se connecter"
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[10px] text-text-muted font-semibold uppercase">ou</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Register link */}
        <p className="text-center text-xs text-text-muted">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-primary font-bold hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-[10px] text-text-light">
          En vous connectant, vous acceptez nos{" "}
          <Link href="#" className="underline">Conditions</Link> et notre{" "}
          <Link href="#" className="underline">Politique de confidentialité</Link>
        </p>
      </div>
    </div>
  );
}
