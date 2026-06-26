"use client";

import { Menu, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Hamburger */}
        <button className="p-1.5 -ml-1.5">
          <Menu size={22} className="text-text" />
        </button>

        {/* Logo */}
        <h1 className="text-lg font-black text-primary tracking-tight uppercase">
          JOGGA <span className="text-text">STORE</span>
        </h1>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          <Link href="/search" className="p-1.5">
            <Search size={20} className="text-text" />
          </Link>
          <Link href="/cart" className="p-1.5 relative">
            <ShoppingCart size={20} className="text-text" />
            <span className="badge-cart absolute -top-0.5 -right-0.5">3</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
